## 🚀 Keybase is now writing to the Stellar blockchain 🚀

(Note, we previously were writing to the Bitcoin Blockchain, see the prior post [here](https://book.keybase.io/docs/server/merkle-root-in-bitcoin-blockchain))

Every public announcement you make on Keybase is now verifiably signed by Keybase and hashed into the Stellar blockchain. To be specific, all of these:

announcing your Keybase username
adding a public key
identity proofs (twitter, github, your website, etc.)
public bitcoin address announcements
public follower statements
revocations!
team operations

### Quick background

Earlier, in [the server security overview](/docs/server_security) we described Keybase's approach
to server security: (1) each user has his or her own signature chain that grows
monotonically with each announcement; (2) the server maintains a global Merkle Tree that
covers all signature chains; and (3) the server signs and publishes the root of the Merkle
Tree with every new user signature.  This configuration strongly discourages the server
from *lying by omission*, since clients have the tools to catch the server in the act.

There was one point we glossed over.  A sophisticated adversary Eve could
commandeer our server and *fork* it, showing Alice and Bob different versions
of server state. Eve could get away with her attack as long as she never
tries to merge Alice and Bob's views back together, and as long as they don't
communicate out-of-band. (See [Mazières and Shasha](http://cs.brown.edu/courses/cs296-2/papers/sundr.pdf)
for a formal treatment of fork-consistency).

### Enter the Stellar Blockchain

Thanks to Bitcoin, we are now unforkable.

Since 20 Jan 2020, Keybase has been regularly pushing its Merkle Root into the 
Stellar blockchain, signed by the key 
[GA72FQOMHYUCNEMZN7GY6OBWQTQEXYL43WPYCY2FE3T452USNQ7KSV6E](https://stellar.expert/explorer/public/account/GA72FQOMHYUCNEMZN7GY6OBWQTQEXYL43WPYCY2FE3T452USNQ7KSV6E). Now, Alice and Bob
can consult the blockchain to find a recent root of the Keybase Merkle tree.
Unless Eve can fork the Stellar blockchain, Alice and Bob will see the same
value, and can catch Eve if she tries to fork Keybase.

Another way to think of this property is to turn it on its head.  Whenever Alice uploads
a signed announcement to the Keybase servers, she influences Keybase's Merkle Tree, which in turn influences
the Stellar blockchain, which in turn Bob can observe.  When Bob observes changes in the Stellar
blockchain, he can work backwards to see Alice's change.  There's little Eve can do to
get in the way without being detected.

### You Mean My Signatures affect the Stellar Blockchain?

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

- `fetchLatestGroveHashFromStellar` - Fetch the last groveHash that Keybase published into Stellar from an observer of the Stellar Network. The groveHash is the hash of the roots of several Merkle trees (a "grove" of trees) that Keybase publishes. The one most relevant for this discussion is what we call the "main" tree, which contains updates for users and teams.

- `fetchPathAndSigs` - Fetch from Keybase the signatures over the grove that matches the hash we just got from Stellar. Also, include a path from the root of the main tree down to the user's leaf. Note the grove in question might not be the most recent, since Keybase publishes to the Stellar Blockchain only about once an hour, despite updating itself about once a second.

- `checkSigAgainstStellar` - Open the signature from the previous call, verify it against Keybase's known signing key, and check that the hash of this signature matches what we got from Stellar.

- `walkPathToLeaf` - Starting with the root returned above, walk down a path to the leaf for the user, checking hashes of interior nodes as we go.

- `fetchSigChain` - The user's leaf gives us the tail of her sigchain. Fetch the whole chain to check it matches the leaf in the tree.

We can look at each of these steps in a bit more detail:

### fetchLatestGroveHashFromStellar

First, find the most recent Keybase insertion into the Stellar blockchain; it 
is always the most recent memo sent by key [GA72...SV6E](https://stellar.expert/explorer/public/account/GA72FQOMHYUCNEMZN7GY6OBWQTQEXYL43WPYCY2FE3T452USNQ7KSV6E). The code here is mainly
accessing the Stellar SDK, and ensuring the data found in the Stellar blockchain
matches our expectations:

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

```text
e22a680b245c4e6512c8212a60a5f265af465587bd70cff61e416254d6a4a062
```

### fetchPathAndSigs

Now do a lookup on Keybase to find the version of the grove that matches the
hash we found in Stellar (recall it might not be the most recent). To save round
trips, the server includes specific information about the user we're doing the
lookup for, namely a path of hashes from the tree root down to the user's leaf.

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

### checkSigAgainstStellar

You can examine this JSON output from `fetchPathAndSigs` to find a lot of goodies,
but for now, we care most about the signatures, computed over the Merkle grove.
Keybase makes two such signatures, one for the legacy PGP key, and one for the
new EdDSA key. We check that the value published to Stellar is a hash of the
latter signature. The code below is a little bit redunant to show what `kb.verify` is doing:

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

Aha, a match! The check of `expectedHash` versus `gotHash` ensures that the hash of
the signature of the root we got from Stellar matches that what Keybase returned
to us. Now that the signature matches, we are safe to open it up, to get the
root of merkle tree that we'll descend:

```typescript
const rootHash = treeRoots.body.root
```

### walkPathToLeaf 

Now we have the root, we can descend the Merkle tree to get the corresponding
user data. The server included the path from the root to the user's leaf in the
initial API call to `merkle/path`. We step down it here, ensuring the proper hash
inclusion from the layer above. The first such step, recall, was in the
signature, which was included in the Stellar blockchain:

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

When run with [max](https://keybase.io/max)'s UID, at the time above, we get the
SHA256 hash of the last signature that I posted, a follow of [doodlemania](https://keybase.io/doodlemania).

We can take a step further here and replay the whole signature chain, starting
from hash of the chain tail. See `fetchSigChain` and `checkLink` in the sample code for the specifics there.

### Demo

Try this code on your own uid/username or anyone else in the Keybase directory:

```bash
$ npm i -g keybase-merkle-stellar
$ keybase-merkle-stellar-check max
```

And then see an output like:

```bash
✔ 1. fetch latest root from stellar: returned #27980338, closed at 2020-01-29T13:00:06Z
✔ 2. fetch keybase path from root for max: got back seqno #14406067
✔ 3. check hash equality for 070202749f229c2b6a99bac9fd8fe8a0e429dc266c2e9dff2dbc51e0fe190a09: match
✔ 4. extract UID for max: map to dbb165b7879fe7b1174df73bed0b9500 via legacy tree
✔ 5. walk path to leaf for dbb165b7879fe7b1174df73bed0b9500: tail hash is 913358757a2e1c36cb17e70b4bc51496829e97179509f854f18641d80e57637f
✔ 6. fetch sigchain from keybase for dbb165b7879fe7b1174df73bed0b9500: got back 691 links
```
