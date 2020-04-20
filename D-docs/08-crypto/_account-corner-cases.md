# Keybase Account Corner Cases (Plan)

This document covers corner cases involving device loss, device
revocation, password reset, and account reset.  These issues
are closely related and are covered in sum.

We call the various reset mechanisms "corner cases" since they
will be rare, but unfortunately, they will require a fair amount
of work to get right.

**Important note!** Most of this document isn't yet implemented. We're pretty
busy over here and haven't completed all aspects of the system. However, the
standard and forced password change mechanisms do work. In the interim, a bad
guy who steals an unlocked phone can do a lot of damage.

## Account Probation

The purpose of account *probation* is to prevent a bad guy from stealing one
device, and then pressing his advantage to gain complete control of the
account. For instance, with an unlocked phone, an attacker can change
passphrases, revoke old devices, and add new ones.

**Entering**. Users enter probation when they "force-reset" their
passphrase from a provisioned device, and they have more than one currently
provisioned device. The server sends email and push notifications upon this
transition, alerting the user of why probation started, how long it lasts,
and how to short-circuit out of it.

**During**. Probation lasts for 5 days, and during this time, users cannot
revoke devices (i.e., they cannot revoke sibkey or subkey signatures),
they cannot reset their accounts, and they cannot change their email addresses.

**Leaving**. User accounts leave probation if:

   * the specified timeout elapses;
   * a device that was authorized before the start of probation signs an "early-release" statement;
   * or if the user proves knowledge of the passphrase in use before probation started.

If a user leaves probation before the timeout, he/she has the option to
simultaneously revoke the device that caused entry into probation (on the
assumption that it was stolen and controlled by an adversary).

## Passphrase Changes

Passphrases on keybase are not commonly used, but they have the following
important roles:

  * **Local Key Security (LKS)**. Passphrases lock local secret keys on
    desktop machines. So to "unlock" a secret key, a user needs to type
    his/her keybase passphrase. Users can check a "remember my passphrase"
    box so this unlocking might only happen once.
  * **Login**. Though logins typically happen via public-key authentication, they
    can also occur via passphrase.
  * **Signature Revocations**. Whenever a user wants to revoke a signature,
    he/she needs to prove knowledge of the current passphrase.  This is to
    prevent an attacker who just stole a user's phone from deauthorizing
    the user's other devices.
  * **Account Reset**. Proof of passphrase knowledge is one of two factors
    required for an account reset.
  * **Standard Passphrase Update**. If a user knows his/her current passphrase,
    he/she can update to a new one without much disturbance.
  * **Email address changes**.  A user needs to prove knowledge of the current
    passphrase before he/she can change email addresses (which is a usual requirement).
  * **Erasing KBFS History**. Permanently erasing KBFS history requires a passphrase.
    Just `rm`'ing a file does not, since there's still a snapshot of the file.

### Standard Passphrase Change

In standard passphrase reset, the user proves knowledge of the old
passphrase and sets a new one.  Many things about the user's account change,
like: LKS server-halves; encrypted LKS client halves; and the user's
server-stored passphrase hash.  However, the account doesn't change into
probation mode.

### Forced Passphrase Change

In a forced passphrase update, the user has forgotten his/her passphrase
and must replace it with a new one.  He/she can do this if she has access
to an unlocked signing key. The same server-side changes need to happen,
but in addition, the account goes into probation mode.

## Email Address Changes

Users can change their email address if they prove knowledge of the current
passphrase, and aren't in a probationary period.

## Device Revocation

To revoke a device, the user must revoke the signatures that provisioned
the device in the first place. To revoke signatures, the user must:

   * have access to a valid signing sibkey secret-key (can be a device key or a backup key)
   * have a valid session
   * prove knowledge of the current passphrase hash
   * not be in a probationary state

The last two bullets points, combined, protect the user against an attack
in which the Alice recovers Bob's device, and then starts revoking
(immediately) the Bob's other devices, locking him out of his account.
Alice must carry on this attack over ~5 days with the probationary waiting
period.

## Backup Keys

Each user should provision a pair of backup keys for their account.  They won't be asked
to do so when they first sign up, but they should do so after they have been using the system
for a little bit.  The intended use is the backup keys are written down to a piece of paper
and then squirreled away in a desk drawer or a safety deposit box.  In practice, a sequence
of 11 randomly generated words can be stretched into the needed backup keys, but it is
crucial that this passphrase has at least 128 bits of true entropy, and therefore shouldn't
be trusted to weak human-generated entropy.

Backup keys are different from device keys in that they are not protected with local key
security.  Having access to the piece of paper the backup key is written down on is enough
to use the key.

Otherwise, backup keys behave like regular keys.

### Implementation

Backup keys are generated as follows:

   1. Pick 11 random words from the [BIP0039](https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt) dictionary.
   1. Stretch the secret via scrypt (with an empty salt)
   1. Use 32 bytes for a secret EdDSA key, and 32 bytes as a secret Curve25519 DH key.
   1. Sign the corresponding public keys into the signature chain.

Thus, possession of the 11 secret words from step 1 suffice to regenerate the signing
and encryption keys in Step 3.

## Account Resets

In an account reset, a user must start from scratch.  She must reprovision all devices;
reprove all identities; and re-upload data to KBFS.  It's obviously a case to be
avoided in all costs, and nothing we want attackers to be able to initiate for victims.

### Easy Resets

Users might find themselves in a resettable position if: (1) they've lost all of their
active devices and (2); don't have backup keys but (3) do remember their
passphrase.  In this case, if users: (1) can prove knowledge of the currently active passphrase;
(2) can prove ownership of an email account (via link-click); and (3) aren't in probation,
then they can reset their account right away.

### Last-Ditch Resets

In a last ditch reset, the only thing the user still has is access to an email account.
In this case, the best we can do is have them click through and ask for access to
the nuclear trigger.  This is an ugly situation.  The best response I can think up is:

   1. User clicks on "last-ditch account reset"
   1. If they have a twitter proof
      1. send a Tweet: "@bob We will reset your Keybase account in 7 days as per your instructions. If this is in error, visit your settings page."
      1. Send a similar warning when the day gets closer.
   1. Every day over the next week, send an email to the user:
      1. If they click on the "Go-ahead" link all 7 times, then go ahead and nuke it.
      1. Otherwise, abandon the nuke protocol.

The only way a user can get attacked via this protocol is if the user loses control of their email account to an attacker for 7 days or more. The attacked would need to hide these emails from the
user, and click on the "Go ahead" link before the user clicks on the "cancel" link.

