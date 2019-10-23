
# Keybase Key Exchange (KEX) Protocol

This document describes Keybase's protocol for using an existing device to
provision a new device. We designed the protocol to be mobile-friendly, so
users are spared the annoyance of typing cryptographic data on a small
touch-screen.

## Design

The high-level design for the KEX protocol is that two devices want to
speak over an encrypted, authenticated channel, to communicate a few
important pieces of information:

   * Provisionee → Provisioner
      * The provisionee's new device-specific EdDSA public key
      * The provisionee's new device-specific ephemeral Curve25519 DH public key
   * Provisioner → provisionee
      * Data derived from the user's passphrase, used to locally lock secret keys.
      * A signature of the provisionee's new device-specific EdDSA with the provisioner's
        existing device-specific EdDSA key
      * A session token so that the provisionee gets an active session with the server without having
        to directly login. The provisionee will need a session to post new signatures to the user's
        sigchain.
      * The user's latest [per-user key](/docs/teams/puk) (PUK) seed. These
        keys are always shared among the users devices and can be used by any
        of them.
      * The user's latest [per-user ephemeral key (userEK)
        seed](/docs/crypto/ephemeral). These keys are always shared among the
        users devices and can be used by any of them while active.

The passphrase information and per-user key seed need to be encrypted for secrecy, and the
key-exchanges need to be MAC'ed to make sure an adversary who controls the communication channel
isn't MITM-ing the exchange.  Both properties are achieved via authenticated-encryption
of the exchange.  Therefore, the endpoints share an offline secret (*W* described below) before communication can start.

Though many device-to-device channels exist, we're going to do the simple and naive thing,
which is bounce messages off of the Keybase servers.  Thus, the Keybase server can control
the channel, but with the end-hosts authenticating and encrypting, this design decision
does not present a security risk.

### Prerequisites

Before key exchange can start, the provisioner (device *X*) and
the provisionee (device *Y*) must have:

   * Provisioner (device *X*):
      * a device ID
      * a provisioned per-device EdDSA signing key
      * the user's latest PUK seed
      * the user's latest userEK seed
      * the user's current passphrase stream (and not an old one that's since been updated.)
      * a login session for itself
      * a login session that it will eventually share with the new provisioned device
   * Provisionee (device *Y*):
      * a new device ID
      * a new device name
      * a new, unprovisioned per-device EdDSA signing key
      * a new, unprovisioned per-device Curve25519 DH key
      * a new, unprovisioned per-device ephemeral Curve25519 DH key

Once these conditions have been met, the devices can start KEX. Note that
device *Y* does not need a login session. This point is key, since the user
should not have to enter her passphrase on the new device. If either the
provisioner or provisionee are missing a component of the ephemeral keys, the
provisionee will generate a new pair after it is provisioned as a fallback
while ephemeral key support is rolling out.

### Deriving a Session Key and Sharing a Secret

*X* and *Y* need to share a strong secret convenient across their two devices. We
now support 3 modes of operation here. The first is V1 desktop, which will call V1d.
The second is V1 mobile, which call V1m. The final is V2, which we are gradually
transitioning to once clients upgrade their software.

A secret is generated with the following steps.

   1. Pick *J* words at random from the [BIP0039](https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt) dictionary. Call this secret *W*. In V1d and V1m, *J* is 8, meaning the secret has 88
    bits of entropy. In V1m, the additional word, `"four"`, is appended to *W* to distinguish
    between V1d and V1m. As we will se below, this is so that mobile phones can do less
    stretching (they would crash otherwise). In V2, *J* is 9, meaning the secret has 99
    bits of entropy.

   1. Join the words in *W* together with ASCII spaces (`0x20`), to make the string *W'*.

   1. Run scrypt(N,p=1,r=8) on *W'* with salt *T*. For V1d, we set *N = 2<sup>17</sup>*. For V1m and V2,
    we set *N* = 2<sup>10</sup>, since higher values crash older phones. For V1d and V1m, the salt *T*
    is empty. For V2, we set *T* equal to the user's UID.

   1. Take the first 256 bits of the output. Call this secret *S*.

   1. Generate a QR code from *W'*, called *Q*.

   1. Generate a public session identifier: *I* = HMAC-SHA256(*S*, `"Kex v2 Session ID"`)

