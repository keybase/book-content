
# Keybase Signature Chain V2

Sigchain V2 is an expansion on the previous version of the sigchain ([V1](../sigchain)).
As we've been building out Keybase, mobile and teams in particular, we've discovered new requirements for the sigchain,
and have made (backwards-compatible) changes accordingly:

  * Compression: As is, the sigchain is quite bloated. If you start a conversation with [Chris Coyne](https://keybase.io/chris), you'll have to download his full sigchain, which is ~6MB big (3MB compressed) and growing.  The bulk of it is chris following other users, which is mixed in with his crucial key and device updates.  Each sigchain link is about 6k big right now.  On mobile, this will be especially painful, since you'll have to download a ton of data (potentially over a spotty link) before you can start talking with chris.
  * Semi-private links: some links might be withheld from some (most) viewers, because they contain private information (that the server can see). Examples include the members of teams.

This document explains the V2 construction at a high level.

## Example

Let's say you had a V1 link of the form:

```javascript
ar inner_link = {
  "body": {
    "key": {
      "eldest_kid": "01013ef90b4c4e62121d12a51d18569b57996002c8bdccc9b2740935c9e4a07d20b40a",
      "host": "keybase.io",
      "kid": "0120d3458bbecdfc0d0ae39fec05722c6e3e897c169223835977a8aa208dfcd902d30a",
      "uid": "dbb165b7879fe7b1174df73bed0b9500",
      "username": "max"
    },
    "track": {
      "basics": {
        "id_version": 38,
        "last_id_change": 1487592188,
        "username": "michael"
      },
      "id": "aa1e1ca79c2838d4b1da4569b5200500",
      "key": {
        "key_fingerprint": "b4df6d7c3e744d41bbab458177fff4cac061a1cc",
        "kid": "0101ed29008279a6cda883b6d415eac0abdaed27a3917a297378b8328dec83ebd0ef0a"
      },
      "pgp_keys": [
        {
          "key_fingerprint": "b4df6d7c3e744d41bbab458177fff4cac061a1cc",
          "kid": "0101ed29008279a6cda883b6d415eac0abdaed27a3917a297378b8328dec83ebd0ef0a"
        }
      ],
      "remote_proofs": [
        {
          "ctime": 1453792180,
          "curr": "6c2c8eece6d12328486280763e15439a114ac8615c993b870a8e061f3ac9a98d",
          "etime": 1958368180,
          "prev": "368186690020ceb2b25691551fe4a28f19dad95654cab776454bab4843f70216",
          "remote_key_proof": {
            "check_data_json": {
              "name": "twitter",
              "username": "mcoyne88"
            },
            "proof_type": 2,
            "state": 1
          },
          "sig_id": "10210278d9be8d8285dbf8554073b75980fc6b7dffa733a5b2f2e70a2cfd6e3d0f",
          "sig_type": 2
        },
        {
          "ctime": 1453790811,
          "curr": "3b583421a55b841a53107668850c83954b81f5a05a00bca54e66a20d0a64d983",
          "etime": 1611470811,
          "prev": "be74bcbe134a5bb016e54902896e4415c9c70e722bc9a2f5b19f9fee085e70b8",
          "remote_key_proof": {
            "check_data_json": {
              "name": "github",
              "username": "mcoyne88"
            },
            "proof_type": 3,
            "state": 1
          },
          "sig_id": "c89116cb21b780d395310052af136c3592376224b4852ae3e5938ee7e1442bd70f",
          "sig_type": 2
        },
        {
          "ctime": 1453791455,
          "curr": "d7b99d0dba2e1e3a6efe744510344da00f48383d7d205016d1d2538c16baba0b",
          "etime": 1611471455,
          "prev": "3b583421a55b841a53107668850c83954b81f5a05a00bca54e66a20d0a64d983",
          "remote_key_proof": {
            "check_data_json": {
              "name": "reddit",
              "username": "mcoyne88"
            },
            "proof_type": 4,
            "state": 1
          },
          "sig_id": "00cfd5d05426e0d02cac9cbcf779250209922a6430f40ea4b7c9f8569f95a9680f",
          "sig_type": 2
        }
      ],
      "seq_tail": {
        "payload_hash": "dd6f241934340e5ff22127dd1e2d09aed8a74bf1318c0370ccf13c3477a5b178",
        "seqno": 21,
        "sig_id": "a9dbd4ef50181b8eead339e9fb633a448ad02c4b35bbdb922ee45b52d3b7d8380f"
      }
    },
    "type": "track",
    "version": 1
  },
  "client": {
    "name": "keybase.io go client",
    "version": "1.0.18"
  },
  "ctime": 1487643163,
  "expire_in": 504576000,
  "merkle_root": {
    "ctime": 1487643103,
    "hash": "41d826585d8aaf84143b581797b25daebe9f5f20444e3a0ded49bbbafc50200227284b40ff009499955a9563b777343252305aa2a95c2cc0158f15da86cf3c5f",
    "seqno": 909161
  },
  "prev": "3e64903fc3e6e8249c1efe37c0106a16867b73d22d2f3b67ebcdbc075583e0e5",
  "seqno": 278,
  "tag": "signature"
}
```

You'll note this JSON blob is 2.4k big (after stripping away whitespace).  In sigchain V2, we introduce a new wrapper object:

```javascript
var outer_link = msgpack.pack([
  2,
  278,
  (Buffer.from("PmSQP8Pm6CScHv43wBBqFoZ7c9ItLztn6828B1WD4OU=", "base64")),
  (Buffer.from("Nl6GvU1ABnORNY4s2sKRyxNl9Pyx1r/TQeA/eYRMnA4=", "base64")),
  3,
  1
])
```

The relevant components are:


  * **Position 0**: `version` — value is `2` for all V2 links
  * **Position 1**: `seqno` — In the above exampke, the value is `278` which describes the sequence number of this chainlink in the sigchain. As always, this must be an exactly sequential sequence. It must match `seqno` of the inner link.
  * **Position 2**: `prev` — The full SHA2 hash of the previous outer link, after msgpack encoding. In the above example, the value is `PmSQP8Pm6CScHv43wBBqFoZ7c9ItLztn6828B1WD4OU=` (in base64).
  * **Position 3**: `curr` — The full SHA2 hash of the inner link; `hash(payload_json)`. In this example, the value is
`Nl6GvU1ABnORNY4s2sKRyxNl9Pyx1r/TQeA/eYRMnA4=` (in base64)
  * **Position 4**: `type` — The type of the sigchain link, using the numerical table below. In the above example, we have a value
  of `3` that corresponds to `track`.
  * **Position 5**: `seqno_type` — Users and teams can have both public and "semiprivate" sigchains. In "semiprivate" chains, the server can see the value of the inner link, and can selectively expose it, based on access control mechanisms. The value here
  is implied if it's not specified explicitly. The default value for user's chains is `1`, which means `PUBLIC`. The default
  values for teams is `3`, which means `SEMIPRIVATE`.

## Generating Chain Links

If you run this little program in your node interpreter, you'll get a buffer that's 75 bytes big, a huge savings over the above!

Now, when a user actually signs a new link into their sigchain, they'll sign the value:

```javascript
var input = Buffer.from(outer_link,"binary")
var sig = device_key.sign(input)
```

When a client posts a signature, it now posts:

  * `outer_link` as shown above
  * `inner_link` as before
  * `sig(outer_link)`

When other clients replay sigchains, they always get `outer_links` but
sometimes do not download `inner_links` either to save bandwidth because they
are unauthorized. A client who is decoding a full sigchain must manually check
that the outer values match the inner values, and should reject links that
don't match.

## Constants

From [JavaScript](https://github.com/keybase/proofs/blob/c75faba42b3d6f17f972614e6bf1fe9a45716d26/src/constants.iced#L40-L68)
or [Go](https://github.com/keybase/client/commit/da752f40b3ff4bce5fca8e4dce66fe3116802d03/go/libkb/chain_link_v2.go#L15-L43), here
are the numerical equivalents of all proof types:

```iced
sig_types_v2:
  eldest : 1
  web_service_binding : 2
  track : 3
  untrack : 4
  revoke : 5
  cryptocurrency : 6
  announcement : 7
  device : 8
  web_service_binding_with_revoke : 9
  cryptocurrency_with_revoke : 10
  sibkey : 11
  subkey : 12
  pgp_update : 13
  per_user_key : 14
  team :
    index : 32
    root : 33
    new_subteam : 34
    change_membership : 35
    rotate_key : 36
    leave : 37
    subteam_head : 38
    rename_subteam : 39
    invite : 40
    rename_up_pointer : 41
    delete_root : 42
    delete_subteam : 43
    delete_up_pointer : 44
```

Similarly, from [JavaScript](https://github.com/keybase/proofs/blob/c75faba42b3d6f17f972614e6bf1fe9a45716d26/src/constants.iced#L88-L92) and
[Go](https://github.com/keybase/client/blob/da752f40b3ff4bce5fca8e4dce66fe3116802d03/go/libkb/constants.go#L611-L615),
here are the sigchain sequence types:

```iced
seq_types :
  NONE : 0
  PUBLIC : 1
  PRIVATE : 2
  SEMIPRIVATE : 3
```
