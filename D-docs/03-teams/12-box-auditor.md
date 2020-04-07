# Team Box Auditor

### Background
Auditable and cryptographically provable team membership, provided by
team sigchains, is an [important security
requirement](/blog/chat-apps-softer-than-tofu#what-about-big-group-chats-) that
guards against the server being able to inject &ldquo;[ghost
users](https://blog.cryptographyengineering.com/2018/12/17/on-ghost-users-and-messaging-backdoors/)&rdquo;
into Keybase teams.

Whenever a team admin adds or removes users, this statement is signed into the
sigchain and all the teams&rsquo; members can see it and their clients make sure the
statement is signed by a team admin. Additionally, when a team member is
removed, the admin rotates the team&rsquo;s secret key so the removed team member
doesn&rsquo;t have access to the secret keys used to decrypt and sign new messages
and files.

However, there are cases where we want to rotate the team&rsquo;s keys due to an
action, but the user doing that action is unable to rotate the team themselves.

- A team member leaves the team
- An implicit admin leaves the only parent team they&rsquo;re a member of
- A team member (or implicit admin) revokes a device (which rotates the user&rsquo;s [per-user key](/docs/teams/puk))
- A team member (or implicit admin) resets their account
- A team member (or implicit admin) deletes their account

For example, if a reader decides to leave a team, an admin has to come back
later and rotate the team&rsquo;s keys after the fact. Similarly, a user who is
resetting their account will likely not have the keys needed to rotate the team
before they reset, so the team needs to be rotated by an admin later.

In these cases, the [CLKR](/docs/teams/clkr) mechanism has the server signal
the team&rsquo;s admins that someone left or has new keys, and so the admin can
rotate the team&rsquo;s keys properly, and encrypt them for the right users and
their current keys.

### Problem

However, CLKR is entirely driven by the server. While it is cryptographically
impossible for the server to trick clients into adding arbitrary members, the
server can, for example, omit to tell the team admins about a team member&rsquo;s
device revocation.

Imagine a Keybase user whose laptop was stolen by an attacker. Even if the user
revokes their that laptop&rsquo;s keys from another device, all the teams the user is
in still have their per-team keys encrypted for the old per-user key. If a
malicious server fails to issue CLKRs, and also cooperates with the attacker to
provide encrypted team data, the attacker could read new team messages and
files.

### Solution
Thus, we introduce the client **Box Auditor**, which audits [the team
boxes](/docs/teams/crypto) of every team a user is in. Note that 1-on-1 and
group chats are also driven by the teams mechanism behind the scenes, so these
chats are audited as well.

The box auditor is a background process that randomly selects teams the user is
in, loads the sigchains of all of its members, and verifies that the team&rsquo;s
boxes are currently keyed for the right user keys. If not, the auditor rotates
the team&rsquo;s keys. By the security of the [Keybase Merkle
tree](/docs/server_security), the server cannot lie, rollback, or equivocate
about a user&rsquo;s per-user key (or a team&rsquo;s membership), since it&rsquo;s signed into
their sigchain.

Note that the box auditor is designed in such a way that it is impossible for
it to be &ldquo;tricked&rdquo; by a malicious server attempting to stop these
audits. Any possible error coming back from the server during the audit,
including network errors and authentication errors, are untrusted by the
client, which schedules another audit to happen again in the near future. If a
single team fails to audit successfully enough times, the team is jailed and
the user is notified whenever that team is accessed until it passes an audit.
This way, a malicious server cannot stop audits by pretending that the
client&rsquo;s requests were not well-formed, or pretending to be down.

### Try it out
You don&rsquo;t need to do anything in particular for the auditor to protect your
teams: the background process does everything automatically.

But if you wanted to manually run an audit, Keybase client 4.0.0 ships with a
command line interface to the box auditor.

To audit the `keybase` team,

```bash
keybase audit box --audit --team keybase
```

To audit all known teams in the local cache, including 1-on-1 chats and group
chats,

```bash
keybase audit box --audit-all-known-teams
```

Note that if you are in a subteam but not in a parent team of that subteam,
this command will list an audit of that parent team as failing. This is
intentional; see the next section for details.

### Implementation details
The critical functionality we need is to get the per-user keys of all of a
team&rsquo;s members at a given Merkle root (call this a *box summary*).

The function
[`calculateSummaryAtMerkleSeqno`](https://github.com/keybase/client/blob/18347ca641ead8332c87afcfffcf5ddf0776e40c/go/teams/box_audit.go#L853)
works like this:
1. Load the team&rsquo;s sigchain
2. Construct a map of Merkle checkpoints.
   If we&rsquo;re getting a historical summary, for each active member, the
   checkpoint is the Merkle root when they were last given a box: at the last
   team rotation, or when they were added to the team (if a rotation has not
   happened since then).
   If we&rsquo;re getting a current summary, for each active member, the
   checkpoint is the latest Merkle root available.
3. Traverse the global Merkle tree at the Merkle checkpoints to find the last
   link of the user&rsquo;s sigchain at the time the team&rsquo;s per-team-key
   was keyed for them
4. For each user, infer the per-user key generation from the user&rsquo;s
   sigchain and the information above.
5. Construct a box summary, which is a map from a user ID and an eldest seqno
   (i.e., 1 or the sigchain link number of the last time they reset their
   account) to their per-user key generation.

Once we have this primitive, we can get the summary at the Merkle root of the
last rotation and compare it with the summary at the current Merkle root. If
these differ, [rotate and try again later](https://github.com/keybase/client/blob/18347ca641ead8332c87afcfffcf5ddf0776e40c/go/teams/box_audit.go#L267). Do the same if there was any other
error from the server.

If the team failed to audit more than 6 times, the [team goes into the box audit jail](https://github.com/keybase/client/blob/18347ca641ead8332c87afcfffcf5ddf0776e40c/go/teams/box_audit.go#L228-L229).

When jailed, any attempt to load the team via the [regular team
loader](https://github.com/keybase/client/blob/18347ca641ead8332c87afcfffcf5ddf0776e40c/go/teams/loader.go#L316)
or the [fast team
loader](https://github.com/keybase/client/blob/18347ca641ead8332c87afcfffcf5ddf0776e40c/go/teams/ftl.go#L113)
results in a re-audit. If that re-audit fails, the client repeatedly warns the
user that the audit has failed. Once we are sure that the auditor is working as
intended, we may update the client to start refusing to load the team entirely
instead.

[Auditing](https://github.com/keybase/client/blob/18347ca641ead8332c87afcfffcf5ddf0776e40c/go/engine/box_audit_scheduler_background.go#L74) and [retrying](https://github.com/keybase/client/blob/18347ca641ead8332c87afcfffcf5ddf0776e40c/go/engine/box_audit_retry_background.go#L74) are handled as automated background tasks while the Keybase
service is running.

Note that the box auditor is currently under by a [server-controlled feature
flag](https://github.com/keybase/client/blob/18347ca641ead8332c87afcfffcf5ddf0776e40c/go/teams/box_audit.go#L19)
while it is in testing and we make sure everything works properly. In the next
release, this flag will be removed so the server is unable to turn off the
auditor unilaterally.

There are some details that the client has to be careful about.
- Implicit admins, who are not in the team but admins of parent teams, are also
  keyed for the team&rsquo;s per-team key, so the auditor needs to [check their
  per-user keys](https://github.com/keybase/client/blob/18347ca641ead8332c87afcfffcf5ddf0776e40c/go/teams/box_audit.go#L863) as well.
- Open teams are not sent CLKRs since the admins auto-accept any request,
  so [these are not audited](https://github.com/keybase/client/blob/18347ca641ead8332c87afcfffcf5ddf0776e40c/go/teams/box_audit.go#L742). Similarly, readers aren&rsquo;t allowed to rotate teams, so they don&rsquo;t
  [audit teams](https://github.com/keybase/client/blob/18347ca641ead8332c87afcfffcf5ddf0776e40c/go/teams/box_audit.go#L750) either.
- Clients sign the last seen Merkle root into team sigchain links. However,
  they must be careful to pick this Merkle root *before* they do a team
  rotation, or otherwise, a user could revoke a device in between the time of
  the key boxing and picking the Merkle root. If this race happens, an auditor
  looking back would infer that the admin rotated for the new per-user key, but
  in reality, the admin keyed for the old per-user key.
- The auditor needs to know which teams the user is in in order to decide to
  audit them. We can&rsquo;t trust the server with giving us this information, which
  may maliciously hide teams that it doesn&rsquo;t want the user to audit. So we simply
  [use the local
  cache](https://github.com/keybase/client/blob/18347ca641ead8332c87afcfffcf5ddf0776e40c/go/teams/box_audit.go#L1086)
  of all loaded teams in order to select which teams to audit.
- An audit *can permanently fail for legitimate reasons*. Imagine that you&rsquo;ve
  joined a team, so it&rsquo;s in your local team cache, but then later you are
  removed from the team. Now when we try to do an audit, it fails because we
  are not in the team, and so don&rsquo;t have permissions to see the team sigchain.
  At the same time, the server can&rsquo;t *prove* we aren&rsquo;t in the team, since it
  won&rsquo;t show us the team&rsquo;s sigchain. Because of this, we can&rsquo;t trust the
  server&rsquo;s word that we aren&rsquo;t really in the team, so the client just schedules
  a reaudit. Eventually, the team audit will fail 6 times for the same
  (legitimate) reason and enter the jail. However, this is OK because the user
  never needs to load the team, since they aren&rsquo;t in the team anyway. If they
  are readded to the team later, the reaudit during team load will then pass.

### Conclusion
The team box auditor provides strong guarantees that a team&rsquo;s secret keys
are rekeyed after team member device revocations even in the event of a
malicious server attempting to surreptitiously avoid being audited.
