# Hierarchical Ephemeral Keys for Exploding Messages

Keybase now has support for "exploding" messages, which are automatically
deleted after some expiration time. As part of that feature, we guarantee
forward secrecy for those messages. That means that in addition to deleting the
messages themselves, clients will also delete the keys that were used to
encrypt them. The goal is that even if an attacker steals one of your encrypted
exploding messages from our server, and then later steals one of your devices
and all the keys on it, there should still be no way for the attacker to
decrypt the message.

## High Level Design

Each Keybase device creates a daily ephemeral encryption keypair, signs over it
with the device's long term signing key, and publishes the public half of it
and that signature to the Keybase server. Each key is fully random, not derived
from any previous keys or any long term keys. The maximum lifetime of any
ciphertext using these keys is one week. If a device doesn't come online to
publish a new key, senders can continue using its most recent key, and later
the device will postpone deleting that key to compensate. After not publishing
a new key for long enough, the device is considered stale, and it can no longer
receive ephemeral messages of any kind. That staleness window is currently three
months to allow for devices that are rarely online. Putting limit on the
staleness means that one mothballed device won't compromise the forward secrecy
of an entire group forever.

Instead of using device ephemeral keys (EKs) directly at the application level
to encrypt chat messages, we build a hierarchy of user and team keys on top of
them. Each user publishes a daily user EK, and the private half gets encrypted
for each valid device EK. Likewise teams publish team EKs and encrypt them for
each user EK belonging to a team member. This mirrors our hierarchy of
long-term [per-user](https://keybase.io/docs/teams/puk) and
[per-team](https://keybase.io/docs/teams/crypto) keys. All of these higher
level EKs have the same one week lifetime that device EKs do. An issuing device
skips over stale devices and stale users when encrypting copies of these secret
keys for transport.

At the chat application level, we always encrypt with the most recent team EK
available. That means that regardless of the lifetime chosen for a message,
which could be just minutes, the lifetime of the encryption key is about a
week. Clients and the server make a best effort to delete messages immediately
after their lifetime is up, but a saved copy of the message could still be
decrypted with a stolen device, until the key is finally deleted about a week
later.

## Comparison to the Signal Double Ratchet

The [Signal double
ratchet](https://signal.org/docs/specifications/doubleratchet) is a widely used
design for managing ephemeral message keys. It's the combination of two
mechanisms: hashing keys forward as they're used to provide forward secrecy,
and continuously performing Diffie-Hellman to recover from past compromises.
The advantage of the double ratchet is that it achieves forward secrecy as
quickly as possible for asynchronous senders. There's no week-long window
before keys are deleted. Instead, in an active conversation, they're deleted
immediately.

There are two main reasons we aren't using the double ratchet for Keybase's
exploding messages. The first is that we're worried about performance in
conversations with lots of participants. Keybase supports teams with thousands
of members, and each of those members in turn has many devices. The standard
approach for using the double ratchet in a group is for each participant to
maintain a separate ratchet for each other participant. That would make it
expensive to send messages to a large team, both in terms of the time it would
take to process each recipient, and the bandwidth it would take to send a long
list of authenticators. Signal supports a ["sender keys"
variant](https://signal.org/blog/private-groups/#the-textsecure-group-protocol)
that can amortize that work over many messages, but it's still work that needs
to be done on every sending device, and senders with weak hardware or poor
network conditions would suffer.

The second reason is that we want to avoid mixing key management with
application state. In Signal, the ratchet sequence and the message sequence are
tied together. That works well for their use case, and it provides some of
their reordering and replay protection. The Keybase app is more complicated,
though, in ways that are harder to model with a mostly-linear sequence of keys:

- A [team chat](https://keybase.io/docs/crypto/chat) can have multiple
  different channels.
- In the "sharing before signup" case, you can chat with someone who hasn't
  joined Keybase yet, and automatically re-encrypt for them later after they
  prove who they are.
- The [Keybase File System](https://keybase.io/docs/kbfs) could support
  "exploding files" in the future.
- [Saltpack encrypted messages](https://saltpack.org/) could add an exploding
  mode.
- We could create app-specific derived keys for 3rd-party apps, and some of
  these could be ephemeral.

It's conceivable that we could handle all of these cases by adding more
ratchets and managing them in interesting ways, but this would push a lot of
complexity up into the application layer. An API whose contract is instead
"this key is valid for a week, do whatever you want with it" makes building
applications much simpler.

## Ephemeral Key Protocol Details

Our
[`keybase1/ephemeral.avdl`](https://github.com/keybase/client/blob/master/protocol/avdl/keybase1/ephemeral.avdl)
protocol file defines the objects we sign over when we publish ephemeral keys.
Here's the layout of a device EK statement. The corresponding user and team
objects are almost identical.

```
  record DeviceEkMetadata {
    KID kid;
    Time ctime;
    Time deviceCtime;
    HashMeta hashMeta;
    EkGeneration generation;
  }

  record DeviceEkStatement {
    DeviceEkMetadata currentDeviceEkMetadata;
  }
```

- `kid` is the public half of a Curve25519 keypair derived from the ephemeral
  secret. Given the ephemeral secret `s`, the private half of the keypair is
  `HMAC-SHA256(key=s, msg="Derived-Ephemeral-Device-NaCl-DH-1")`, and the
  public half is the `crypto_scalarmult_base` of the private half.
- `ctime` is the time when the seed was created. Rather than using its own
  clock, which could cause bad behavior on machines with weird clocks, the
  client fetches the latest root of the Keybase Merkle tree and uses the
  `ctime` from there.
- `deviceCtime` is the creation time according to the local device clock. The
  client falls back to this if it fails to fetch a Merkle tree root, enabling
  offline device key deletion.
- `hashMeta` is the SHA256 hash of the Merkle tree root that provided `ctime`.
- `generation` is an incrementing counter of all EKs this device has issued so
  far.
- `currentDeviceEkMetadata` describes the new deviceEK that this statement is
  publishing.

Device EK statements are signed by the device's long term signing key. User EK
statements are signed by the current per-user long term signing key, given in
the user's signature chain. And team EK statements are signed by the current
per-team signing key, given in the team's signature chain. Although device
long-term keys never rotate, per-user and per-team keys do rotate when a device
is revoked or when a team member is removed. As part of that rotation, clients
also rotate the user/team EK and issue a new EK statement signed by the new
long-term key.

When publishing new user EKs and team EKs, the publishing client encrypts a
copy of the ephemeral secret for every device or team member that isn't stale,
and it uploads those ciphertexts along with the signed EK statement. Clients
will also make another encrypted copy of the current EK when provisioning a new
device, or when adding a new member to a team. When decrypting an EK secret,
clients check the secret's derived Curve25519 public key against the `kid`
field in the associated EK statement.

## Expiration vs Deletion

Ephemeral ciphertexts are never valid for more than a week, but clients need to
keep ephemeral keys somewhat longer. Consider the following scenario: Your
laptop publishes a device EK (`laptop_dek`) and then goes offline for six days.
On day 6, your desktop publishes a new user EK (`uek`), and it encrypts a copy
of `uek`'s secret for the 6-days-old-but-still-valid `laptop_dek`. So although
`laptop_dek` was originally intended to expire on day 7, it might be needed to
decrypt `uek`'s secret as late as day 13.

One way to solve this issue could be to postpone deletion based on how the key
was used, waiting until there aren't any valid ciphertexts left that might need
to be decrypted. That's doable within the key hierarchy with the server's help,
but it's impractical when keys are used at the application level. It would also
require clients to be online to delete anything.

Instead, we apply the following rule: Keys are deleted one week after the
*following* generation is issued. Since encryption always uses the latest EK
available, and no ephemeral ciphertext is valid for longer than a week, that
guarantees that secret keys will stick around as long as any ciphertexts
encrypted for them. In the typical case where a new EK is issued daily, this
rule means that secret keys get deleted after 8 days instead of 7. In the case
where no new EK is issued for several days, deletion is postponed by several
days in turn. We cap this extension at the maximum staleness window (three
additional months), at which point the device or user is considered stale.

## Authentication and Repudiability

In both the exploding case and the ordinary case, communication within a group
has three options for authenticity:

1. "One MAC." Use a shared team encryption key to MAC messages.
2. "Pairwise MACs." Make a separate MAC between the sender and each member of
   the team, either for each message or for a short-lived signing key. This is
   what Signal does.
3. "Signing." Sign messages with the sender's long term signing keypair. This
   is what Keybase chat does.

The one-MAC approach doesn't provide "sender-specific authentication". That is,
the members of the team, who all share the encryption key, can impersonate each
other within the team. Although some designs consider this a repudiability
feature, it becomes a bigger problem as teams get larger, and as the members
are less likely to fully trust one another. Keybase avoids the one-MAC approach
for that reason.

The tradeoff between pairwise-MACs and signing is less clear cut. The
pairwise-MACs approach provides repudiability, since pairwise authenticators
are forgeable. Public key signing isn't repudiable. On the other hand, signing
is cheaper in large groups, because you only need to sign a message once. Also,
signing is more flexible: If new members are added to the group in the future,
they will be able to validate old signatures, but not old pairwise-MACs. That
membership flexibility is the decisive reason that Keybase uses signing to
authenticate files and chat messages, at the cost of repudiability.

Exploding messages can make a different tradeoff here, however. Marking a
message as exploding means the sender doesn't care very much about letting
future team members read it, or perhaps the sender deliberately wants to avoid
letting future team members read it. Exploding messages might also be more
sensitive, and so the sender might care more about repudiability. (We don't
know of any cases in the real world where someone has used repudiability as a
defense, but it could happen!) For those reasons, Keybase uses
pairwise-MACs instead of signing for exploding messages in small teams (those with
100 members or fewer).

As the key for these pairwise MACs, we use Diffie-Hellman output from the
sender and each recipient's long term device encryption keys, mixed with a
context string. This mirrors our approach with regular chat messages and
exploding messages in large teams, where we use device long term signing keys.

## Chat Protocol Example

Here's an example message with pairwise MACs, formatted as JSON for
readability. Fields that differ between regular messages and exploding messages
are commented:

```js
{
  "version": 4,
  "clientHeader": {
    "conv": {
      "tlfid": "D5wy0MNOXPEoZCfq7WKVJA==",
      "topicType": 1,
      "topicID": "DfQoqZ9cH7qme28eeo5xIA=="
    },
    "tlfName": "testerralph,testerrudolph42",
    "tlfPublic": false,
    "messageType": 1,
    "supersedes": 0,
    "kbfsCryptKeysUsed": false,
    "deletes": null,
    "prev": [
      {
        "id": 4,
        "hash": "8WGonE+GG0v8sofu3v9EVSFLr/qZMwIeehrfDEghFSU="
      }
    ],
    "sender": "uq09RkWjBHbS+pfoNkZmGQ==",
    "senderDevice": "ghLxVqHLeZrqyA/udKijGA==",
    "merkleRoot": {
      "seqno": 3093864,
      "hash": "NodeXtrO3kEivPkF+UsAbLkVfuK7jFh+UqN70nGNzF2nP9znOxRdN+tDNClkvRKIIlT4oPYqNTamY7Fj+l029g=="
    },
    "outboxID": "dTxsmDsftUU=",
    "outboxInfo": {
      "prev": 4,
      "composeTime": 1529342305341
    },

    // The "ephemeral metadata" which indicates that this message is exploding.
    // When this section is present, the client uses an ephemeral key rather
    // than the team's long term key decrypt the body.
    "em": {
      // The "lifetime" of the message, in seconds. 604800 seconds is one week.
      "l": 604800,
      // The "generation" of the ephemeral key used to encrypt the body.
      "g": 1
    },

    // The "pariwise MACs" used to authenticate this message, paired with the
    // public key of the recipient device each MAC is intended for. When this
    // section is present, recipients look up the sending device's public
    // encryption key via the "sender" and "senderDevice" fields above, and
    // they use it to validate the MAC intended for their device. In this mode,
    // the "verifyKey" is a public constant, corresponding to the all-zeroes
    // private key, and the header ciphertext by itself doesn't provide any
    // authenticity.
    "pm": {
      "012105d72ff6d356715621baebcf5e138b15414232c189ef9925ccbe0f36b79693330a":
        "+4MjACPtaegHy+YwA9Gv3S0UOGaht/l5K2l/KbzNNus=",
      "01210f4a6a3fdf6c3530217f922bd1a9dd60dfa96959f0a421b0f8b4671d8dd5456f0a":
        "r9D8bL6SmVr2g8gZtmkIOnLLNxSxl6dUhU22G+pieEQ=",
      "012140900270a7819b043a8447e1d3e478b17c690c42755befbecd8de122a8c3ca600a":
        "E1GL5aBuxII4mVVFNzLsW1z8iuesNtHkPjZugySwGa0=",
      "012142660fd3920a31dc58f8de2ac6adeb476d8d65266f1a020cd50a10156b62cb4d0a":
        "QEwiu3qb6x9sENQFgk0FWrYHkuYwv3HpYQcPvjygwfQ=",
      "012144925855a68f635816ca756461d75279cd885e9b3ed99f335718239dedf5ca6c0a":
        "ieG85k0ZafSZeEolHRA0qCSrbOqZwB7E95jjGV9/7BE=",
      "012167fd6b41b6e1685b8edad39f02cbac9878e3972d2845311b589b98d9724b44500a":
        "BNwhcAKug5AzHiaPuy8uUEuVAOPRHWgFhMip1Vn+n94=",
      "0121688caad6aaa673980a7750c964f5c5c10d807864ec00de28646f54727bafe1010a":
        "TEMuaNCUT8T9EJVDev01JPpgNhCiZEVtXCIPEl6kJqM=",
      "012181d6969d53fcd873aa62c49e8984a3781455a6ce30c2302f73cf0b0f232302680a":
        "irW83fHUDG5XXOXdnYGqWcWC7r+H2ZagPddH3NfNnR0=",
      "01218693f54dc97bc0e298fb34b3826a6b36b49d50025346316879fd4235417788300a":
        "cKMNMZ1Z1rlvCK3hCTcs4vxQ1LfwHvzDBLh7OQI/vgo=",
      "01219b42147a162effff296676cb43c82bb6cdda404309537b58edf41e5d2e04631f0a":
        "fyzn9GgRw2tG10VLm45Wh3BZEraUqjR5a9UPgIQwGnE=",
      "01219bddbff2a921f8d0308347187d69ca470609ee1e2b11c51d16ab6269bbad92070a":
        "W13kNFT6t94hglL18n2GhFHxEFi1JJz22BizoEDbl9o=",
      "0121ba2e89682adc3c85a3cb0f1a745a11f602c6f1eb597b4634812538418fe14e620a":
        "u51e0wOmH2XcvgwpPF9gLKlm2s8I/iTNbaSsWeZm9k4=",
      "0121bcd7cef92c52445b4d6177318e543bf7b342ecdd60808693f419c633e6ef1a020a":
        "NuMXAzqdRgYPDbqa5KrIgbU9u2C/us9iBYOnfbY16lw=",
      "0121cd9f2ee4495fda2723f63221095546e71552b6f21b8bb247c531b4453cce9c230a":
        "Y5X12wngluGzsIvzujaJPBTXZTp0ShHp+5jaD2KAlEk=",
      "0121e0ffe7daa4e07fccd7f54f7deae67d4dc740b3f7582565aa34a0789cd3e23d410a":
        "w9DYIZ+RRLJpXOj0CSVCchmwhaYMTAAMO/fN0uRWEPk=",
      "0121e22f3a28b397e17255d5f6215c2fdea2653ec131d7a030fbbd7f973afe47570d0a":
        "ztz2Y/0KvqIDCysX8Ijn03qMOP9uw3P0p1rQEOdQemE=",
      "0121f6ef8f41a7104a110b4ba83618cf3d1b3bafac2ac065b1bd01ea018d8022b6360a":
        "edA3Qg4nQ2T5fSFgpu8VJqvqizwhPhWW9x8memLIKJc="
    }
  },

  // Header metadata is always encrypted with the team's long-term key indicated
  // by "keyGeneration" below, even in exploding messages. It's also signed
  // internally by the private half of the "verifyKey". The decrypted metadata
  // contains a hash of the body ciphertext, so that the body can be deleted
  // independently.
  "headerCiphertext": {
    "v": 1,
    "e": "dextrPkwdy/Y6Fk34UMNeKIujFlbFN+AU/FTupb13515mC4fWO6XGBQk2EoOptbQBZ2ZVN/2CF+xNLIXB60oHWNW6IwwcdWQjkwnayhjaKx5Ux6osysd9ssDJE6LMdOQw9IsOT3foXhHtTapXAoOkqdRErpPTle1YM6wk1arxogB8hcezTNSIdIhgH0V0HkrqBB1CV4Cn+m/4MmECP3czAt0iRIeUY5RQvthVHyL79GiFTExV3JGWgEg3YxNuhrPhKmVrM4Q3zmzY1f7DSQgS0sni8SsbQR808hD675briUho0ZcD2KjDeDqF6JMyyLd1uzZs9hBCrFxYeAf+hHOqQdEabdGdAcCfROeXzY+z+tDQtJ90G33pMJhrCH8OfUGGAxGHLMwtNwNmxcWNSjJ/HyFK0r3w1PzmUxFD2wnsv2JbGoRprtQV/umLHbj9ahxbbjOl7Xw4wiTlIny6pA1FD0iTaTdYFJKkDO6RsCuJlkdrUYuDjYxpK5MmZEGsPyCXY5bGNloA7nI7U4Z4pt6Vo7uBdEdT+WTT/bEi/oU80RrzzdQruYGBkt3BJAi/6Imz+X/PUh2HEqLeA2sqpJN7auXyVYpxf0v3fGnuM3sEM91ZqXQzo1otfpnyT2Cqw33zYpFUPk8K6qH8U4NrKW7rSpuvHwU6Ar1wCWHfrl2bZ2IEHP18y36l2u2ivSNu02Kra3Sh50Pvw2PkGOEEpTGvPt1eboSNu6h5U1L",
    "n": "OdPwtDykhMkegzPjyFxN9Q=="
  },

  // In regular chat messages, the body is encrypted with the same key as the
  // header. In exploding chat messages (indicated by the "em" field above), the
  // body is encrypted with an ephemeral key.
  "bodyCiphertext": {
    "v": 1,
    "e": "7U/UIEeq+CHLAhl3qwdFTuZ3wL7g7YHfJjMJFhnLTFer4Bx8D1nx4EgxsMYNrZHGbUSTQhlVd6Ek2TVeMqh43YgGm2YapKdSKSOQ5Ug=",
    "n": "0qjVyFRig0RWr5VkcPuF9EXJMeJu1TE3"
  },

  // In messages with pairwise MACs (like this one), this ed25519 public
  // signing key is generated from a private key of all zeroes. Otherwise the
  // recipient must verify that it's the long-term signing key of the sending
  // device.
  "verifyKey": "ASA7aie8zrakLWKjqNAqbw1zZTIVdx3iQ6Y6wEihi1naKQo=",

  // The generation of the team shared encryption key that the header is
  // encrypted with. In regular, non-exploding messages, the body is also
  // encrypted with this key.
  "keyGeneration": 1
}
```

## Directions for Future Work

The key schedule could expand to include more fine-grained keys, for example
keys that expire after one day or one hour. This could reduce the gap between
the double ratchet design and our static design. We would need to decide how
these different "tiers" of key lifetimes interact. (For example, if a message
is supposed to be encrypted for a 1-hour key, is it ok to silently fall back to
a 1-week key for some recipients? Or should frequently-offline devices be
excluded from the shortest-lived messages?) We would also need to be careful
not to wake up too frequently on mobile devices.
