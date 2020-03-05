# Fast Team Loader (FTL)

Big teams can be slow to load, mainly in terms of bandwidth, but also in terms of
client-side processing. For instance, take the team [Keybasefriends](https://keybase.io/team/keybasefriends).
A full [team chain load](/docs/teams/loader) on this team, involves 3M of signature data,
and the full signature chains for the admins. For example,
[chris](https://keybase.io/chris)'s sigchain is over [2.5M](https://keybase.io/_/api/1.0/sig/get.json?uid=23260c2ce19420f97b58d7d95b68ca00) compressed. So the experience
of loading into chat on a fresh mobile install can be painful. (On a warm cache, much of
the above can elided).

Luckily, there is a major shortcut that we can take here. To render the chat
window, or the chat "snippet" in the UI, the Keybase crypto engine only needs
to know the encryption keys for the chat, and any creations or changes to
subteam names. Much of the other information advertised in the team signature
chain is irrelevant. In Fast Teaming Loading ([FTL](https://github.com/keybase/client/blob/cfffb80ff83dad98ca5d2366cc73d14e6abfcb86/go/teams/ftl.go)),
clients [request](https://github.com/keybase/client/blob/cfffb80ff83dad98ca5d2366cc73d14e6abfcb86/go/teams/ftl.go#L631) from the
server only those team sigchain links that advertise changes in the team's
key, or changes to subteams. They check that a [proper chain](https://github.com/keybase/client/blob/cfffb80ff83dad98ca5d2366cc73d14e6abfcb86/go/teams/ftl.go#L764)
is formed, that the tail of the chain is [advertised correctly](https://github.com/keybase/client/blob/cfffb80ff83dad98ca5d2366cc73d14e6abfcb86/go/teams/ftl.go#L669)
 in the global Merkle Tree, and
that this abbreviated view of the chain is consistent with full loads of the
team (via the [audit](https://github.com/keybase/client/blob/cfffb80ff83dad98ca5d2366cc73d14e6abfcb86/go/teams/ftl.go#L827) mechanism described below). Full loads of the team still happen as usual when the a user lists or
edits team memberships, or when his/her client rotates team keys. Once a
client downloads the abbreviated team chain, it downloads the encrypted secret
halves of those keys, [decrypts](https://github.com/keybase/client/blob/cfffb80ff83dad98ca5d2366cc73d14e6abfcb86/go/teams/ftl.go#L679) the secret keys,
and [checks](https://github.com/keybase/client/blob/cfffb80ff83dad98ca5d2366cc73d14e6abfcb86/go/teams/ftl.go#L252) the secret keys
match the public keys in the download step. It also [checks](https://github.com/keybase/client/blob/cfffb80ff83dad98ca5d2366cc73d14e6abfcb86/go/teams/ftl.go#L142) any creation or
changes to subteam names, and ensures that the final result matches what the
chat servers claim.

What's missing in the above process is any checking of signatures made by
team admins. Thus, when assisting a client in a fast team load (FTL), the
server can make a wholesale substitution of a team's sigchain. It can
advertise a totally new team, signed by different admins, or bogus versions
of the correct admins, since it knows that clients won't bother to check
these signatures. But the server can't perform this swap willy-nilly; it
must commit to it for all time, or fork the Merkle Tree and maintain
the fork for all time.

Clients can catch the server in the act if they ever do a slow load of the
same team in the future, or if teammates discover out-of-band that they are
missing updates, or if users check their current client's view of the Merkle
tree against what appears in the Bitcoin blockchain.

## The "Odd-Even" Attack and Team Audits

Thinking about speeding up first entry into a team chat via FTL did bring up
the possibility of an attack that was always possible in loading teams, even
the slow way. Imagine two users, Alice and Bob, who want to view the team
*acme*. The server is trying to give them diverging versions A and B of the
team without commiting to a global fork. It might publish the following
sigchain tail to the Merkle tree:

* GlobalMerkleSequenceNumber=1000: acme=[TeamSequenceNumber=10, TeamSigchainTailHash=aa001122]
* GlobalMerkleSequenceNumber=1001: acme=[TeamSequenceNumber=10, TeamSigchainTailHash=bb445566]
* GlobalMerkleSequenceNumber=1002: acme=[TeamSequenceNumber=10, TeamSigchainTailHash=aa001122]
* GlobalMerkleSequenceNumber=1003: acme=[TeamSequenceNumber=10, TeamSigchainTailHash=bb445566]

That is, on even global Merkle sequence numbers, for Alice's benefit, it would
publish version A of *acme*, and on odd sequence numbers, for Bob's benefit,
it would publish version B. It would then be certain to only show Alice even
Merkle roots, and Bob odd ones. Of course, many variations of this attack exist.
The gist is that Alice and Bob see different versions of the same team, without
a global fork of the tree, by "equivocation" at this one leaf.

We note off the bat that a global auditor could detect this attack. Though the auditor
could not see *acme*'s chain, it could tell something was amiss that the sequence
number of *acme* didn't budge, but the chain tail hash did. However, we
would like to give Alice and Bob a way to detect such an attack online, without
having to consult an external auditor.

In versions 2.7.0 and above, Keybase runs a ["team audit"](https://github.com/keybase/client/blob/cfffb80ff83dad98ca5d2366cc73d14e6abfcb86/go/teams/audit.go) whenever it loads
a team, either via the fast path or the slow path. Recall
that the first step of loading a team is to request the team's chain team
from the server, which will yield a triple:

* (GlobalMerkleSequenceNumber, TeamSequenceNumber, TeamSigchainTailHash)

Then the client requests the rest of the team's chain, whether the
full chain in the case of a slow load, or an abbreviated chain in the
case of a fast load.

In a final "audit" pass, the client [picks](https://github.com/keybase/client/
blob/cfffb80ff83dad98ca5d2366cc73d14e6abfcb86/go/teams/audit.go#L349) a random
set of historical Merkle roots and requests a path from the root down the
given team at that sequence number. It then:

* [ensures](https://github.com/keyba
se/client/blob/cfffb80ff83dad98ca5d2366cc73d14e6abfcb86/go/teams/audit.go#L396
) that the most recent global Merkle root points back to this historical roots
(via hash-chain pointers);
* verifies that the TeamSequenceNumbers are [monotonically increasing](https://github.com/keybase/client/blob/cfffb80ff83dad98ca5d2366cc73d1
4e6abfcb86/go/teams/audit.go#L291-L293);
* and checks that the TeamSigchainTailHashes [
match](https://github.com/keybase/client/blob/cfffb80ff83dad98ca5d2366cc73d14e
6abfcb86/go/teams/audit.go#L284) those downloaded from the server when the
fast or slow load happened.

Because the client controls the random number sequence that will be queried,
and Alice and Bob both do this audit, it would be extremely unlikely that the
evil server could guess ahead of time how to configure the two views of the
chain. As Alice and Bob probe more snapshots, it becomes exponentially harder
for the server to win the game.

Each probe is about 25k big, since it includes all of the intermediate hashes
between the root and the tail, and the pointer from the current Merkle root
back to the historical one. On mobile devices, we tune the number of probes
way [down](https://github.com/keybase/client/blob/cfffb80ff83dad98ca5d2366cc73d14e6abfcb86/go/teams/audit.go#L29)
to save precious bandwidth. On desktop, we tune the
parameters [up](https://github.com/keybase/client/blob/cfffb80ff83dad98ca5d2366cc73d14e6abfcb86/go/teams/audit.go#L20), assuming bandwidth is more plentiful. Audits
[continue](https://github.com/keybase/client/blob/cfffb80ff83dad98ca5d2366cc73d14e6abfcb86/go/teams/audit.go#L164)
on an ongoing basis, to ensure that previous updates
to the team chain remain unequivocal.





