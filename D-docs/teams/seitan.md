
# Seitan Tokens V2: Say No to TOFU

When Alice wants to invite Bob into her [team](https://keybase.io/blog
/introducing-keybase-teams), and Alice only knows Bob's phone number, she can
do so via *Seitan Tokens*.  Typically, sharing of this form is *TOFU*, or
"Trust On First Use". For example, Alice can ask a server to send an email, SMS
or push-notification to Bob, and once Bob presents that token back to the
server, Alice will let him into the team. Bob has proven ownership of whatever
address the server sent the token to. However, in this example, Alice is
trusting that the server doesn't send that token to Charlie instead. So Alice
must trust the server does what it professes, and she doesn't have mechanism to
detect malfeasance. Once Bob (or Charlie) is allowed in, then Alice can at
least ensure that Bob (or Charlie) isn't switched out on her at a later date.

Seitan Tokens are better. Assuming Alice has a pre-authenticated channel open
with Bob (via iMessage or Signal, let's say), then she can ensure that Bob is
getting in, and the Keybase servers cannot coerce her to let Charlie in
surreptitiously.

Seitan Tokens V2 enhances the security of the initial seitan ([V1](../seitan))
by preventing another admin from stealing an invite Alice generated for Bob.
We do this by not storing the secret (`iKey`) Alice generates for Bob in the
sigchain and instead generating an EdDSA keypair, writing only the public key
(`pubKey`) into the sigchain.

## High-Level Description

In a Seitan Token exchange, Alice comes up with a random token. She signs a
statement of the form: "anyone who proves knowledge of this token can be
admitted into the team." Alice need not be the one who allows the invitee into
the team; Arnie can do it too if he is a team administrator.

Say that Alice and Arnie are admins of the team `acme`, and Alice wants to
invite Bob into the team.  The protocol at a high level is simply:

1. Alice picks a random 83-bit token (called an `iKey`), and computes some
   derived data
1. The `iKey` is stretched and interpreted as the private key for an EdDSA
   keypair
1. Alice signs the encryption of the public key (`pubKey`) from the keypair into
   `acme`'s team signature chain
1. Alice sends the `iKey` to Bob over iMessage (or Signal, etc.)
1. Bob computes the keypair as Alice did and sends signature(`msg`, `bob`) to
   the Keybase servers, where the `msg` identifies Bob within keybase and an
   `inviteID` which is derived from the `iKey` (see below)
1. Alice or Arnie decrypts the encrypted `pubKey` in `acme`'s signature chain, and
   makes sure the signature that Bob sent verifies with the `pubKey`.

## Detailed Specification

Here is a more detailed specification of the above steps:

### Step 1: iKey Generation and Token Derivation

#### Step 1a: iKey Generation

Alice
[generates](https://github.com/keybase/client/blob/98327b58939a5b769fb2025743a31fcd08c7265b/go/teams/seitan.go#L58-L88)
a 17-character random string from the alphbabet
`abcdefghjkmnpqrsuvwxyz23456789`, meaning all letters and numbers, save `i`,
`l`, `o`, `t`, `0`, and `1`.  Insert a `+` character at position 6 (0-indexed).
This is called the `iKey` or "invitation-key".  Examples look like:
`zmh6ff+2jv975gh56p` or `bxsnrd+dj882d9mmq9`.

We include a `+` sign so these tokens can be distinguished from team names and
email-based TOFU tokens. [Any
token](https://github.com/keybase/client/blob/98327b58939a5b769fb2025743a31fcd08c7265b/go/teams/seitan_v2.go#L28-L34)
with a `+` sign, at index >1, and with more than 6 characters is considered a
seitan token by the Keybase client, so that mis-spelled or mangled tokens
aren't accidentally sent to the server as team names or email tokens.

### Step 1b: Stretch IKey to Discourage Server Brute-Force

The `iKey` generated in the previous step only has ~83 bits of entropy. It will eventually
be transferred over iMessage or even SMS, so we're slightly space constrained here. Thus, Alice
further stretches this key via scrypt to discourage brute-force exhaustion of the token space:

Alice
[computes](https://github.com/keybase/client/blob/98327b58939a5b769fb2025743a31fcd08c7265b/go/teams/seitan.go#L146-L148)
`siKey`, meaning "Stretched Invitation Key": `siKey` = **scrypt**(ikey, C =
2<sup>10</sup>, R=8, P=1, Len=32)

### Step 1c: Computed Derived "Invitation ID"

Whenever Alice wants to invite someone like Bob into a team, and Bob hasn't
joined Keybase yet, Alice must generate an "invitation ID" to key her
invitation. Usually this is done randomly, but in this case, it's
[derived](https://github.com/keybase/client/blob/98327b58939a5b769fb2025743a31fcd08c7265b/go/teams/seitan_v2.go#L87-L101)
from the `siKey`: `inviteID` = **HMAC-SHA512**(`siKey`, **msgpack**(`{ "stage"
: "invite_id", "version": 2}`)`[0:15]`.

That is, the JSON blob `{"stage" : "invite_id", "version": 2}` is
Msgpack-encoded, and is the payload to an `HMAC-SHA512` with the `siKey` as the
MAC key. Then the first 15 bytes are used for the "invitation ID".

### Step 1d: Generate EdDSA keypair

Using the `siKey`, we
[generate](https://github.com/keybase/client/blob/98327b58939a5b769fb2025743a31fcd08c7265b/go/teams/seitan_v2.go#L103-L134)
an EdDSA keypair as follows `privKey = HMAC(sikey, {"stage" : "eddsa",
"version" : 2})[0:32]` and `pubKey = NewEdDSAPublic(privkey)` which we use
later to produce a signature to verify our invitation id.


### Step 2: Encryption and Signing of the pubKey

#### Step 2a: Encrypt the pubKey

Alice
[encrypts](https://github.com/keybase/client/blob/98327b58939a5b769fb2025743a31fcd08c7265b/go/teams/seitan_v2.go#L136-L166)
the `pubKey` so that she (and other admins) can access it later, potentially on
other devices. Alice also attaches a "label" to the `iKey`, which might
correspond to Bob's iMessage handle or phone number. This way, if she wants to
cancel the invitation later, she'll have a human-readable label to identify it
by.

The data `keyAndLabel` is computed by packing the two fields into a
[`SeitanKeyAndLabel`](https://github.com/keybase/client/blob/98327b58939a5b769fb2025743a31fcd08c7265b/protocol/avdl/keybase1/teams.avdl#L429-L433)
structure.  To encrypt the `keyAndLabel`, Alice uses the team's secret key,
with the symmetric key [derivation string](crypto):
`"Keybase-Derived-Team-NaCl-SeitanInviteToken-1"`. The nonce is a 24-byte
random, and the payload is `keyAndLabel`; these parameters are run though
NaCl's [`crypto_secretbox`](https://nacl.cr.yp.to/secretbox.html). Call this
key `ekey`, for "encrypted key". We encrypt this data so we don't leak the
human-readable label in the sigchain, i.e. Bob's phone number (the  `pubKey` is
included in this encrypted blob, although it is not necessary for any security
properties).

#### Step 2b: Pack the ekey

Alice then versions and packs this ciphertext: `pkey = pack([2, g, nonce,
ekey])`, which `g` is the "generation" of the [team key](crypto) used to
encrypt the `pubKey`, since it is constantly rotating.  This "packed key"
(`pkey`) is then what Alice publishes to herself and the other admins, for
future reference.

#### Step 2c: Sign the pkey into the Team's Chain

Finally, Alice [signs the
`pkey`](https://github.com/keybase/client/blob/98327b58939a5b769fb2025743a31fcd08c7265b/go/teams/teams.go#L859-L893)
generated in the previous step into her team's chain:

```json
"invites": {
    "writer": [
        {
            "id": inviteID, // See Step 1c
            "name": pkey, // See Step 2b
            "type": "seitan_invite_token"
        }
    ]
}
```

### Step 3: Sending the iKey

Alice then sends the `iKey` generated in step 1a to Bob over any means at her
disposal. Our iPhone app automatically uses iMessage.

### Step 4: Bob Accepts the Invitation

When Bob receives the `iKey` from Alice, he stretches it to make an `siKey`,
and then he can computes the `inviteID` and EdDSA keypair as Alice has done.
With the keypair, Bob can create a
[signature](https://github.com/keybase/client/blob/98327b58939a5b769fb2025743a31fcd08c7265b/go/teams/seitan_v2.go#L210-L224)
(`sig`), and post it to the server, to claim ownership of his spot in the team.

   `sig` = **Sign**(`privKey`, **pack**(`{"stage" : "accept", "uid" : uid, "eldest_seqno" : q, "ctime" : t, "invite_id": inviteID, "version": 2}`)).


Bob substitutes the appropriate values for his `uid`, his `eldest_seqno` (so
Alice can identify Bob modulo any account resets), the `inviteID` which he
computed and a UTC timestamp.  He then posts this `sig` and the `inviteID` to
the server.

### Step 5: Alice Completes the Protocol

Once Bob has claimed the spot in the team, the team admins get a message from
the Keybase server that they should complete the Seitan protocol. They receive
a message with `(inviteID, sig)` and can read the corresponding `pkey` out
of their team's chain, indexing on `iniviteID`. The admins
[verify](https://github.com/keybase/client/blob/98327b58939a5b769fb2025743a31fcd08c7265b/go/teams/handler.go#L475-L503)
all important parts of the various keys:

* That the invite hasn't already been used
* That the invite hasn't expired
* That the invite hasn't been revoked
* That the `pkey` decrypts properly
* That the signature matches for the given `inviteID`, `uid`, and
  `eldest_seqno` using the decrypted `pubKey`

Assuming all of these cryptographic checks pass, then Alice (or Arnie or any
other admin) adds Bob to the group.

## Security Analysis

This protocol achieves three goals: (1) it shares a secret between the inviter
(Alice) and the invitee (Bob); (2) it shares the ability to verify the secret
among all other admins of the group; (3) admins cannot steal the secret
generated by a different admin to invite Charlie and (4) it allows Bob to prove
knowledge of the secret to the admins who key him into the team. The security
in Step (1) depends upon assumptions outside the scope of this system. For
instance, if Alice shares the secret with Bob over iMessage, she is trusting
that system's *TOFU*-based key exchange.
