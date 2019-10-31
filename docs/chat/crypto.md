{% set page_title = "Chat Crypto" %} 
## High Level Overview

When Alice sends a message to Bob, she uses the same keys that she would use to
save a file in `/keybase/private/alice,bob`. (See the [KBFS crypto
doc](/docs/crypto/kbfs).) That makes a lot of nice things work right off the
bat:

- Alice and Bob share a symmetric encryption key, which they pass through the
  server by encrypting it to each of their devices' public encryption keys.
- If either of them removes a device, their other devices will create and share
  a new encryption key. That guarantees the removed device can't read new
  messages, without relying on the server to enforce it.
- If either of them adds a new device, that device will get a copy of all the
  keys it needs to read old messages.
- Alice can send a message to Bob even if he hasn't joined Keybase yet. If she
  knows Bob is `@bobbymcferrin` on Twitter, she can message him now, and later
  one of her devices will check `@bobbymcferrin`'s proof and share keys with
  him automatically.

Even though the server can't forge new messages, there are tricks it might try
to play. For performance reasons, it's the server's responsibility to assign a
sequential ID to each message. An evil server could try to reorder some
messages, for example, or leave some of them out. To limit tricks like that,
every time Alice sends a message, she includes some references to other
messages she's seen before. Bob's device will check that list, to make sure
it's consistent with what he's seeing. That limits the mischief an evil server
can do, while still letting Alice send messages quickly on a bad network.

That shared context prevents the server from dropping Alice's messages without
her permission, but it's still important that Alice can choose to delete them
when she wants to. To make that work without losing the context, every message
comes in two parts, a header and a body. The header holds the previous message
references and never gets deleted. The body holds the text of a message, and
when Alice sends a special "delete" message, the server will delete it. That
way Bob can check that the deletion is allowed. Editing messages works in a
similar way; Alice sends a special "edit" message that Bob can verify.

Signing and encrypting attachments is almost the same as for regular messages,
except that they could be very large. If Alice uploads a video, Bob might want
to see part of it without downloading the whole thing. To make that work, Alice
splits up her attachments into chunks and signs and encrypts them individually,
so that Bob can verify just the chunks that he needs. This is all done
carefully (more details below) to make sure no one can move the chunks around
after the fact.

Another issue that comes up with large files is that it's helpful to host them
on third-party CDNs. One worry about CDNs though, even with encrypted files, is
that we might not be able to delete files reliably when we want to. To help
with that, Alice encrypts attachments with a new set of one-time-use keys, and
she includes those keys in the attachment message body. That way deleting the
attachment message body has the same effect as deleting the large file.

## Nitty Gritty Details

### Algorithms

There are two versions of our message boxing scheme. `MessageBoxedV2` is used now.
`MessageBoxedV1` is not written by clients anymore, but messages still exist and clients
need to understand it.


