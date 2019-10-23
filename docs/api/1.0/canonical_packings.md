
## Canonical Packings for JSON and Msgpack

As seen throughout the Keybase API docs, Keybase commands compute
signatures over JSON objects (e.g., [sig/post.json](call/sig/post)) and
pack cryptographic materials in the Msgpack format (e.g., [Keybase-style
signatures](sigs)).  In both cases, we specify that client canonicalize
objects before computing signatures and submitting objects to the server.
The server enforces these canonicalizations and reject any inputs
that do not follow them.

### JSON

For JSON, we enforce the following canonicalization rules for serialized objects:

  * Within a given map, keys cannot be repeated.
  * Keys are ordered lexicographically, sorted with case-sensitiviy.
  * Keynames must be quoted with double quotes.
  * No whitespace can be used in stringification output
  * All characters must be in the ASCII range `[0x20,0x7e]`.
  * All strings must use the minimal length encoding. For example, `"A"` and not `"\u0041"`.

The easiest was to enforce these properties is to decode incoming JSON objects, reencode using a canonical packer, and the compare that the two are byte-for-byte equivalent.

### Msgpack

The rules for [Msgpack](http://msgpack.org) encoding are similar to those for JSON:

  * Within a given map, keys cannot be repeated
  * Keys are ordered lexicographically, sorted with case-sensitiviy.
  * All encodings must be minimal length.  For instance:
  	* For maps: `81 a1 61 01` and not `de 00 01 a1 61 01`
  	* For arrays: `9a 02` and not `dc 00 01 02`
  	* For strings, `a2 68 69` and not `d9 02 68 69`
  	* For ints, `01` and not `cc 01`

As above, the easiest way to enforce all of these properties is to decode incoming
msgpack objects, reencode with the canonical encoder, and check for byte-for-byte
equality.

