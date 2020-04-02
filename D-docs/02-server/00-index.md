
## Overview

We've been working on Keybase.io for a little over half a year now, and we
would like it succeed, but we're a little bit nervous. The more successful we
are, the more valuable target we become.

Here are the attacks we are most concerned about:

  1. Server DDOS'ed
  1. Server compromised; attacker corrupts server-side code and keys to send bad data to clients
  1. Server compromised; attacker distributes corrupted client-side code

We've taken some steps to protect the service from these attacks,
and we wanted to describe them so you know what to look for.

## What Keybase is Really Doing

Before we can describe how we protect keybase, we have to describe what it's
actually doing, and what warrants protection.  The central function of Keybase
is to store, in a standardized format, public signatures for our users.  The
important signatures are of the form:

   1. **Identity proofs**: "I am Joe on Keybase and MrJoe on Twitter"
   1. **Follower statements**: "I am Joe on Keybase and I just looked at Chris's identity"
   1. **Key ownership**: "I am Joe on Keybase and here's my public key"
   1. **Revocations**: "I take back what I said earlier"

For instance, when Joe wants to establish a connection to an identity on
Twitter, he would sign a statement of the first form, and then post that
statement both on Twitter and Keybase.  Outside observers can then reassure
themselves that the accounts Joe on Keybase and MrJoe on Twitter are controlled
by the same person.  This person is usually the intended keyholder, but of
course could be an attacker who broke into **both** accounts.

