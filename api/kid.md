
## Keybase Key IDs (KIDs)

Keybase introduces a new format for public key IDs, inspired by PGP's
fingerprint, but: (1) versioned and hence upgradable in the future; (2) based
on SHA2 rather than SHA1; and (3) able to accomodate newer cryptosystems like
EdDSA without the need for hashing.

### The KID format

Version 1 of Keybase KIDs are 35-bytes long, and take the form:

```
┌──────────┬──────────┬─────────────────────────────────┬──────────────┐
│ version  │ key type │             payload             │ '0a' trailer │
│ (1 byte) │ (1 byte) │           (32 bytes)            │   (1 byte)   │
└──────────┴──────────┴─────────────────────────────────┴──────────────┘
```

The fields are described as follows:

   * **version** — A 1-byte version number, which is set to `0x01` for version 1. If ever we change the representation of anything below, we'll bump to a new version.

   * **key type** - A 1-byte field describing what type of key we're referring to.  Values `0x00` through `0x1f` are as in the [PGP Spec, RFC 4880, Section 9.1](https://tools.ietf.org/html/rfc4880#section-9.1). Most relevant, we have:
      * `0x01` - PGP-style RSA, with PGP-style keys and packets
      * `0x11` - PGP-style DSA, with PGP-style keys and packets

   Values `0x20` and up are for other cryptosystems, that may or may not be specified along with PGP. So far, we have:
      * `0x20` - [EdDSA](http://ed25519.cr.yp.to/ed25519-20110926.pdf), with Keybase-style packets.
      * `0x21` - [DH over Curve25519](http://cr.yp.to/ecdh/curve25519-20060209.pdf), with Keybase-style packets.

   * **payload** - For PGP-style keys, this is the [SHA-256](https://tools.ietf.org/html/rfc4634) of the keymaterial included in the standard PGP fingerprint (see [RFC 4880, Section 12.2](https://tools.ietf.org/html/rfc4880#section-12.2)). For Keybase-style EdDSA and DH over Curve25519, the payload is simply the public key itself, which is
  	32 bytes in both cases.

   * **trailer** - We append a one-byte trailer to all KIDs, simply the byte `0x0a`. [Keybase identifiers](ids) have a one-byte trailer so that we can distinguish one type of hash from the other by simple inspection. A trailing byte of `0x0a` is reserved for KIDs.
