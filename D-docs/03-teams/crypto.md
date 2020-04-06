
# Teams Crypto

Each team has a set of per-team keys (PTKs). The specifics are very similar to [PUKs](puk).
A user creates a set of PTKs when posting a `team.root` or a `team.subteam_head` link,
as described in [Team Sigchain Details](details). And, a user rotates these keys
to a new a generation in a `team.rotate` link.

## PTKs

The specifics of each PTK generation are as follows:

* A user generates a 32-byte random seed _s_
* She computes _e_ = HMAC(_s_, `"Keybase-Derived-Team-NaCl-EdDSA-1"`) and uses this value as the secret key for an EdDSA signing key. She then computes the public half, yielding keypair (_E_, _e_).
* She computes _d_ = HMAC(_s_, `"Keybase-Derived-Team-NaCl-DH-1"`) and uses this value as a secret key for a Curve25519 DH encryption key. She then computes the public half,
yielding keypair (_D_,_d_)
* She computes _c_ = HMAC(_s_, `"Keybase-Derived-Team-NaCl-SecretBox-1"`) to use as a
secret key in NaCl secretbox when encrypting previous seeds _s_. (See below for details)

Where HMAC is computed with SHA512, and truncated to the first 32 bytes.

This process is repeated at every generation _i_. At generation _i_, the keys <i>E<sub>i</sub></i>
and <i>D<sub>i</sub></i> are signed into the team's public sigchain. Whenever a new user is added,
<i>s<sub>i</sub></i> is encrypted for the user's public PUK DH key. This make <i>s<sub>i</sub></i> available on every device for the user. This box is written to the main the DB. The current <i>s<sub>i</sub></i> should have a box for every team member, whether implicit or explicit.

When a team member revokes a device, or a team member is reset, or a user
leaves or is removed from a team, the PTK must rotate. This can happen lazily.
The new PTK keys are encrypted for all remaining members, and the new public
key halves are written into the team's sigchain. Also, whenever the key rolls
over, the previous seed <i>s<sub>i</sub></i> is encrypted with
<i>c<sub>i+1</sub></i> via NaCl's SecretBox symmetric encryption, just as with
users. See the description of [Cascading Lazy Key Rotation](clkr) for more details
about how this rotation is orchestrated.

## Application Keys

Team members derive application keys from the shared seeds <i>s<sub>i</sub></i> described
above:

* For KBFS: HMAC(<i>s<sub>i</sub></i>, `"Keybase-Derived-Team-KBFS-1"`) ⊕ <i>S<sub>i,KBFS</sub></i>
* For Chat: HMAC(<i>s<sub>i</sub></i>, `"Keybase-Derived-Team-Chat-1"`) ⊕ <i>S<sub>i,CHAT</sub></i>

That is, the key is the XOR of a key derived from the team-shared secret <i>s<sub>i</sub></i>,
and a server-stored 32-byte random mask. For the given team, all readers, writers, owners,
and explicit admins can see these 32-byte masks. The server withholds them from implicit admins,
preventing them from viewing the chats or files encrypted with those keys.

In chat, all messages are encrypted using NaCl's secret box primitive, with the key derived
as above.  When the key is rotated, new chats are encrypted with the new key, but old chats
aren't reencrypted.

For KBFS, these derived keys take the place of <i>s<sup>f,0</sup></i>
​​
