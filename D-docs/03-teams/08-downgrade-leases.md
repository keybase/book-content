
# Downgrade Leases

## Background

For teams, we have the usual problem of ordering two events in two different
sigchains, to ensure that, for instance, a key was used to sign a team update
before it was revoked (rather than after), or a team member exercised his
admin privileges before he was downgraded (and not after).  We finally have a
simple and general solution, but there's one important corner case to
consider. This document details (1) the simple and general solution; (2) the
annoying corner case; and (3) the machinery to fix the (unfortunate) corner
case.  Here goes!


## Establishing Provable "Happens Before" Relationship With Teams

We have two cases in which we need "happens before" relationship to be
provable, described above.  First, when a team member uses a device key to
change the team, he must do so after the key is provisioned, and before the
key is revoked.  Similarly, when a team member is acting as a team admin, he
must do so after he is designated an admin, and before he is removed as being
one. These relationships are simple in linearized sigchains, but they are more
complicated when "happens before" needs to be proven across chains, as happens
in both the of the examples just listed.

### A General and Simple Solution

The general problem is establishing an _a_ < _b_ < _c_ relationship, where _a_
and _c_ are on one sigchain, and _b_ is on another. For example, _a_ is when a
key was provisioned, _b_ is when it is used, and _c_ is when it is revoked (for
non-revoked keys, _c_ = ∞). In both cases, a keybase client performs the
following algorithm:

1. First establish _a_ < _b_:
	1. Look at the signature in _b_ to determine the last seen Merkle Root hash at the time that signature b was made. This is captured in the `body.merkle_root.hash_meta` field of the signature.
	1. Ask the keybase server for a merkle/path from the merkle root from step 1.1 down to the tail of the sigchain that a is in.
	1. Walk back from the tail of _a_ to _a_ following prev pointers.
1. Next establish _b_ < _c_
	1. Look at the signature in _c_ for `body.merkle_root.hash_meta`
	1. Ask the keybase server for a merkle/path from the merkle root from step 2.1 down to the tail of the sigchain that b is in
	1. Walk back from the tail of _b_ to _b_ following prev pointers

The technique used in steps (1) and (2) are basically the same, but there is
an important difference.  Let's look first at step (1), establishing that _a_ <
_b_. For the signer of _b_ to use the key provisioned in _a_, he must have consumed
the Keybase merkle tree to a point at or after _a_'s provisioning, and
therefore, the merkle root embedded as `body.merkle_root.hash_meta` must contain
a sigchain with _a_'s provisioning in it.  We should of course enforce this
invariant on the server, to prevent buggy clients from including old merkle
roots by accident.  But the clients don't really need to change if they are
working properly.

## An Annoying Corner Case

When it comes to guaranteeing that _b_ < _c_, we're not so lucky.   There could have been a race, and this interleaving might be acceptable to the server:

1. Device B downloads the latest merkle root <i>t<sub>1</sub></i> and signs _b_
1. Device C generates statement _c_ at time <i>t<sub>2</sub></i> that revokes device B
1. Device B lands its update _b_ at time <i>t<sub>3</sub></i>, with `body.merkle_root.hash_meta` at time <i>t<sub>1</sub></i>
1. Device C lands its update _c_ at time <i>t<sub>4</sub></i> with `body.merkle_root.hash_meta` at time <i>t<sub>2</sub></i>

The server will allow this sequence of events to happen since device B was
alive at the time <i>t<sub>3</sub></i>, just before it was revoked at
time <i>t<sub>4</sub></i>. The problem is
that we can't use the technique from above for clients to prove that _b_ < _c_
because the hash_meta pointers have crossed! In other words, if a client is
trying to prove that _b_ < _c_, it will follow the `hash_meta` pointer <i>t<sub>2</sub></i>,
but can't possibly find a `merkle_path` from <i>t<sub>2</sub></i> down to a sigchain for _b_ that
contains _b_ since _b_ happens after <i>t<sub>2</sub></i>.  We're stuck!

The key conceptual difference here is that _a_ caused _b_ so therefore _a_ had
to have happened enough before _b_ for the signer of _b_ to have observed _a_. But
there is no sense in which _b_ caused _c_ since revoking a device can happen at
any time. So we don't get the nice ordering guarantees.

## The Solution

Here's the solution called "downgrade leases."  There are two classes of important downgrades: (1) when a user revokes a device; and (2) when a user is removed from a group or downgraded from admin to non-admin.  In both cases, we have to check that _b_ < _c_ but are susceptible to the downgrade race just mentioned. Here's a solution:

1. Device C asks the server for a "lease" that covers some downgrade activity, like user u deprovisioning device B with device C.
1. The server replies with a lease at merkle root time <i>t<sub>1</sub></i>.
1. All actions that use device B are not valid if there is an outstanding lease for device B's revocation.  So we have to change all signature handlers to not just check if B is still active, but also to check if B isn't slated for imminent revocation.
1. When device C uploads the revocation of B, the server checks that the revocation is properly leased, and that the `body.merkle_root.hash_meta` in the signature happens at or after the <i>t<sub>1</sub></i> specified in the lease.  If so, the revocation succeeds.
1. It's possible for a client to die when holding a lease, so these leases expire after about a minute. The same solution is also employed whenever someone loses adminship privileges from a team, and the analogy holds exactly.
