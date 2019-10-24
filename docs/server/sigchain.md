## Meet your sigchain (and everyone else’s)

Every Keybase account has a public signature chain (called a *sigchain*), which is an ordered list of statements about how the account has changed over time. When you [follow](/docs/server_security/following) someone, add a key, or connect a website, your client signs a new statement (called a *link*) and publishes it to your sigchain.

As JSON (some fields removed), a sigchain looks like this:

```json
[
	{
		"body": {
			"device": { "name": "squares" },
			"key": { "kid": "01208…" },
			"type": "eldest"
		},
		"prev": null,
		"seqno": 1
	},
	{
		"body": {
			"device": { "name": "squares" },
			"key": { "kid": "01208…" },
			"type": "web_service_binding",
			"service": { "name": "github", "username": "keybase" }
		},
		"prev": "038cd…",
		"seqno": 2
	},
	{
		"body": {
			"device": { "name": "rectangles" },
			"key": { "kid": "01208…" },
			"type": "sibkey",
			"sibkey": { "kid": "01204…", "reverse_sig": "g6Rib…" },
		},
		"prev": "192fe…",
		"seqno": 3
	},
	{
		"body": {
			"device": { "name": "squares" },
			"key": { "kid": "01208…" },
			"type": "track",
			"track": {
				"basics": { "username": "cecileb" },
				"key": { "kid": "01014…" },
				"remote_proofs": [
					{
						"ctime": 1437414090,
						"remote_key_proof": {
							"check_data_json": {
								"name": "twitter",
								"username": "cecileboucheron"
							},
						},
					},
				]
			},
		},
		"prev": "9fcc8…",
		"seqno": 3,
	}
]
```

This sigchain is from a user who…

