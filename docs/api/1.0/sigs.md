
## Keybase-Style Signatures

Device-specific keys in Keybase aren't PGP keys, but rather are simple
[EdDSA keys](http://ed25519.cr.yp.to/ed25519-20110926.pdf). There's no reason
to employ all of the PGP-machinery just to encapsulate a signature, so we
introduce a simple packet-format to convey a signature and its associated
fields.

### Packet Layout

The interior of the packet is a JSON-style object with boolean,
integer, and binary fields:

```javascript
{
  "body": {
    "detached": true,
    "hash_type": 10,
    "key": <Buffer 01 20 ... 0a>,
    "payload": <Buffer ... >,
    "sig": <Buffer ... >,
    "sig_type": 32 },
  "tag": 514,
  "version": 1
}
```

The packet is encoded using [canonicalized](canonical_packings) [msgpack](http://msgpack.org/) and then standard Base-64.

### Field Descriptions

The fields are:

   * **body.detatched** — On if the signature payload is not prepended to the signature.
   * **body.hash_type** — Describes which hash function was used to hash the data before it was signed. This field uses the PGP's hash identification scheme from [RFC 4880, Section 9.4](https://tools.ietf.org/html/rfc4880#section-9.4). Only `0x0a` is used so far, meaning SHA-512.
   * **body.key** — The [KID](kid) of the public key that can be used to verify this signature. Should always start with `0x0120`, meaning an EdDSA Key.
   * **body.payload** — The data the signature is computed over. Can be omitted in the case of a fully "detached" file (like an ISO or a VOB).
   * **body.sig** — The 64-byte output of EdDSA (or whatever signature is employed).
   * **body.sig_type** — The type of cryptosystem used to generate the signature.  Should correspond to the second byte of **sig.key**.  See our description of [KIDs](kid) for a list of all algorithms, but only `0x20` is relevant here, for EdDSA.
   * **tag** — A tag describing what type of packet this is. `0x202` is used for signatures.
   * **version** — A version of this packet format.  Only version 1 is currently in use.

