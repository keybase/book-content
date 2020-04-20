
## Keybase IDs Suffixes

With lots of different types of IDs floating around, we adopted a
convention of appending trailing bytes to otherwise opaque identifiers
so that one can identify, at a glance, what type of ID it is.  Here
are the reserved public ID suffixes that are currently in use:

   * `0x00` — User ID version 1. The first Keybase User IDs were random 15-byte identifiers with a trailing `0x00` byte.  These identifiers were generated independently of username. We discovered, however, that the disassociation between the two gives the server an opportunity to confuse clients.  Thus, all of the original keybase User IDs are permanently pinned to the sitewide Merkle tree.  See `payload_json.body.legacy_uid_root` of the [current Merkle tree](https://keybase.io/_/api/1.0/merkle/root.json).

   * `0x0a` — [Key IDs](kid)

   * `0x0f` — Signature IDs

   * `0x19` — User ID version 2. Since March of 2015, all Keybase UIDs are the first 15 bytes of the SHA-256 hashes of the corresponding username.  There was a bug early on where we didn't call `toLower` on these usernames, that was fixed in May 2015.

There are other suffixes used internally, which we may document in the future.