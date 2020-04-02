<div class="local-key-security">

# Local Key Security
How to encrypt and decrypt locally stored keys on your various devices.

### The Basic Idea

Whenever a user stores a secret key on a device, the secret should be encrypted
with her passphrase, <em>and</em> if she changed her passphrase on any one of
her machines, it would be reflected on the others.

We've developed a simple server-aided protocol to do so, in which a server-side
mask is updated during a password change, so that encrypted device keys on
offline clients will be decryptable with the new password. The server supplies
this mask during decryption, but device keys are never exposed to the server,
even in encrypted form.

There are five important steps to consider: [key
establishment](#key-establishment),
[encrypting/decrypting](#encrypting-and-decrypting), [key storage on the
device](#key-storage-on-the-device), [password changes](#password-changes), and
[mask resets](#mask-resets-not-yet-implemented-).

### Key Establishment

On any device <tex>d</tex> that Alice needs to encrypt her device-specific keys,
she does the following, given her passphrase <tex>p_A</tex>.

- Generates a new random secret key <tex>k^d_A \in [0,2^{256}-1]</tex>, and
encrypts her device-specific keys with it.
- Computes <tex>c_A =</tex><strong>Scrypt</strong><tex>(p_A)</tex>
- Computes <tex>s^d_A = k^d_A \oplus c_A</tex>
- Sends <tex>s^d_A</tex> to the server, which it stores under device <tex>d</tex>.


### Encrypting and Decrypting

Here's how Alice would encrypt or decrypt on device <tex>d</tex>. Of course
the operation is symmetric, so they are handled equivalently:

- Alice authenticates herself to the server.
- Alice computes <tex>c_A</tex> from <tex>p_A</tex> via Scrypt.
- Alice asks for <tex>s^d_A</tex> for device <tex>d</tex>.
- Alice computes <tex>k^d_A = s^d_A \oplus c_A</tex>.
- Encrypts or decrypts device-specific keys using <tex>k^d_A</tex> and
  NaCl's <a href="http://nacl.cr.yp.to/secretbox.html">SecretBox</a>.

### Key Storage on the Device

We prefer not to constantly prompt the user for passwords and instead store the
decryption key locally while logged in. On macOS, iOS, and Android we store
<tex>k^d_A</tex> in the OS's keychain, since those OSes have nice hardware
integrations which provide deletion guarantees and reasonably standard keychain
systems.

On Windows, and also on Linux systems without a keyring installed, in lieu of a
standard keychain we so instead we do the following:
- Generate a 2MB file of random data, call it <tex>f</tex>
- Hash <tex>f</tex> to a 32-byte key <tex>h</tex>
- Encrypt <tex>k^d_A</tex> with <tex>h</tex>, and write that to your home directory.

This means that all the elements to decrypt your private keys are in your home
directory, but when you `logout` or unclick `remember passphrase`, we zero out
the file <tex>f</tex>. The thought here is that even if <tex>f</tex> is on an
SSD (which makes it hard to actually delete file blocks), it's still very
challenging for an attacker who has access to your unencrypted SSD to construct
<tex>f</tex>, decrypt <tex>k^d_A</tex>, and then decrypt your secret keys.

On Linux systems with a keyring (gnome-keyring or KWallet), we use a split keyring
system:
- Generate a new 32-byte key <tex>r</tex>, and store this in the system keyring
  in the default collection
- Generate a 2MB noise file <tex>f</tex> as described above
- Compute <tex>p=\text{HKDF-SHA256}(f \Vert r, \text{salt}={nil}, \text{info}=\text{Keybase-Derived-LKS-SecretBox-1})\text{[:32]}</tex>
- Encrypt <tex>k^d_A</tex> with <tex>p</tex> using NaCl SecretBox, and store this file and <tex>f</tex> to your home directory

With this scheme, when you try to logout or uncheck &ldquo;Remember
Passphrase,&rdquo; we both shred the noise file and delete <tex>r</tex> from
the system keyring. In the event that your hard drive has been compromised,
<tex>r</tex> will still be encrypted with your system keyring, so your
passphrase remains secret. On the other hand, if due to some bug in the system
keyring, it fails to delete <tex>r</tex> securely, Keybase has shredded the
noise file <tex>f</tex> and so, the passphrase is still unrecoverable
(symmetrically for the case where we are unable to securely shred the noise
file).

For Keybase to use this scheme, your system keyring must be enabled and running
before logging in. Note that we do not currently use this scheme for users
who [sign up without a passphrase](#signing-up-without-a-passphrase).

### Password Changes

Alices now updates her password from <tex>p_A</tex> to <tex>p_A'</tex> on one
of her devices.  She runs the password update protocol:

- Compute <tex>c_A = </tex><strong>Scrypt</strong><tex>(p_A)</tex> and
<tex>c_A' = </tex><strong>Scrypt</strong><tex>(p_A')</tex>
- Compute <tex>\delta = c_A \oplus c_A'</tex>.
- Sends <tex>\delta</tex> to the server.
- For each device <tex>d</tex>:
- Update <tex>s^d_A' \leftarrow s^d_A \oplus \delta</tex>


### Mask Resets (not yet implemented)

One vulnerability of the password change scheme above, is that it's possible to
decrypt secret keys using an old password. If a user's password was
compromised, and an attacker was also able to obtain the user's server-side
mask <tex>s^d_A</tex>, then that attacker would be able to decrypt the user's
local keys <em>even after</em> the user did a password change.

To prevent this, when decrypting keys, a device should notice that the current
passphrase is newer than the one its keys were originally encrypted with. In
that case it should generate an entirely new encryption key, repeating the
steps from [Key Establishment](#key-establishment) above. Note that this has to
be done in a way that's resilient to the device crashing in the middle, so that
there's never a risk that the user could end up in a state where their keys are
impossible to decrypt. We can use the following procedure.

1. Generate a new random encryption key.
1. Encrypt the device-specific keys with the new encryption key, storing this
ciphertext on disk <em>in addition</em> to the old ciphertext. Each ciphertext
should be stored with the generation number of the passphrase that was
originally used to encrypt it, to distinguish them.
1. Compute the new server-side mask and send it to the server along with the
passphrase generation it corresponds to.
1. Only after the previous step succeeds, delete the old ciphertext from disk.

If the device happens to crash after (2) but before (4), it will have two
ciphertexts on disk. When it goes to decrypt them, it will find that the
server-side mask's passphrase generation corresponds to only one of them. After
successfully decrypting that one, it should delete the other, and then if the
passphrase generation of the key is still behind it should attempt another mask
reset.

Note that a device that's persistently offline (as in, mothballed in your
closet) won't have an opportunity to do a mask reset, and encrypted keys on
such a device will still be decryptable using old passwords/masks until that
device is used again. But it's unavoidable that a disk that hasn't changed in N
years will still be readable with keys from N years ago -- we can't magically
change the contents of the disk in the closet.

This scheme isn't implemented yet, but here are the changes we will need to
make to support it in the future:

- On the server, store the passphrase generation that each mask was originally
created with. This makes it easier for the client to clean up after itself if
it crashes in the middle of a mask refresh.
- On the device, store the passphrase generation that each encrypted device key
was originally encrypted with. This will get compared to the user account's
current passphrase generation when masks are fetched, to decide whether a mask
reset is needed.

### Example

Here's a sketch of what a passphrase update and later mask refresh should look
like on the server and client.

In the beginning there's one device key and one server-side mask. Note that
we're only seeing the server masks for this specific device key. The same user
will have more masks for other devices, and also for other device keys on the
same device. (We could in theory use the same LKS encryption key for all device
keys on one device, but we've implemented it with a unique LKS key for each
device key.)

<pre>
    SERVER
    key id | current | mask | passphrase gen | last reset gen
    -------|---------|------|----------------|---------------
    0x4    | *       | fabc | 1              | 1

    DEVICE
    key id | passphrase gen | device key ciphertext | [computed encryption key, not stored]
    -------|----------------|-----------------------|---------------------------------------
    0x4    | 1              | 7314ab...             | scrypt(pp1) X fabc
</pre>

Using another device somewhere else, the user does a passphrase update. This
adds a new mask to the server, but the device we're looking at here is
unchanged. (There's now a new way to compute the encryption key, but this just
a fact about the world, not actual data on disk.)

<pre>
    SERVER
    key id | current | mask | passphrase gen | last reset gen
    -------|---------|------|----------------|---------------
    0x4    |         | fabc | 1              | 1
    0x4    | *       | d123 | 2              | 1

    DEVICE
    key id | passphrase gen | device key ciphertext |[computed encryption key, not stored]
    -------|----------------|-----------------------|-----------------------
    0x4    | 1              | 7314ab...             | scrypt(pp1) X fabc, scrypt(pp2) X d123
</pre>

Later, our device wakes up, gets the latest passphrase from the user, and does
a mask reset. It generates a new LKS key, uses that to encrypt another copy of
the key locally, and then sends the new mask to the server.

<pre>
    SERVER
    key id | current | mask | passphrase gen | last reset gen
    -------|---------|------|----------------|---------------
    0x4    |         | fabc | 1              | 1
    0x4    |         | d123 | 2              | 1
    0x4    | *       | e456 | 2              | 2

    DEVICE
    key id | passphrase gen | device key ciphertext |[computed encryption key, not stored]
    -------|----------------|-----------------------|-----------------------
    0x4    | 1              | 7314ab...             | scrypt(pp1) X fabc, scrypt(pp2) X d123
    0x4    | 2              | cc6142...             | scrypt(pp2) X e456
</pre>

For security (and the whole point of the mask reset to begin with), the device
should now delete the original device key ciphertext, and keep only the new
one. It must guarantee that the server has the latest mask before it does that,
to avoid accidentally losing access to the device key forever. The server could
delete old device masks, but the security model here assumes that it can't
reliably do that, so the masks could also be kept around for auditability, and
just in case of client bugs.

### Signing up without a passphrase
As of client version 3.2, new Keybase users are not asked to set a password
upon signup. The client will generate a random 16-byte passphrase and store it
as described above (this occurs automatically; the random passphrase is not
revealed in the UI). When users provision new devices, as usual, the passphrase
is sent over the secure channel provided by [KEX](/docs/crypto/key-exchange).

The following actions are not allowed for users without a passphrase.
- Logging out
- Signing in on the website [keybase.io](/)
- Using the [server-synced encrypted PGP key feature](/docs/api/1.0/p3skb_format)

Users can opt to set a passphrase after the fact to perform those actions, and
in particular, users are prompted to set one when they try to log out.
[Lockdown mode](/docs/lockdown/index) may be of interest to users who want to set
a passphrase but do not want attackers to be able to reset their Keybase account
in the event that their passphrase is compromised.