1. Signed up for Keybase from a device called “squares” which generated a [NaCl](http://nacl.cr.yp.to/) device key
2. Proved their GitHub account
3. Used squares to add another device called “rectangles” with its own key
4. Used rectangles to follow [cecileb](/cecileb)

{# if me? {:
You can browse your own sigchain [online](#{"/#{me.basics.username}/sigchain"}) or through [the API](#{"/_/api/1.0/sig/get.json?uid=#{me.id}"}).
:} else {:
You can try browsing a real sigchain [online](/max/sigchain) or through [the API](/_/api/1.0/sig/get.json?uid=dbb165b7879fe7b1174df73bed0b9500).
:} #} Since sigchains are **public**, you can do this for any user on Keybase!

Every sigchain link is signed by one of the user’s keys and includes a sequence number and the hash of the previous link. Because of this, the server can’t create links on its own or omit links without invalidating the whole sigchain. We use a [public Merkle tree](/docs/server_security) to make it difficult for us to roll back a sigchain to an earlier state without being noticed.

## Sibkeys

A Keybase account can have any number of sibling keys (called *sibkeys*) which can all sign links. This is different from PGP, which has a “master key” that you’re expected to keep tucked away in a fireproof safe — because if you misplace a device that has a copy of it, your only option is to [revoke the whole key and start from scratch](http://www.apache.org/dev/key-transition.html). We discuss this problem in [a blog post](/blog/keybase-new-key-model).

You add and remove sibkeys by adding links to your sigchain. Since every link is checked against the state of the account *at that point in the sigchain*, old links remain valid even if their signing keys are revoked later. Revoking a key doesn’t affect your identity proofs, other keys, or followers.

## Playback

To find the current state of an account (e.g. when you run `keybase id max`), the client starts out assuming that the key specified for the account in the Merkle tree is a sibkey, then *plays back* the sigchain link by link, keeping track of valid sibkeys and the effects of other links.

*An implementation detail: since accounts can be reset, it actually starts playback at the most recent link whose `eldest_kid` matches the one in the Merkle tree.*

## Link structure

A complete version of the first link from the sigchain above looks like this:

```json
{
	"body": {
		"device": {
			"id": "ff07c…",
			"kid": "01208…",
			"name": "squares",
			"status": 1,
			"type": "desktop"
		},
		"key": {
			"host": "keybase.io",
			"kid": "01208…",
			"uid": "e560f…",
			"username": "sidney"
		},
		"type": "eldest",
		"version": 1
	},
	"client": {
		"name": "keybase.io go client",
		"version": "1.0.0"
	},
	"ctime": 1443241228,
	"expire_in": 504576000,
	"merkle_root": {
		"ctime": 1443217312,
		"hash": "06de9…",
		"seqno": 292102
	},
	"prev": null,
	"seqno": 1,
	"tag": "signature"
}
```

Some properties are common to every type of link. Here’s an overview:

- `body` – Information specific to the type of link, plus some common properties:
  - `type` – The type of the link
  - `device` – Optional details about the device that made the link
  - `key` – Information about the key that will sign the link. Contains these properties:
    - `host` – Currently always “keybase.io”
    - `eldest_kid` – The [KID](/docs/api/1.0/kid) of the eldest key in this subchain. If missing, then eldest key is assumed to be the signing key (helps to identify account resets)
    - `kid` – The key’s KID
    - `key_id`: For a PGP key, the last eight bytes of its fingerprint (legacy)
    - `fingerprint`: For a PGP key, its full fingerprint
    - `uid`: The user ID of the sigchain’s owner
    - `username`: The username of the sigchain’s owner

    *When a PGP key is being introduced or updated, there can also be a `full_hash` property which is a SHA-256 hash of an armored copy of the public key. This pins the key to a specific version.*
- `client` – Optional version information about the client that made the link
- `ctime` – When the link was created, as a [Unix timestamp](https://en.wikipedia.org/wiki/Unix_time)
- `expire_in` – How long the statement made by the link should be considered valid, in seconds, or `0` if it doesn’t expire
- `merkle_root` – The creation time, hash, and sequence number of the Merkle tree root at the time the link was created
- `prev` – The hash of the previous sigchain link when packed as [canonical JSON](/docs/api/1.0/canonical_packings), or `null` if this is the first link
- `seqno` – Specifies that this is the *n*th link in the user’s sigchain
- `tag` – Currently always “signature”. There may be other tag types in the future.

Properties have been added and deprecated over time, so there’s some duplication and not all links in the wild have them all.

## Link types

Each section below starts with an example `body` (and leaves out `key`, `device`, and `version`, which were described above).

### `eldest`

```json
{
	"type": "eldest"
}
```

Appears at the beginning of a sigchain or after an account reset (may not have been inserted by legacy clients). The link’s signing key becomes the account’s first sibkey.

### `sibkey`

```json
{
	"type": "sibkey",
	"sibkey": { "kid": "01204…", "reverse_sig": "g6Rib…" }
}
```

Add a new sibkey to the account. `reverse_sig` is a signature of the link by the new sibkey itself, made with the `reverse_sig` field set to `null`, and makes sure that a user can’t claim another user’s key as their own.

### `subkey`

```json
{
	"type": "subkey",
	"subkey": { "kid": "01216…", "parent_kid": "01204…" }
}
```

Add a new encryption-only *subkey* to the account. We plan to use these in the future.

### `pgp_update`

```json
{
	"type": "pgp_update",
	"pgp_update": {
		"kid": "01012ba0d60aa99320643f47eb787dc637821bc77cc89ccffbdbfd62124c1c22c1460a",
		"key_id": "0DAA1A4AB1D88291",
		"fingerprint": "5e685e60eb8733654dcb00570daa1a4ab1d88291",
		"full_hash": "e02a1871c01285608c5bac3fb00be419b982c3c312c2c517ec6a1d9f7323be4f",
	}
}
```

Update a PGP key to a new version (which may have new subkeys, revoked subkeys, new user IDs…). The `pgp_update` section contains the same properties a `key` section would. `full_hash` is expected to have changed, the other properties should be unchanged.

### `revoke`

```json
{
	"type": "revoke",
	"revoke": {
		"kids": [ "01201…", "01215…" ],
		"sig_ids": [ "038cd…", "f927c…" ]
	}
}
```

Remove the keys in `kids` from your account. Any previous links they’ve signed are still valid, but they can no longer sign new links and other users should no longer encrypt for them after seeing the `revoke` link. Also reverse the effects of the links in `sig_ids` — this can be used to remove, for instance, a `web_service_binding`.

### `web_service_binding`

```json
{
	"type": "web_service_binding",
	"service": { "name": "github", "username": "keybase" }
}
```

Claim, “I am `username` on the website `name`”. The client will look for a copy of the link and signature on the website, in an appropriate place. The server searches for the proof when the link is first posted, and caches its permalink (e.g. the tweet, on Twitter, the Gist, on GitHub) so that the client doesn’t have to rediscover it each time.

The `service` section can also look like this, which claims that you control the given domain name (the client looks for the proof in DNS):

```json
{ "domain": "keybase.io", "protocol": "dns" }`
```

…or like this, which claims that you control the given website (the client looks for the proof at a known path):

```json
{ "hostname": "keybase.io", "protocol": "http:" }`
```

### `track` (to 'follow' someone)

We call this "follow" around the interface now, but our old word is "track"...so that's what you'll see in your sig chain:

```json
{
	"type": "track",
	"track": {
		"id": "673a7…",
		"basics": {
			"id_version": 30,
			"last_id_change": 1440211236,
			"username": "cecileb"
		},
		"key": {
			"kid": "01018…",
			"key_fingerprint": "6f989…"
		},
		"pgp_keys": [
			{
				"kid": "01018…",
				"key_fingerprint": "6f989…"
			}
		],
		"remote_proofs": [
			{
				"ctime": 1437414090,
				"curr": "ee483…",
				"etime": 1595094090,
				"remote_key_proof": {
					"check_data_json": {
						"name": "twitter",
						"username": "cecileboucheron"
					},
					"proof_type": 2,
					"state": 1
				},
				"seqno": 1,
				"sig_id": "02ad8…",
				"sig_type": 2
			}
		]
	}
}
```

Make a [snapshot of another user’s identity](/docs/server_security/following) that your other devices trust. The `track` section contains these properties:

- `id` – Their user ID
- `basics` – Contains their username and identity generation. The server bumps the identity generation whenever the state of any of their proofs changes, as a hint to the client that it should recheck them all and possibly alert the user to the change.
- `key` – Contains the KID and fingerprint (if applicable) of their eldest key.
- `pgp_keys` – An array of the KID and fingerprint of every one of their PGP keys
- `remote_proofs` – An array of objects which represent their proofs. Many properties are copied directly from the relevant links in the followee’s sigchain, but there are some non-obvious ones:
  - `curr` – The hash of the link which contains the proof
  - `sig_type` – An integer representation of the proof’s link type, currently always `2` (`web_service_binding`)
  - `remote_key_proof`
    - `check_data_json` – The `service` section of the identity proof link
	- `proof_type` – An integer representation of the account being proven (Twitter, GitHub, etc.)
	- `state` – An integer representation of whether the client could successfully verify the proof when making the tracking statement.

A repeat `follow` link for the same user replaces the previous one (the user may have re-followed due to a change in proofs).

### `untrack` (to "unfollow" someone)

```json
{
	"type": "untrack",
	"untrack": {
		"basics": { "username": "maria" },
		"id": "47968…"
	}
}
```

Stop following a user. Your other devices will resume checking their identity proofs and presenting them to you whenever you interact with them. `id` is the user’s UID.

### `cryptocurrency`

```json
{
	"type": "cryptocurrency",
	"cryptocurrency": { "address": "1BYzr…", "type": "bitcoin" }
}
```

Advertise a cryptocurrency address. Currently Bitcoin, ZCash and ZCash sapling addresses are supported.

### `per_user_key`

```json
{
	"per_user_key": {
		"encryption_kid": "0121ef031c4b97e9e7febbfcce64952acba528a0f1b3f67b9c4264fa0a4ebefd401b0a",
		"generation": 15,
		"reverse_sig": "hKRib2R5hqhkZXRhY2hlZ...",
		"signing_kid": "0120eb42e0f5db28909adae170de9f5fc24016dc716b4fcc5f6b3956ee1e4937e9880a"
    },
    "type": "per_user_key",
}
```
Add or rotate a [Per-user](https://keybase.io/docs/teams/puk) signing and encryption key.
`reverse_sig` is the signature over the sigchain link with new per-user signing key itself.
The `generation` number starts at one and increments whenever the per-user keys are rotated, typically
after a device revocation.
## footnote 1: *PGP key servers and lying by omission*

When someone changes a PGP key — to update its expiration date or add a signature, for example — they’re expected to broadcast the change to a [key server](https://en.wikipedia.org/wiki/Key_server_\(cryptographic\)). That key server is responsible for forwarding the change to other key servers, and so on. Eventually, someone else can ask any other key server if there have been updates to the key, and receive them.

Notably, nothing stops someone from making a change to their PGP key on one computer, a different change on another computer, and sending each change to a different key server. The key servers are expected to share updates and offer their own combined versions of the key for download.

The design of PGP keys stops an attacker from creating fake updates, but a dishonest key server can still choose to ignore updates that revoke keys, revoke signatures, and add expiration dates, but publish updates that add new keys, add new signatures, and take away expiration dates.

Keybase sigchains aim to avoid this.