Message encryption is done with NaCl's
[`crypto_secretbox`](https://nacl.cr.yp.to/secretbox.html) (XSalsa20, Poly1305).
In `MessageBoxedV1` header signing is done with NaCl's
[`crypto_sign`](https://nacl.cr.yp.to/sign.html) (Ed25519, SHA512)
and header encryption is done with `crypto_secretbox`.
In `MessageBoxedV2` the header uses signencryption which is described below.
The sender (or deleter or editor) of a message performs the following steps:

- Encrypt the message body with a random 24-byte nonce. We don't need
  sequential nonces to enforce ordering, because we have previous message
  references below, so a random nonce is the simplest way to prevent reuse. In
  our case the body is one of several different types of structures (text,
  attachment, edit, delete, etc.) serialized with
  [MessagePack](http://msgpack.org/index.html).
- `MessageBoxedV1`: SHA-256 hash the ciphertext of the message body.
- `MessageBoxedV2`: SHA-256 hash the encrypted message body's
  `version || nonce || ciphertext`.
- Add that hash to the message header, along with other metadata like the list
  of previous message references. This structure also gets serialized with
  MessagePack.
- `MessageBoxedV1`: Sign the serialized header bytes.
  Encrypt the signed header with another random nonce.
- `MessageBoxedV2`: Signencrypt the serialized header bytes with another random nonce.
- Send the header plaintext, the header ciphertext, the body ciphertext, and
  both nonces to the server.

The fields in the header aren't secret from the server, and it actually needs
to know several of them, like the message type. The reason for sign-then-encrypting/signencrypting the
header is instead to keep the *signature itself* private. Even though
the server knows who's talking to whom, because it's delivering all the
messages, it's better that it can't *prove* what it knows.

The purpose of the signing step is to prevent participants in the chat from
impersonating one another. Authenticated encryption is already enough to
prevent people outside the chat from forging messages, but because all the
participants share the encryption key, it wouldn't not enough to distinguish
one participant from another without server trust.

Attachments use signencryption as well.

#### Signencryption

Signencryption is a construction for encrypting and signing a message, using a
symmetric encryption key and a signing keypair, in a way that keeps the signature
hidden and supports safe streaming decryption.

Encryption is done in constant size chunks, with a single short or
empty chunk to mark the end and detect truncation. Each chunk's nonce is 16
random bytes (shared by all chunks) plus an 8-byte sequential counter (unique
to each chunk). This prevents nonce reuse, chunk reordering, and chunk swapping
between packets. Encryption is layered on top of signing to hide the
signature, and the signature includes the encryption key as associated data to
prevent the encryption layer from being swapped out.

This scheme is documented in detail [in the source
code](https://github.com/keybase/client/blob/dc664617ea326abdd5e5bca877aa0c25fb403efd/go/chat/signencrypt/codec.go).

### Key Handling

The details in this section are shared with KBFS and the rest of the Keybase
app.

All Keybase devices publish a [`crypto_box`](https://nacl.cr.yp.to/box.html)
public key and a [`crypto_sign`](https://nacl.cr.yp.to/sign.html) public key
when they're first provisioned. Those keys live in the user's signature chain,
where they're connected to other other devices' keys by mutual signatures. Each
of a user's identity proofs is also signed by one of these device keys and
recorded in the signature chain. (PGP keys can participate in the signature
chain too, but not in chat or KBFS.)

A chat symmetric encryption key is 32 random bytes. It's shared by everyone in
the chat, and it's the same key that they use to encrypt files in the private
KBFS folder that those same people share. When a new device needs this shared
key, another device that has it will encrypt it with the new device's public
`crypto_box` key and then upload it to the Keybase server. Chat signing keys
are the device-specific `crypto_sign` keys described above.

Secret keys are stored on disk, in a file encrypted with `crypto_secretbox`,
with a key derived from the user's Keybase password. While the user is logged
in to Keybase, that key is stored on disk in plain text (see tradeoffs below),
or in the system keyring on macOS. When the user logs out of Keybase, that key
is deleted, and their secret keys are unreadable until the next login.

Cached chat messages on disk are encrypted with `crypto_secretbox`, with a
symmetric key that's derived from the device's `crypto_box` secret key. This is
done so that when the secret key is inaccessible, particularly when the user is
logged out of Keybase, cached messages are also inaccessible.

### Header Layout

The chat header fields are specified in our
[`chat.1.local`](https://github.com/keybase/client/blob/dc664617ea326abdd5e5bca877aa0c25fb403efd/protocol/avdl/chat1/local.avdl#L168-L180)
protocol:

```
record HeaderPlaintextV1 {
    ConversationIDTriple conv;
    string tlfName;
    boolean tlfPublic;
    MessageType messageType;
    array<MessagePreviousPointer> prev;
    gregor1.UID sender;
    gregor1.DeviceID senderDevice;
    Hash bodyHash;
    union { null, OutboxInfo } outboxInfo;
    union { null, OutboxID } outboxID;
    union {null, SignatureInfo} headerSignature;
    union { null, MerkleRoot } merkleRoot;
}
```

The fields are:

   * `ConverationIDTriple conv` — A (TLFId, TopicType, TopicID) triple that
     uniquely identifies this chat. The first field is a random 16-byte ID that
     uniquely identifies the TLF ("top level folder", a KBFS share). Note that
     the mapping from TLF name to ID isn't totally fixed, since the TLF might
     predate when one of the members joined (via "sharing before signup"). The
     [`TopicType`](https://github.com/keybase/client/blob/dc664617ea326abdd5e5bca877aa0c25fb403efd/protocol/avdl/chat1/common.avdl#L28-L33)
     specifies what "type" of chat this is, since some future chats might be
     automated communication channels rather than just human-to-human chats.
     The `TopicID` is a 16-byte random identifier that uniquely identifies this
     "topic", so that eventually multiple topics (with mutable names) can exist
     for each TLF.

   * `string tlfName` — is the human readable name for this chat, like
     `max,chris` or `max,BarackObama@twitter`. It is technically redundant
     since it conveys the same information as the TLFId in the previous field.
     However, including it in the header allows clients to cryptographically
     associate the two and prevent the server from maliciously reassociating
     them in the future.

   * `boolean tlfPublic` — distinguishes between the public and private side of
     the `tlfName` above.

   * `MessageType messageType` — So far, the available types are given
     [here](https://github.com/keybase/client/blob/dc664617ea326abdd5e5bca877aa0c25fb403efd/protocol/avdl/chat1/common.avdl#L15-L26).
     Some are chat data, but some are metadata (e.g., "change the name of this
     chat"), and edits to previously sent messages.

   * `array<MessagePreviousPointer> prev` — Pointers to the previously received
     chat messages to protect against the server reordering, deleting or
     replaying previous chat messages. The prev pointer to a previous message
     *m* consists of the hash of the encryption of *m*, and the sequential ID
     that the server assigned to *m*. The server is tasked with maintaining a
     total order among messages in a chat, and clients use previous pointers to
     hold the server to previously advertised orderings.

   * `gregor1.UID sender` and `gregor1.DeviceID senderDevice` — sender UID and
     device ID.

   * `Hash bodyHash` — In `MessageBoxedV1` a SHA-256 hash of the encrypted body ciphertext `(.e)`.
     In `MessageBoxedV2` a SHA-256 hash of the encrypted body `(.v || .n || .e)`.

   * `outboxInfo` and `outboxID` — Extra sender bookkeeping data, not used for
     security.

   * `union {null, SignatureInfo} headerSignature` — In `MessageBoxedV1` a signature computed over
     the whole header (including the body hash above).
	 In `MessageBoxedV2` this field is null, instead the whole header is signencrypted.

   * `union {null, MerkleRoot } merkleRoot` A recent merkle root observed by the sender.
     Not present in `MessageBoxedV1`.

## Limitations and Tradeoffs

### Forward Secrecy

**Tradeoff:** Messages on the server don't have forward secrecy. That is, the
keys to read them still exist on your devices, and they never get deleted. That
means that someone who steals your device might be able to read your old
messages.

**Reason:** This is necessary for users to read their message history on new
devices. Forward secrecy also gets into a gray area when you allow multiple
devices on an account. (If you haven't turned on your other phone in 6 months,
and you keep sending messages to it, the ephemeral keys on that phone aren't
very ephemeral anymore.) Finally, deleting keys doesn't help you much if you
keep decrypted message history on the same device. Note that we do generate new
encryption keys when you remove a device, so a removed device can't decrypt
messages that were sent after it got removed.

### Repudiability

**Tradeoff:** Chat messages don't have repudiability. That is, if Alice sends a
message to Bob, it's possible for Bob to prove to other people that Alice sent
it.

**Reason:** This is a side effect of using signing keys to authenticate
messages. Repudiable authentication works well in a chat between two people,
and it's even cheaper than signing. But it doesn't scale well to group chats
with tons of people, because the sender needs to authenticate each message
separately for every other person in the group. It also makes it difficult to
add new people to an existing group (which we might support in the future),
because old messages can't be reauthenticated until all the senders come
online.

### History Integrity

**Tradeoff:** The server is responsible for assigning sequential IDs to new
messages, and it's possible for the server to change history in specific ways,
like delaying messages or reordering senders who haven't seen each other's
messages yet.

**Reason:** Good performance in a messenger app requires letting different
people send messages at the same time, without forcing them to synchronize or
to have perfectly up-to-date message history. That means that the server will
always have a lot of leeway in deciding what actually happened. The previous
message references guarantee that the server can't put a message before one it
was replying to, or delete messages after other people have seen them.

### Metadata

**Tradeoff:** Keybase is a centralized service, and the server receives a lot
of metadata. It knows who's talking to whom and how much data they're sending
back and forth. It also knows the type of each message, like "text",
"attachment", or "deletion".

**Reason:** Decentralized services make it difficult to add features over time,
unless the developers can break backwards compatibility, which defeats most of
the purpose of decentralizing. Moxie Marlinspike wrote [an article about many
of these issues](https://whispersystems.org/blog/the-ecosystem-is-moving/).
Decentralized services can also be *easier* to spy on, depending on who's doing
the spying. It's much easier to run a malicious Tor exit node than to break
into Facebook's servers, for example.

### Keys on Disk

**Tradeoff:** Keybase sometimes keeps secret keys accessible on disk, instead
of encrypting them with your password all the time.

**Reason:** Modern operating systems make full-disk encryption convenient, so
the use case for application-specific encrypted storage is much more limited
than it used to be. It doesn't help much unless an attacker can read arbitrary
files from your disk but can't run arbitrary code. That can happen, but it's a
very specific scenario, and it leaks your decrypted files even if it doesn't
leak your keys. By comparison, throwing extra password prompts at the user is a
major downside for everyone all the time, especially non-experts who don't know
how to pick good passwords or manage them.

Keybase's centralized model also makes it easier to recover from leaked signing
keys, compared to PGP. Everyone checks for revocations in your signature chain
automatically. In the worst-case scenario where you lose control of your
account entirely, and you can't publish revocations at all, you can still take
down all the identity proofs associated with it.
