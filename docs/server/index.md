
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


