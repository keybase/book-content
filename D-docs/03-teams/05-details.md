# Teams: Naming, Merkle Tree Integration, And Signature Chains

## Naming and IDs and the Merkle Tree

Each team gets a 16-byte unique identifier, which is immutable over the lifetime of the team.
For root teams, the first 15 bytes of the identifier are the first 15 bytes of the SHA256
hash of the team, followed by the byte `0x24`. This means that root teams can never be renamed.

For instance, the take the team `Keybase`. The following JavaScript in Node:

```javascript
const crypto = require('crypto');
var team = "Keybase";
var lowered = team.toLowerCase()
var hashed = crypto.createHash('SHA256').update(lowered).digest();
var clamped = hashed.slice(0,15)
var suffixed = Buffer.concat([clamped, Buffer.from([0x24])])
var hexed = suffixed.toString('hex')
console.log(hexed);
```

Outputs the string `05327b776e5fbf5ee3d7a5905bff26`.  And indeed the team ID for the root `Keybase` team is
`05327b776e5fbf5ee3d7a5905bff2624`, which is [publically visible](https://keybase.io/_/api/1.0/merkle/path.json?leaf_id=05327b776e5fbf5ee3d7a5905bff2624) in the Main merkle tree.

When clients create new Keybase subteams, they generate a random 15 byte value, and then attach a `0x25`
suffix to make an ID.

Both subteams and root teams have sigchains that are inserted into the main Merkle Tree, indexed by their
IDs. In the case of root teams, any external observer can see the existence of the team in the tree, and
can further observe if the team is updated. They are not, however, allowed to see the actual links in the
team's sigchain unless they have access to the team. For subteams, any observer can see the existence
of the subteam's ID in the Keybase Merkle tree, and also when it updates, but they will not know the
name of the subteam of the parent of the subteam just based on the ID.

Though this construction is simple, it has a notable shortcoming.  Outside
observers might be able to guess the team's parent based on corrleated changes
to leaves in the tree. Though members of the `adidas` teams can't know the
names of teams like `nike.hr`, `nike.hr.interns`, or `nike.acquisitions.puma`,
they can infer the **shape** of `nike`'s subteam tree, and when those subteams
are updated. We think this slight data leak is worth it, since it allows all
users to audit the integrity of Keybase's operations.

Teams live in the Merkle tree alongside of regular users, but they can't collide since user IDs end
in suffixes `0x00` or `0x19`.  It is theoretically possible to allow a user named `acme` and a team
named `acme`, since they will map to IDs `822b33ad87c148a0a20a5ba7cd5ebc19` and `822b33ad87c148a0a20a5ba7cd5ebc24`
respectively. But we currently disallow such a construction for the sake of clarify and simplicity.
At some point in the future, these constraints might be relaxed.

## Team Sigchains

Like Keybase users, Keybase teams have their own "signature chains" or "sigchains".  A sigchain is an append-only
data structure that is appended to whenever a mutation is needed. Users mutate their identities whenever they
add external proofs, add or revoke devices, follow or unfollow friends. Teams mutate their composition whenever
they add, remove, upgrade or downgrade members, whenver they add or rename subteams, whenever their cryptographic
keys rotate, etc.  The geneal shape of the sigchain links are as in [user sigchains](../sigchain), but the
new `team` section of the JSON signature body captures team-specific features. Also, all team signature
links are in the [V2 format](sigchain_v2).

### team.root

`team.root` signatures are the initial signature of a new root team. All root team sigchains must begin
with such a signature. Here is an example snippet from a `team.root` chain link:

```javascript
"team": {
	"id": "9b46c6085b3e5e48ec3829bcf46d7c24",
	"members": {
		"admin": [],
		"owner": [
			"93b82086be2f8e206cd6bbef8483b219"
		],
		"reader": [],
		"writer": []
	},
	"name": "6339c082",
	"per_team_key": {
		"encryption_kid": "0121385b48c13958e8eb474a97a80fd508560f26cdc2c184054d3837b22fb23be5470a",
		"generation": 1,
		"reverse_sig": "hKRib...",
		"signing_kid": "012091eaf617c0b0469b10465bc166744233d0540df8ef76d6078586fdffa8f9c3390a"
	}
},
"type": "team.root",
"version": 2
```

The team section specifies the team's name, the team's ID (determined as above), the initial members of the team, and the initial
public keys for the team. As with [Per-User Keys](puk), a reverse signature is computed with the per-team signiging key
over the entire chain link. See below for a more complete description of team key cryptographic specifics.

Team role lists are specified with regular Keybase UIDs. If a user has reset his/her account, the UID is the form
`<uid>%<seqno>`, where `<seqno>` is the earliest sigchain seqno for the user since the user's reset.

Teams must always have at least one owner (the current user), but the owner of
the team can specify additional admins, readers, writers and owners when
creating or team.

### team.subteam_head

`team.subteam_head` is similar to `team.root`, but represents the first link a subteam's sigchain.
An example snippet from such a chain looks like this:

```javascript
 "team": {
	"admin": {
		"seq_type": 3,
		"seqno": 1,
		"team_id": "7b392b1aaec8b189cfd14fa1a46c8225"
	},
	"id": "b55f84038205c958ee9ec9e87d9e5325",
	"members": {},
	"name": "nike.hr.interns.2019",
	"parent": {
		"id": "2698d3406bed19fa8f4b1463f66f3f25",
		"seq_type": 3,
		"seqno": 2
	},
	"per_team_key": {
		"encryption_kid": "0121b21a1b538cd562818f10f2d85c1c79fa29e6bbfbdd39d36efe180e857f2beb700a",
		"generation": 1,
		"reverse_sig": "g6Rib2...",
		"signing_kid": "012049819898a9b5c2d179626ba78544b065fecd38052567a32e4ddfc73f9825c3d10a"
	}
},
"type": "team.subteam_head",
```

Like `team.root` chainlinks, `team.subteam_head` chainlinks contain subteam names, subteam IDs,
initial membership lists, and cryptographic keys. They have additional subobjects:

* `parent` is a pointer to sigchain link in the parent team that authorized this subteam's creation;
* `admin` is a pointer to some ancestor team sigchain that shows where the power comes from
to perform this operation. Due to the recursive nature of implicit adminship, an admin from
`nike`, `nike.hr`, or `nike.hr.interns` can create the subteam `nike.hr.interns.2019`. The
`admin` section of the signature tells readers of this sigchain where exactly to find
the authorization of this signing user to have performed this operation.

### team.new_subteam

When a new subteam is created, two links are written. The creator writes `team.subteam_head`
link to the head of the new subteam, and a `team.new_subteam` link to the parent team. As filesystems,
the parent controls the namespace that all children are written to. So writing to the parent
enforces serializability and consistency of the namespace for child teams.  Here's an example
snippet:

```javascript
 "team": {
	"admin": {
		"seq_type": 3,
		"seqno": 1,
		"team_id": "60ca2fa24b1097a3f08c1d00fe429724"
	},
	"id": "2698d3406bed19fa8f4b1463f66f3f25",
	"subteam": {
		"id": "b55f84038205c958ee9ec9e87d9e5325",
		"name": "nike.hr.interns.2019"
	}
},
"type": "team.new_subteam",
```

Both the server and clients should check that every `team.new_subteam` link has a corresponding
`team.subteam_head` the new subteam, and that the sequence numbers and hashes line up
properly. Here `team.id` is the ID of the parent team, and `team.subteam.id` is the ID of
the new child team.

### team.change_membership

`team.change_membership` links allow admins to change the membership of a team or subteam. Here
is an example snippet:

```javascript
"team": {
	"admin": {
		"seq_type": 3,
		"seqno": 1,
		"team_id": "1439170a29f084cf447426cb851bd924"
	},
	"id": "1439170a29f084cf447426cb851bd924",
	"members": {
		"none": [
			"6bbc642b05c079918f12bb2921713319"
		],
		"writer": [
			"93b82086be2f8e206cd6bbef8483b219"
		],
		"reader" : [
			"00aa4b027e3e132f918d3205d6e96819"
		]
	},
	"per_team_key": {
		"encryption_kid": "01218ba2aa312e74a292ce6e8136fa8343bd5146acbb5b60e30ad3d29e2ae67bd53c0a",
        "generation": 2,
        "reverse_sig": "g6Rib...","
        "signing_kid": "0120026dc6e1b7d514474c192d7cf0cd6c6e65312d77227117f0779fb7b5aa23207f0a"
    }
},
"type": "team.change_membership",
```

As with `team.subteam_head` links, these links must explicitly specify where
an admin's permissions come from. And like a `team.root` or
`team.subteam_head` link, a `team.change_memberhip` link has a `members`
subobject to describe changes.  By including a user ID in the `none` list, the
admin removes the user from the group. The admin can upgrade or downgrade an
existing user by specifing their UID in a different role list (since a user
can only take one role in a team at a time). In the above example, if the user
`93b82086be2f8e206cd6bbef8483b219` was previously an admin of this group,
specifying her as a `writer` will be considered a downgrade in roles. An admin
can add a new user here by just including the user's UID in the appropriate
list. So for instance, if user `00aa4b027e3e132f918d3205d6e96819` was not a part
of this team before, they are a now a reader in the team after this update.

Note that when users are removed from a team, the admin performing the change
should also rotate the team's keys. She can do so by specifying
a `per_team_key` section and uploading encrypted keys for the remaining
members.

### team.rotate_key

`team.rotate_key` specifies that a team's cryptographic shared keys are rotated, but without
any corresponding changes in membership. It might be needed, for instance, when
a member of the team resets one of his devices (see [CLKRs](clkr)). Here is an example snippet:

```javascript
"team": {
	"id": "fa6d7ff1d4bab8c204753202134ad724",
	"per_team_key": {
		"encryption_kid": "01218ba2aa312e74a292ce6e8136fa8343bd5146acbb5b60e30ad3d29e2ae67bd53c0a",
        "generation": 2,
        "reverse_sig": "g6Rib...","
        "signing_kid": "0120026dc6e1b7d514474c192d7cf0cd6c6e65312d77227117f0779fb7b5aa23207f0a"
    }
},
"type": "team.rotate_key",
```

The `per_team_key` subobject is just as in team (or subteam) creation, but the key difference
here is that `generation` is set to a number greater than `1`, since the key is being
rotated.

### team.leave

When an non-admin wants to leave a team, they sign a "leave" statement to this effect:

```javascript
"team": {
	"id": "54339639186bc64e9030affed0d39a24"
},
"type": "team.leave",
```

Team readers and writers can make `team.leave` statements. Admins are not allowed to; they need
to downgrade themselves to readers or writers first.

### team.rename_subteam

Unlike root teams, subteams can be renamed, but only if their position in the team tree doesn't
change. For instance, `nike.hr` can be renamed to `nike.human_resources` but not to `nike.subdivisions.hr`.
The rename will have a cascading effect. In the above example, `nike.hr.interns` would be renamed to
`nike.human_resources.interns`. Here's an example of such a link, which lives in the *parent team*
of the team being renamed.  So for instance, the above renaming would happen in `nike`'s team chain,
so that the parent can serialize all changes to its namespace without fear of conflicting updates.

Here's an example:

```javascript
"team" : {
	"admin": {
		"seq_type": 3,
		"seqno": 1,
		"team_id": "fb0ef07743d99b130f5c69cbb8991624"
	},
	"id": "fb0ef07743d99b130f5c69cbb8991624",
	"subteam": {
		"id": "18c1463be9524a2d555e9c1501a82125",
		"name": "adidas.omg"
	}
 },
 "type" : "team.rename_subteam"

```

Here, `team.subteam.name` specifies the new name for the team.

### team.reaname_up_pointer

As with `team.new_subteam` head and `team.subteam_head`, whenever a team's subteam
namespace is changed, we make updates to both chains, the parent and the child. Thus,
the above `tean.rename_subteam` update in `adidas` has a companion `rename_up_pointer`
link in `adidas.omg`'s chain. Example shown here:

```javascript
{
	"admin": {
		"seq_type": 3,
		"seqno": 1,
		"team_id": "fb0ef07743d99b130f5c69cbb8991624"
	},
	"id": "18c1463be9524a2d555e9c1501a82125",
	"name": "adidas.omg",
	"parent": {
		"id": "fb0ef07743d99b130f5c69cbb8991624",
		"seqno": 3,
		"seq_type": 3
	}
},
"type" : "team.rename_up_pointer"
```
### team.invite

Admins can invite members into teams without their being Keybase users. The invites
can be refered to by social media handles or by email addresses. In the former case,
when users sign up, admins can check that the social media proofs were satisfactory
before keying the team for the user.  In the case of `email`-based invitations,
the admin has to take Keybase's word for the legitimacy of this proof. Admins who
don't have open email invitations will never rekey via this server-trusted TOFU
system, so it's strictly opt-in.

Here's an example snippet:


```javascript
"team" : {
	"id": "57a7fffc8799ddafe1859c96cc67d924",
	"invites": {
		"admin": [
			{
				"id": "243af3d8b33d170fec892218ed167a27",
				"name": "u_be6ef086a4a5",
				"type": "twitter"
			}
		],
		"cancel": [ "117b4f1d1048042cb67e204c84d07927" ],
		"reader": [
			{
				"id": "752d07d2c3b316105dcea2d983fffe27",
				"name": "u_be6ef086a4a5",
				"type": "reddit"
			}
		],
		"writer": [
			{
				"id": "54eafff3400b5bcd8b40bff3d225ab27",
				"name": "max+be6ef086a4a5@keyba.se",
				"type": "email"
			},
			{
				"id": "868882ad389a3023e810c376034b9d27",
				"name": "l52701844",
				"type": "keybase"
			}
		]
	}
},
"type" : "team.invite"
```

There are few more details to point out.  First off, we can cancel previously issued
invitations, as seen in: `"cancel": [ "117b4f1d1048042cb67e204c84d07927" ]`.  Second,
there is this funny notion of a "keybase" invitation. What's happening here is that
the user `l52701844` is a Keybase user but doesn't a [Per-User Key](puk).  They must
fix this situation first, and once their PUK is established, a team admin can swing by
and rekey the team for the user.  It shares so much machinery with off-site invitations
that we've implented it as a funny sort of invitation.

Admins or owners must issue invitations. Any admin can close the loop by keying the
team for the user once the user has signed up and has established a PUK. See [CLKR](clkr)
for more information on how the Keybase server orchestrates this background keying operation.

### team.delete_root

An owner can delete a root team. This operation is not reversable, and it kills the
team for all time:

```javascript
"team": {
	"id": "254066fbfdcf55d43e9f7be763793a24"
},
"type": "team.delete_root"
```

### team.delete_subteam

A subteam admin (implicit or explicit) can delete a subteam, freeing up its name in the
namespace for a potential recreation later in time. For instance, in the `adidas` parent
chain below:

```javascript
"team": {
	"admin": {
		"seq_type": 3,
		"seqno": 1,
		"team_id": "2463dcf9117ddba832bb622199fedd24"
	},
	"id": "2463dcf9117ddba832bb622199fedd24",
	"subteam": {
		"id": "617627599eba38e2aed1b9a1df8eea25",
		"name": "adidas.hr"
	}
},
"type": "team.delete_subteam",
```

### team.delete_up_pointer

A `team.delete_up_pointer` accompanies the `team.delete_subteam` above. For example:

```javascript
"team": {
	"admin": {
		"seq_type": 3,
		"seqno": 1,
		"team_id": "2463dcf9117ddba832bb622199fedd24"
	},
	"id": "617627599eba38e2aed1b9a1df8eea25",
	"name": "t_cdd8bb5c.hr",
	"parent": {
		"id": "2463dcf9117ddba832bb622199fedd24",
		"seq_type": 3,
		"seqno": 3
	}
},
"type": "team.delete_up_pointer",
```

## POST Endpoint and Parameters

When mutating a team, users post signatures of the above form to the
`/_/api/1.0/sig/multi.json` endpoint. Multiple signatures can be, and
are often required to be posted in one HTTP post. For instance,
rename, and subteam deletion operations need to mutate multiple
team sigchains at the same time, and do so on the server inside of
a single database transactions.

Some relevant fields involved in these posts are:

* `per_team_key` — The encryption of a new per team key for the team member's PUKs,
 using NaCl's DH primitive
* `downgrade_lease_id` — As preestablished lease needed to safely remove authority, which ensures
that no racing operations are trying to use that authority at the same time. See
[Downgrade Leases](downgrade_leases).
* `implicit_team_keys` — Like `per_team_key`, but DH boxes for *subteams* of the teams
being operated. Needed when a user is promoted to admin of team `T`, and therefore needs
access to all transitive subteams of `T`.

## GET Endpoint

Team users can load team sigchains via the `/_/api/1.0/team/get.json`
endpoint, which takes a variety of parameters. The server will return the
links in the team's sigchain, and the accompanying encryptions of per-team
keys for the team. Note that if a non-admin is loading a team, some links
might appear "stubbed", meaning their outer contents will be returned, but
their inner contents will be elided. This feature allows, for example. the
admin of `nike` to hide the existence of the subteam `nike.merger_with_puma`
from the members of `nike.interns`, etc, by hiding the contents of the
`team.rename_subteam` link. However, readers of the team can still reconstruct
the full sigchain without fear of server tampering, since the outer links
contain sequence numbers, previous hashes, and link types.