Now device *X* and *Y* can share the secret *S* either via the string of
random words *W'* or QR code *Q*.

### Session Establishment

*X* and *Y* need to establish a session. They do so by both generating session secrets
using the method above.  Call these secrets *S<sub>X</sub>* and *S<sub>Y</sub>*.

Both send messages to the keybase server advertising for a session initiation;
*X* does so with session identifier *I<sub>X</sub>*, and *Y* does so with
session identifier *I<sub>Y</sub>*.

As soon as the user enters secret *S<sub>X</sub>* on device *Y*, or
*S<sub>Y</sub>* on device *X* - either by QR code or by manual text entry -
then the device can compute the corresponding session identifier, and establish
a channel. Then the protocol can begin.

### Transport and Packet Format

All messages sent between *X* and *Y* via the server are protected via
NaCl's SecretBox cipher, with the shared secret (either *S<sub>X</sub>*
or *S<sub>Y</sub>*) as the session key. Each message send from *X*
to *Y* is [message-packed](http://msgpack.org) as an array into the form:

```
┌───────────────┬──────────────┬────────────┬────────────┬───────────────────┐
│   Sender ID   │  Session ID  │   Seqno    │   Nonce    │ Encrypted Payload │
│  (16 bytes)   │  (32 bytes)  │ (4 bytes)  │ (24 bytes) │    (arbitrary)    │
└───────────────┴──────────────┴────────────┴────────────┴───────────────────┘
```

The encrypted payload is computed as the SecretBox of (also message-packed):

```
┌───────────────┬──────────────┬────────────┬───────────────────┐
│   Sender ID   │  Session ID  │   Seqno    │ Plaintext Payload │
│  (16 bytes)   │  (32 bytes)  │ (4 bytes)  │    (arbitrary)    │
└───────────────┴──────────────┴────────────┴───────────────────┘
```

A (sender ID, session ID, seqno) triple should be unique over all messages,
but there are two independent sequence numbers for the two message directions.

A device sends these messages to the other device via to the Keybase server, and can
retrieve messages from the other side by supplying its own device ID, the
session ID, and the last sequence number received.

When receiving messages, a client decrypts, and checks that the (sender ID,
session ID, seqno) outside the encryption match those inside. Further checks
are also performed: (1) that the first message received is sequence 1, and
that subsequent messages have sequence numbers that increment monotonically by
1; (2) the session ID matches the session ID derived from the shared secret
*S*; (3) the sender ID in a received message must not be equal to the device
ID of the receiving device (this protects against reflected messages). If it
all checks out, the client reassembles plaintext payloads and gives the
illusion of a simple stream of data.

On top of this data stream, we build a message protocol, using the same
[framed-msgpack-rpc](https://github.com/keybase/go-framed-msgpack-rpc) we use elsewhere.  The keybase server is oblivious
to this structure.


### The Protocol

All protocol messages in KEX are formulated as RPCs, so therefore have a call and
a reply.  There are only three RPCS:

```
    ┌─────────────────┐                                      ┌─────────────────┐
    │ Provisioner (X) │                                      │ Provisionee (Y) │
    └─────────────────┘                                      └─────────────────┘

    1.                       [ NOTIFY: Start() ]
    ◀──────────────────────────────────────────────────────────────────────────────

    2.                 CALL: Hello2(uid,newSession,sibkeySig)
    ──────────────────────────────────────────────────────────────────────────────▶

    3.         REPLY: (sibkeySigSigned,dhPubKey,dhEphemeralPubKey)
    ◀──────────────────────────────────────────────────────────────────────────────

    4. CALL: DidCounterSign2(sibkeySigCounterSigned,ppsEncrypted,pukBox,userEKBox)
    ──────────────────────────────────────────────────────────────────────────────▶

    5.                        REPLY: (OK)
    ◀──────────────────────────────────────────────────────────────────────────────

```

Here are the steps of this protocol:

  1. (Optional): If secret *S<sub>X</sub>* was entered on device *Y*, then *Y* should
  send *X* a **Start** RPC to start the protocol. Note we're using an *notify* message here,
  which does not expect a reply.

  1. Device *X* sends the **Hello** RPC to *Y*, detailing:
     * `uid` - The UID of the user in question
     * `newSession` - the session the new device should use to authenticate itself to the server
     * `sibkeySig` - the skeleton of the signature body that *Y* will use to
       sign itself into the user's sigchain

  As this point, device *Y* might need to block for user input, since the user
  must name the new device. Device *Y* loads the sigchain for their user to
  determine previously used device names, so that *Y* can be certain to pick a
  valid device name (via client-side input checking).

  1. Device *Y* receives this RPC, and fills in its fields of `sibkeySig`.
  Namely its device ID, its device name, and its per-device EdDSA public key.
  It then signs the blob, and stores the result as `body.sibkey.reverse_sig`.
  This new blob is `sibkeySigBlobSigned`, which is sent as an RPC reply to the
  RPC in the previous step. Device *Y* also includes the public half of its
  device-specific and device-specific ephemeral Diffie-Hellman key; device *X*
  will need it in the following step.

  1. Device *X* receives the JSON blob with the `reverse_sig` signed by *Y*.
  Device *X* removes the signature and the expected fields provided by *Y*, and
  builds a new JSON blob, verifiying the signature from *Y* on this structure.
  *X* rebuilds the JSON blob to match the expected structure to prevent them
  from signing an abitrary statement from *Y*. If the signature checks out, *X*
  counter-signs the whole JSON blob and sends the result to *Y* in the
  **DidCounterSign** RPC.  Device *X* also sends back the user's passphrase
  stream, encrypted for Device *X*'s public device key, and a secret ephemeral
  DH key. The encryption bundle includes the corresponding ephemeral public DH
  key so Device *X* can decrypt. Also attached to this message is the `pukBox`
  containing the user's latest per-user key seed NaCl Boxed for the Device
  *Y*'s encryption key. If the user has an ephemeral user key, it is NaCL Boxed
  for Device *Y*'s ephemeral device encryption key.

  1. Device *Y* receives the countersigned JSON object, and then readies its
  post to the server. The post includes this signature, a follow-on
  signature that authorizes a new per-device Curve25519 DH key (the same one
  sent in step 3), the `pukBox`, the `userEKBox` and the device's new
  Curve25519 DH device ephemeral key which the server will accept or reject as
  one transaction.

## Implementation

### API Endpoints

Here are the endpoints used in KEX:

   * **POST /_/api/1.0/kex2/send.json**
      * Parameters:
         * `I` - the session ID for this message
         * `sender` - the device ID of the sender
         * `seqno` - the sequence number of this message
         * `msg` - the nonce concatenated with the encrypted payload, or an empty message to mark an *EOF*
      * Behavior: the (`I`, `sender`, `seqno`) triple must be unique. The server will route the message immediately to the corresponding receiver, or buffer it for about an hour if there's no one receiving yet.

   * **GET /_/api/1.0/kex2/receive.json**
   	 * Parameters:
   	 	* `I` - the session ID for this message
   	 	* `receiver` - the device ID of the receiver
   	 	* `low` - grab messages greater or equal to this sequence number
   	 	* `poll` - how long to wait if a message isn't immediately ready, in milliseconds
   	 * Behavior: The server will check for all messages in the session `I` that weren't sent by the given receiver, and whose `seqno` is greater than the one given. It returns all of these messages to the caller.

   * **POST /_/api/1.0/new_session.json**
     * Behavior: Get a new session for the current user, for use on the new device

   * **POST /_/api/1.0/key/multi.json**
     * Parameters:
       * `sigs` - A JSON object containing a series of one or more signatures delegating keys
     * Behavior: Signatures are all accepted or rejected in an atomic transaction, and keys are delegated accordingly.

### Transport Layer

The transport layer should be implemented as a standalone module, that can be tested
and debugged independently of the rest of the codebase.

Here is one possibility for an interface:

```go

type DeviceID []byte
type SessionID []byte
type Secret []byte
type Seqno int

// MessageRouter is a stateful message router that will be implemented by
// JSON/REST calls to the Keybase API server.
type MessageRouter interface {

	// Post a message, or if `msg = nil`, mark the EOF
	Post(I SessionID, sender DeviceID, seqno Seqno, msg []byte) error

	// Get messages on the channel.  Only poll for `poll` milliseconds. If the timeout
	// elapses without any data ready, then `io.ErrNoProgress` is returned as an error.
	// Several messages can be returned at once, which should be processes in serial.
	// They are guarnateed to be in order; otherwise, there was an issue.
	// On close of the connection, Get returns an empty array and an error of type `io.EOF`
	Get(I SessionID, receiver DeviceID, seqno Seqno, poll int) (msg [][]byte, err error)
}

// conn implements the net.Conn interface
type conn struct {}

// NewConn makes a new connection given a MessageRouter and a Secret, which
// is both used to identify the Session and to encrypt/authenticate the connection
func NewConn(r MessageRouter, s Secret) (net.Conn, error) {}

// Read data from the connection, returning plaintext data if all
// cryptographic checks passed. Obeys the `net.Conn` interface.
func (c *conn) Read([]bytes) (int, error) {}

// Write data to the connection, encrypting and MAC'ing along the way.
// Obeys the `net.Conn` interface
func (c *conn) Write([]byte) (int, error) {}

// Close the connection to the server, sending a `Post()` message to the
// `MessageRouter` with `eof` set to `true`. Fulfills the
// `net.Conn` interface
func (c *conn) Close() error {}

// LocalAddr returns the local network address, fulfilling the `net.Conn interface`
func (c *conn) LocalAddr() (addr net.Addr) {}

// LocalAddr returns the remote network address, fulfilling the `net.Conn interface`
func (c *conn) RemoteAddr() (addr net.Addr) {}
```

### RPC Layer

Once we have a transport (bounced off the server) that obeys the `net.Conn` interface, it's
easy to plug into the RPC system.

### Cancelation And Errors

What happens if one side disconnects in the middle of the exchange, or if one side
cancels? There are a few cases to consider, both at the transport level, and
at the RPC level.

At the transport level, a device "canceling" the exchange should send a `Post()` to
the server with `msg = nil`, signaling its intent to hang up on the channel.  The other
device will receive this cancelation upon its next `Get`.

It's at the RPC level that the application will handle these exceptions.  In the
first case, a device has sent an RPC but hasn't received a reply, and in
the mean time, the peer device hangs up. The RPC library will then generate
a error response to the RPC `Call` method.

The second case, a device is acting as an RPC server and its peer disconnects or
cancels. In this case, it will just never receive the next expected message in
the protocol sequence (or will be unable to reply to an outstanding RPC).
In this case, it will also get an EOF on the underlying connection and can
interpret such a cancelation accordingly.

In terms of generating these EOFs from the application level, the application
just calls `Close()` on the `net.Conn`, which signals a cancelation to the
other side. If a device crashes or goes offline before finishing the protocol,
the other side will see a timeout in its `Get()` call, and should propogate an
`Error` to any outstanding `Read()` calls on the connection.

## Glossary

Here is a quick glossary of terminology used in this document:

  * KEX - key exchange
  * SecretBox — The [NaCl library](http://nacl.cr.yp.to)'s authenticated encryption function.
  * passphrase stream — scrypt(N=2<sup>15</sup>, r=8, p=1) of the user's passphrase and a random salt (abbreviated *pps* above)
  * userEK — a [user ephemeral key](/docs/crypto/ephemeral)