When an honest Joe signs such a proof, he also signs the hash of his previous
signature. Thus, outside observers who want to verify all of Joe's signatures
need only verify the last in the chain; the others follow.  For example, I
last signed a [statement](https://keybase.io/_/api/1.0/sig/get.json?sig_id=5dc95450ceb878b3cdfe35d7ecd92695733046c6731132754fa303ebb3cac81a0f)
that I follow Keybase user [al3x](https://keybase.io/al3x). I signed a JSON blob that
contains relevant information about me and Alex, and also the key-value pair
`"prev":"d0bd03..."`, where `d0bd03...` is the SHA-256 hash of the
previous JSON blob I signed.

For a given user, the sum total of their signatures captures the state they
wish to remember and to advertise to the world.  For instance, my  current
profile shows that I am maxtaco on Twitter, that I was TacoPlusPlus on GitHub,
but now I'm maxtaco there, too, and that I believe the Chris who is
malgorithms on Twitter and malgorithms on GitHub is the "correct" Chris Coyne.
Five signatures (one of which is a revocation) comprise this state; and
an honest Keybase server should always show everyone these five
signatures, so we can faithfully reconstruct my state in our clients.

## Attacks 1 and 2: DDOS and Corrupted Data

We mentioned three attacks on this system. Consider the first two, which aim
to prevent honest clients from retrieving signature data for honest users.  A
blunt attacker might DDoS Keybase's servers, preventing anyone from accessing
Keybase's data. A more sophisticated attacker might root keybase's server,
compromise its signing keys, and start sending back corrupted data to honest
clients.

Two mechanisms, enforced by clients and third-party observers, defend against
both attacks:

   1. All user signature chains must grow monotonically, and can never be "rolled back"
   1. Whenever a user posts an addition to a signature chain, the site must
      sign and advertise a change in global site state, and these updates are [totally
      ordered](http://en.wikipedia.org/wiki/Total_order).


### Untrusted Mirrors

The first implication of these requirements is that untrusted third parties
can mirror the site state, and clients can access data from either the Keybase
server or the mirrors. By requirement (2), the server must publish and sign
all site updates. A client doesn't care where these updates come from, as long
as the signature verifies, and the site state jibes with the signature.

(We're not aware of third-party mirrors *yet*, and our reference client
would need some modifications to handle a read-only server. However, we
encourage all to scrape our APIs in preparation.)

### Be Honest or Get Caught

The second implication of these requirements is that a compromised server
has a choice of acting like an honest server, or making "mistakes" that
honest users can detect.  An attacker who gains control of the server can:

   1. Selectively rollback a user's signature chain and/or suppress updates
   1. Fake a "key update", and append signatures at the end of a user's chain
   1. Show different versions of the site state to different users

Since version v0.3.0, the Keybase [command-line client](https://keybase.io/docs/command_line)
defends clients from these server attacks. Take the example of what happens when
[I](https://keybase.io/max) ["follow"](https://keybase.io/docs/server_security/following) [Alex](https://keybase.io/al3x).  My client downloads both
of our signature chains from the server, and runs them through cryptographic verification,
checking that our hash chains are well-formed and signed. It furthermore
checks new data against cached data and complains if the server has "rolled back" either
chain.  My client prevents a compromised server from changing Alex's key
the same way it prevents Eve from impersonating Alex: it checks for corroboration
of Alex's identity and key proofs on other services (like Twitter, GitHub and DNS).

To prevent the server from ["forking"](https://www.usenix.org/legacy/events/osdi04/tech/full_papers/li_j/li_j.pdf?q=untrusted) my view of the site data from Alex's, my client checks
that all signature chains are accurately captured in the site's global
[Merkle Tree](http://en.wikipedia.org/wiki/Merkle_tree) data structure.
It downloads the [root](https://keybase.io/_/api/1.0/merkle/root.json?seqno=2728)
of this tree from the server, and verifies it against the site's
[public key](https://keybase.io/docs/server_security/our_merkle_key). If the check
passes, it fetches the [signed root block](https://keybase.io/_/api/1.0/merkle/block.json?hash=c2cca49b3d84915ba7bcae1290bda223badce2d667bf769df87c3f81efb192ca268055a719693b4a3682d9391d8be8e42a75760f01cc39a330e6f42bb308518e). My UID is `dbb165...`, so my client follows the `db...` path
down the tree, which is block [`68b5d3...`](https://keybase.io/_/api/1.0/merkle/block.json?hash=68b5d3599be9acbe97bcc45603a322f85f8a99b9cbc696592fe1088c3a099a45d929f0bc2fae2230f0b31b5e4b4122365f50b34fcf91a94a357df90a83e3b013).  Now, my leaf is visible, showing my signature chain
finishing off at link 42, with hash `d0bd03...`, which matches the data it fetched
earlier.  My client does the same for Alex's chain.  After all checks succeed,
my client signs my chain, Alex's chain and also Merkle root at the time
of the signature; it posts [this signature](https://keybase.io/_/api/1.0/sig/get.json?uid=dbb165b7879fe7b1174df73bed0b9500&low=43) as a follower statement.

A very sophisticated attacker could show my client and Alex's client
different signed Merkle roots, but must maintain these forks permanently
and [can never merge](http://www.scs.stanford.edu/nyu/02fa/sched/sundr.pdf).
Users "comparing notes" out-of-band immediately expose server duplicity.

## Keybase Client Integrity

Thus, the keybase clients in the wild play a crucial role in keeping the Keybase server
honest.  They check the integrity of user signature chains, and can find
evidence of malicious rollback.  They alert Alice when her following of
Bob breaks, if either Bob or the server was compromised.
They check the site's published Merkle tree root for consistency against
known signature chains.  And they sign proofs when all these checks complete,
setting up known safe checkpoints to hold the server accountable to in the future.

So everything depends on the intergrity of the Keybase clients, that they
are functioning properly and aren't compromised.  We offer several
safeguards to protect client integrity.  First, we keep an Open API and state that
our open-source client is simply a *reference client*, and that developers are free
to make new clients in different languages if they think we've done a bad job.
Second, we sign all updates to the Keybase reference client, and
provide an [update mechanism](https://github.com/keybase/node-installer/wiki/Update-Architecture)
to download new clients without trusting HTTPS, only the integrity
of our key.  We keep that private key offline, so that it wouldn't be compromised
in the case of a server compromise.

We fully understand that users of the Keybase Web client don't get these guarantees.
But our hope is that enough users will use the Keybase command-line client
to keep the Web users safe, by catching server misbehavior in the case of a
compromise.

## Next Steps

The purpose of this article was to explain the security mechanisms the keybase
system currently has in place. Going forward, it would be great if third
parties were interested in hosting untrusted mirrors. These mirrors could
eventually become auditors, too, allowing Alice and Bob to compare notes and
convince themselves they're seeing a consistent view of the site's state.

And...an update! We're now publishing the merkle root into [the bitcoin block chain](/docs/server_security/merkle_root_in_bitcoin_blockchain).

Thanks for reading, and happy keybasing!



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

<div id="page-doc-following">

  <h2>Understanding following (previously called "tracking")</h2>

  <div class="row">
    <div class="col-sm-8">
      <p>
        We get some big questions about Keybase following:
      </p>
      <ul class="questions">
        <li class="question">When should I follow?</li>
        <li class="question">What does it get me?</li>
        <li class="question">Is it a "web of trust?"</li>
      </ul>
      <p>
        Hopefully this page can clarify and answer your q's.
      </p>
    </div>
    <div class="col-sm-4">
        <img src="/images/tracking/man_in_the_middle.jpg" class="img-responsive img-dreaming" width="1110" height="1113">
    </div>
  </div>


      <h3>But first, the goal of Keybase</h3>

      <p>
        Keybase aims to provide public keys that can be trusted without any backchannel communication. If you need someone's public key,
        you should be able to get it, and know it's the right one, without talking to them in person.
      </p>

      <p>This is a daunting proposition: servers can be hacked or coerced into lying about a key. So when you run a Keybase client - whether it's our <a href="/docs/command_line">reference client</a> or someone else's - that client needs to be highly skeptical about what the server says.
      </p>


      <p>
        When the Keybase server replies <b>"this is twitter user @maria2929's public key"</b>, there has to be a protocol for verification.
      </p>

  <div class="row">
    <div class="col-sm-3">
      <img src="/images/tracking/dreams_of_maria.jpg" class="img-responsive img-dreaming" width="1110" height="975">
    </div>
    <div class="col-sm-9">
      <p>
        Therefore, any cryptographic action on Maria follows 3 basic steps:
      </p>

      <ol>
        <li>The server provides maria's info</li>
        <li>Your client verifies her identity proofs on its own</li>
        <li>You perform a human review of her usernames</li>
      </ol>

      <p>Let's go over these three steps.</p>

    </div>
  </div>

      <h2>Step 1: the request</h2>
      <p>
        When you wish to encrypt a message for your friend Maria, you might execute a command like this:
      </p>
      <hcode>bash
      keybase encrypt maria -m "grab a beer tonight?"
      </hcode>
      <p>
        So, first, your client asks the Keybase server who this mysterious maria is.
      </p>
      <p>
        Keybase, the <i>server</i>, provides a response that explains its view of "maria".
        Technically speaking, it's a JSON object and there's a little more data in there, but the meat is something like this:
      </p>
      <hcode>json
      {
        "keybase_username": "maria",
        "public_key":       "---- BEGIN PGP PUBLIC KEY...",
        "twitter_username": "@maria2929",
        "twitter_proof":    "https://twitter.com/maria2929/2423423423"
      }</hcode>
      <p>
        Keybase has done its own server-side verification of maria, and it won't pass back identities that it hasn't checked.
      </p>


  <div class="row row-doc">
    <div class="#{lcol}">
      <h2>Step 2: the computer review</h2>

      <p>
        The keybase client does not trust the Keybase server. The server has just <i>claimed</i> that <b>keybase:maria</b> and <b>@maria2929</b> are the same person. But are they? In step
        2, the client checks on its own.
      </p>

      <p>
        Fortunately, the server included a link to maria's tweet. The Keybase client scrapes it.
      </p>

    </div>
    <div class="#{rcol}">
      <img src="/images/tracking/maria_twitter.jpg" class="img-responsive img-dreaming hidden-xs" width="1110" height="448">
    </div>
  </div>

  <div class="row row-doc">
    <div class="#{lcol}">
      <img src="/images/tracking/chalkboard.jpg" class="img-responsive img-dreaming" width="1110" height="971">
    </div>
    <div class="#{rcol} chalk-col">
      <p>
        To satisfy the client, the tweet must be special.  It must link to a signed statement which claims to be from maria on Keybase.
      </p>
      <p>
        In simplest terms, the Keybase client guarantees that "maria" has access to three things: (1) the Keybase account, (2) the twitter account, and (3) the private key referenced
        back in step 1.
      </p>
      <p>
        All this happens really fast in the client with no inconvenience to you. And it happens for all of maria's identities: her twitter account, her personal website, her github account, etc.
      </p>

    </div>
  </div>

      <h2>Step 3: the human review</h2>

      <p>
        Recall, in Step 2 your client proved "maria" has a number of identities, and it cryptographically
        verified all of them.  Now you can review the usernames it verified, to determine if it's the maria you wanted.
      </p>
<pre class="code code-highlighted">✔ <span class="hljs-string">maria2929</span> on <span class="hljs-attribute">twitter</span>: https://twitter.com/2131231232133333...
✔ <span class="hljs-string">pasc4l_programmer</span> on <span class="hljs-attribute">github</span>: https://gist.github.com/pasc4...
✔ admin of <span class="hljs-string">mariah20.com</span> via <span class="hljs-attribute">HTTPS</span>: https://mariah20/keybase.tx...

Is this the maria you wanted? [y/N]</pre>
      <p>
        If it is, the Keybase client encrypts and you're done.
      </p>

      <h2>Finally: following</h2>

      <p>
        Steps 2 and 3 were easy enough, but it would stink to keep repeating them, every time you switched computers. Especially
        the human review.
        Ideally, once you're satisfied with maria, you can just do this from any computer:
      </p>

      <hcode>bash
      # this should work with no interactivity
      keybase encrypt maria -m "another beer?"
      </hcode>

      <p>
        But we have a problem: recall, you don't trust the Keybase server.
        So how can you get maria's info when you switch machines, without doing that username review thing again? The answer is following.
      </p>

      <p>
        <b>"Following" (which we used to call "tracking") is taking a signed snapshot.</b>
      </p>

      <p>
        Using your own private key, you can sign a snapshot of her identity. Specifically, you're signing the data from step 1, with some extra info about your own review.
      </p>

      <p>
        When you switch computers, the Keybase server can provide you with your own definition of maria, which is signed by you, so it can't be tampered with.
      </p>

      <p>
        Your client can continue to perform the computer review as often as it wants. If the tweet disappears, your client will want to know.
      </p>

      <p>

      </p>


  <div class="row row-doc">
    <div class="col-sm-8">
      <h3>The advantages of public following</h3>

      <p>
        When Maria is followed by 100 people, and they've all signed identical snapshots to yours, this is helpful.
      </p>

      <p>
        If some of these statements are months old, but your own is only 1 day old, you can get some peace of mind that her identity was not compromised today, the day you decided to follow her.
      </p>

      <p>
        This is not a web of trust. You can prove maria's identity, even if there are no other followers. But more followers means more confidence in the age of her account.
      </p>

    </div>
    <div class="col-sm-4">
      <img src="/images/tracking/social.jpg" class="img-responsive img-dreaming" width="1110" height="1046">
    </div>
  </div>

      <h3>Why follow now?</h3>

      <p>
        As hinted above, an older follower statement is superior to a new one. It's hard for a hacker to maintain a <i>public</i> compromise of all of maria's accounts over a span of many months. Maria or
        maria's friends would surely notice.
      </p>
      <p>
        By comparison, if you started following Maria right now, today could've been the day all her accounts were broken into, simultaneously.
      </p>

      <p>
        Therefore, an older follower statement is a better one.
      </p>

      <p>
        <b>A gentle conclusion:</b> if you find someone interesting on Keybase - say you know them, or you like to read things they write, or they're a software developer who might sign code - following them now makes sense. This will begin a long and auditable history of following their identity.
      </p>


  <hr>
  <p>
    <i>We hope this doc helps. We'll revise it as questions/suggestions arrive in our <a href="https://github.com/keybase/keybase-issues/issues/100">github issue #100 (I don't understand tracking)</a>.</i>
  </p>

  <div class="appendix">
      <h2>footnote 1: <i>the PGP web of trust</i></h2>
      <p>
        In the web of trust model, you know you have Maria's key because you trust John, and John signed a statement
        saying that another key belongs to his friend "Carla", and then Carla in turn signed a statement saying that Maria is someone whose drivers license
        and key fingerprint she reviewed at a party. Your trust of Maria's key is a function of these such connections.
      </p>
      <p style="text-align:center;">
       <b>you</b> &rarr; john &rarr; carla &rarr; <b>maria</b><br>
       <b>you</b> &rarr; herkimer &rarr; carla &rarr; <b>maria</b>
      </p>
      <p>
        The PGP web of trust has existed for over 20 years. However it is very difficult to use, it requires in-person verifications,
        and it's hard to know what trust level to assign transitively. (Herkimer reports that Carla was drunk; John can't remember, but he was drunk too, and who's Carla again???)
      </p>
  </div>

</div>

## 🚀 Keybase is now writing to the Stellar blockchain 🚀

(Note, we previously were writing to the *Bitcoin* Blockchain, see the prior post [here](https://keybase.io/docs/server_security/merkle_root_in_bitcoin_blockchain).)

Every public announcement you make on Keybase is now verifiably signed by Keybase and hashed into the Stellar blockchain. To be specific, all of these:

- announcing your Keybase username
- adding a public key
- identity proofs (twitter, github, your website, etc.)
- public bitcoin address announcements
- public follower statements
- revocations!
- team operations

### Quick Background

Earlier, in [the server security overview](https://keybase.io/docs/server_security) we described Keybase's approach to server security: (1) each user has his or her own signature chain that grows monotonically with each announcement; (2) the server maintains a global Merkle Tree that covers all signature chains; and (3) the server signs and publishes the root of the Merkle Tree with every new user signature. This configuration strongly discourages the server from lying by omission, since clients have the tools to catch the server in the act.

There was one point we glossed over. A sophisticated adversary Eve could commandeer our server and fork it, showing Alice and Bob different versions of server state. Eve could get away with her attack as long as she never tries to merge Alice and Bob's views back together, and as long as they don't communicate out-of-band. (See [Mazières and Shasha](http://cs.brown.edu/courses/cs296-2/papers/sundr.pdf) for a formal treatment of fork-consistency).

### Enter the Stellar Blockchain

Thanks to Stellar, we are unforkable.

Since 20 Jan 2020, Keybase has been regularly pushing its Merkle Root into the Stellar blockchain, signed by the [key](https://keybase.io/.well-known/stellar.toml) [GA72FQOMHYUCNEMZN7GY6OBWQTQEXYL43WPYCY2FE3T452USNQ7KSV6E](https://stellar.expert/explorer/public/account/GA72FQOMHYUCNEMZN7GY6OBWQTQEXYL43WPYCY2FE3T452USNQ7KSV6E). Now, Alice and Bob can consult the blockchain to find a recent root of the Keybase Merkle tree. Unless Eve can fork the Stellar blockchain, Alice and Bob will see the same value, and can catch Eve if she tries to fork Keybase.

Another way to think of this property is to turn it on its head. Whenever Alice uploads a signed announcement to the Keybase servers, she influences Keybase's Merkle Tree, which in turn influences the Stellar blockchain, which in turn Bob can observe. When Bob observes changes in the Stellar blockchain, he can work backwards to see Alice's change. There's little Eve can do to get in the way without being detected.

You Mean My Signatures affect a Major Cryptocurrency Blockchain?

Yes. Here's how to verify it. We're providing sample [code](https://github.com/keybase/merkle-stellar) in TypeScript. The top level framework is as follows:

```typescript
// checkUid traverses the stellar root down to the given Uid, and 
// returns the full sigchain of the user. 
async checkUid(uid: Uid): Promise<ChainLinkJSON[]> {
  const groveHash = await this.fetchLatestGroveHashFromStellar()
  const pathAndSigs = await this.fetchPathAndSigs(groveHash, uid)
  const treeRoots = await this.checkSigAgainstStellar(pathAndSigs, groveHash)
  const rootHash = treeRoots.body.root
  const chainTail = this.walkPathToLeaf(pathAndSigs, rootHash, uid)
  const chain = await this.fetchSigChain(chainTail, uid)
  return chain
}
```

The high-level steps are:

- `fetchLatestGroveHashFromStellar` - Fetch the last `groveHash` that Keybase published into Stellar from an observer of the Stellar Network. The `groveHash` is the hash of the roots of several Merkle trees (a "grove" of trees) that Keybase publishes. The one most relevant for this discussion is what we call the "main" tree, which contains updates for users and teams.

- `fetchPathAndSigs` - Fetch from Keybase the signatures over the grove that matches the hash we just got from Stellar. Also, include a path from the root of the main tree down to the user's leaf. Note the grove in question might not be the most recent, since Keybase publishes to the Stellar Blockchain only about once an hour, despite updating itself about once a second.

- `checkSigAgainstStellar` - Open the signature from the previous call, verify it against Keybase's known signing key, and check that the hash of this signature matches what we got from Stellar.

- `walkPathToLeaf` - Starting with the root returned above, walk down a path to the leaf for the user, checking hashes of interior nodes as we go.

- `fetchSigChain` - The user's leaf gives us the tail of her sigchain. Fetch the whole chain to check it matches the leaf in the tree.

We can look at each of these steps in a bit more detail:

#### fetchLatestGroveHashFromStellar

First, find the most recent Keybase insertion into the Stellar blockchain; it is always the most recent memo sent by key [GA72...SV6E](https://stellar.expert/explorer/public/account/GA72FQOMHYUCNEMZN7GY6OBWQTQEXYL43WPYCY2FE3T452USNQ7KSV6E). The code here is mainly accessing the Stellar SDK, and ensuring the data found in the Stellar blockchain matches our expectations:
 
```typescript
import {Server as StellarServer} from 'stellar-sdk'
// Note we can use any horizon server, not just those
// that SDF runs.
const horizonServerURI = 'https://horizon.stellar.org'
const keybaseStellarAddr = 
   'GA72FQOMHYUCNEMZN7GY6OBWQTQEXYL43WPYCY2FE3T452USNQ7KSV6E'
async fetchLatestGroveHashFromStellar(): Promise<Sha256Hash> {
  const horizonServer = new StellarServer(horizonServerURI)
  const txList = await horizonServer
    .transactions()
    .forAccount(keybaseStellarAddress)
    .order('desc')
    .call()
  if (txList.records.length == 0) {
    throw new Error('did not find any transactions')
  }
  const rec = txList.records[0]
  const ledger = await rec.ledger()
  if (rec.memo_type != 'hash') {
    throw new Error('needed a hash type of memo')
  }
  const buf = Buffer.from(rec.memo, 'base64')
  if (buf.length != 32) {
    throw new Error('need a 32-byte SHA2 hash')
  }
  return buf.toString('hex') as Sha256Hash
}
```

You'll get something new, but on Monday 27 Jan 2020 at 11:54 EST, the output was:

```
e22a680b245c4e6512c8212a60a5f265af465587bd70cff61e416254d6a4a062
```

The Keybase servers are constantly sending 1XLM to themselves, but with a memo that updates as the grove of Keybase Merkle trees updates.

#### fetchPathAndSigs

Now do a lookup on Keybase to find the version of the grove that matches the hash we found in Stellar (recall it might not be the most recent). To save round trips, the server includes specific information about the user we're doing the lookup for, namely a path of hashes from the tree root down to the user's leaf.

```typescript
async fetchPathAndSigs(metaHash: Sha256Hash, uid: Uid): Promise<PathAndSigsJSON> {
  const params = new URLSearchParams({uid: uid})
  params.append('start_hash256', metaHash)
  const url = keybaseAPIServerURI + 'merkle/path.json?' + params.toString()
  const response = await axios.get(url)
  const ret = response.data as PathAndSigsJSON
  if (ret.status.code != 0) {
    throw new Error(`error fetching user: ${ret.status.desc}`)
  }
  return ret
}
```

#### checkSigAgainstStellar

You can examine this JSON output from `fetchPathAndSigs` to find a lot of goodies, but for now, we care most about the signatures, computed over the Merkle grove. Keybase makes two such signatures, one for the legacy PGP key, and one for the new EdDSA key. We check that the value published to Stellar is a hash of the latter signature. The code below is a little bit redundant to show what `kb.verify` is doing:

```typescript
async checkSigAgainstStellar(
  pathAndSigs: PathAndSigsJSON,
  expectedHash: Sha256Hash
): Promise<TreeRoots> {
  // First check that the hash of the signature was reflected in the
  // stellar blockchain, as expected.
  const sig = pathAndSigs.root.sigs[keybaseRootKid].sig
  const sigDecoded = Buffer.from(sig, 'base64')
  const gotHash = sha256(sigDecoded)
  if (expectedHash != gotHash) {
    throw new Error('hash mismatch for root sig and stellar memo')
  }

  // Verify the signature is valid, and signed with the expected key
  const f = promisify(kb.verify)
  const sigPayload = await f({binary: sigDecoded, kid: keybaseRootKid})

  // The next 5 lines aren't necessary, since they are already
  // performed inside of kb.verify, but we repeat them here to
  // be explicit that the `sig` object also contains the text
  // of what the signature was over (the grove).
  const object = decode(buf) as KeybaseSig
  const treeRootsEncoded = Buffer.from(object.body.payload)
  if (sigPayload.compare(treeRootsEncoded) != 0) {
    throw new Error('buffer comparison failed')
  }

  // Parse and return the root sig payload
  return JSON.parse(treeRootsEncoded.toString('ascii')) as TreeRoots
}
```

Aha, a match! The check of `expectedHash` versus `gotHash` ensures that the hash of the signature of the root we got from Stellar matches that what Keybase returned to us. Now that the signature matches, we are safe to open it up, to get the root of merkle tree that we'll descend:


```typescript
const rootHash = treeRoots.body.root
```

#### walkPathToLeaf

Now we have the root, we can descend the Merkle tree to get the corresponding user data. The server included the path from the root to the user's leaf in the initial API call to `merkle/path`. We step down it here, ensuring the proper hash inclusion from the layer above. The first such step, recall, was in the signature, which was included in the Stellar blockchain:

```typescript
walkPathToLeaf(
  pathAndSigs: PathAndSigsJSON,
  expectedHash: Sha512Hash,
  uid: Uid
): Sha256Hash {
  let i = 1
  for (const step of pathAndSigs.path) {
    const prefix = uid.slice(0, i)
    const nodeValue = step.node.val
    const childrenTable = JSON.parse(nodeValue).tab
    const gotHash = sha512(Buffer.from(nodeValue, 'ascii'))

    if (gotHash != expectedHash) {
      throw new Error(`hash mismatch at prefix ${prefix}`)
    }

    // node.type == 2 means that it's a leaf rather than an interior
    // leaf. stop walking and exit here
    if (step.node.type == 2) {
      const leaf = childrenTable[uid]
      // The hash of the tail of the user's sigchain is found at
      // .[1][1] relative to what's stored in the merkle tree leaf.
      const tailHash = leaf[1][1] as Sha256Hash
      return tailHash
    }

    expectedHash = childrenTable[prefix]
    i++
  }
  throw new Error('walked off the end of the tree')
}
```

When run with [max](https://keybase.io/max)'s UID, at the time above, we get the SHA256 hash of the last signature that I posted, a follow of [doodlemania](https://keybase.io/doodlemania).

We can take a step further here and replay the whole signature chain, starting from hash of the chain tail. See `fetchSigChain` and `checkLink` in the sample code for the specifics there.

### Demo

Try this code on your own uid/username or anyone else in the Keybase directory:

```
$ npm i -g keybase-merkle-stellar
$ keybase-merkle-stellar-check max
```

And then see an output like:

```
✔ 1. fetch latest root from stellar: returned #27980338, closed at 2020-01-29T13:00:06Z
✔ 2. fetch keybase path from root for max: got back seqno #14406067
✔ 3. check hash equality for 070202749f229c2b6a99bac9fd8fe8a0e429dc266c2e9dff2dbc51e0fe190a09: match
✔ 4. extract UID for max: map to dbb165b7879fe7b1174df73bed0b9500 via legacy tree
✔ 5. walk path to leaf for dbb165b7879fe7b1174df73bed0b9500: tail hash is 913358757a2e1c36cb17e70b4bc51496829e97179509f854f18641d80e57637f
✔ 6. fetch sigchain from keybase for dbb165b7879fe7b1174df73bed0b9500: got back 691 links
```

