# Teams High-Level Design

This document provides a high-level description of Keybase teams, specifying applications,
team roles and team structure.

## Teams and Subteams

A root team is a top-level identifier in the Keybase namespace, which obeys the
same parsing rules as Keybase usernames.  So valid root teams include `nike`, `google`,
or `friends_of_max`. These names are visible to the whole world, so if you create
the team `lets_fire_bob`, the whole world will see it, they just won't be able to get
any details about who the members are unless they are themselves team members.

Subteams are nested below root teams.  So `nike.hr`, `nike.hr.interns`, and
`nike.hr.interns.volleyball` are all valid subteams. The very existence of subteams
are hidden from all who aren't members of the subteam. Thus, if you wanted to create
the team `lets_fire_bob.just_kidding_fire_bruce`, then Bruce would have no way of
knowing his number is up.

As we will see, every team and subteam has its own signature chain that's inserted
directly into the Keybase global tree. But subteams exist in this tree under
pseudonyms, pointed to by their parent teams. So they can remain private, but the
team members can be certain that the Keybase servers aren't equivocating about
the team definitions.

## Applications

[Chat](/blog/keybase-chat) and [KBFS](/docs/kbfs) are the two applications
that we initially support with Keybase teams. In both cases, teams are
mutable and uniquely identified by name, without fear of a malicious server
remapping teams.

For chat, every team like `nike.hr.interns.volleyball`, will have private chats,
with multiple channels, and every member of the team, regardless of their role,
will have full access to the chats.

For KBFS, team shares will be available under paths such as `/keybse/team/nike`
and `/keybase/team/nike.hr.interns.volleyball`.  Those with write permissions (or more)
will be able to read and write the team, while those with only read permissions will lack
write privileges.

Right now, Keybase does not support shares across teams, like `/keybase/team/nike,adidas`,
since so doing would reveal `nike`'s membership to `adidas`, and vice versa.

## Team Roles

* A **team** is a group of keybase users, consisting of: **admins**, **owners**, **implicit admins**,
  **readers** and **writers**.
* A **reader** can read the KBFS folders for a team, and he can both read and write a team's chat.
* A **writer** has all of the permissions of a reader, but can also write to the team's KBFS resources.
* An **admin** can add or remove admins, readers, and writers to the team, and establish a subteam for the team. An admin can additionally deactivate a team as long as it's not a root team.
* An **implicit admin** is one who is an admin of a parent subteam, but not this subteam
* All explicit admins have read/write access to their teams, and get full access to server-gated
keys, which in turn allow access to KBFS and chat data.
* An implicit admin of a subteam who hasn't been explicitly added to the subteam does not get access to
server-gated keys for that team, and therefore does not get access to KBFS and chat data.
* Thus, a subteam can avoid dangerous situations in which all of its members have lost their access to data.
* But Keybase can still enforce, for instance, that a sysadmin for Campbell Soup Corp. can't download the C*O team documents.
* An **owner** is an admin for root team who additionally has the power to delete the team.

The cryptographic mechanism here is that for any shared secret team key the
team needs (for Chat or KBFS or Saltpack), the ultimate key used is an XOR of:
(1) the shared key that is encrypted for all user's Per-User Keys; and (2) a
server-stored key-half that is only distributed if the ACLs permit it. This
setup gives the server the ability to break the user's attempt to decrypt
their KBFS or Chat, but it has that ability anyways by just corrupting all of
the ciphertexts.

## Access Matrix

The above properties are summarized in the following access matrix:

<table class="access-matrix" id="main-table">
<tr>
	<th>role</th>
	<th>owner</th>
	<th>admin</th>
	<th>implicit admin</th>
	<th>writer</th>
	<th>reader</th>
</tr>
<tr>
	<td>add/remove owner</td>
	<td>1</td>
	<td>0</td>
	<td>0</td>
	<td>0</td>
	<td>0</td>
</tr>
<tr>
	<td>add/remove readers,writers,admins</td>
	<td>1</td>
	<td>1</td>
	<td>1</td>
	<td>0</td>
	<td>0</td>
</tr>
<tr>
	<td>write TLF metadata</td>
	<td>1</td>
	<td>1</td>
	<td>1</td>
	<td>1</td>
	<td>0</td>
</tr>
<tr>
	<td>read TLF metadata</td>
	<td>1</td>
	<td>1</td>
	<td>1</td>
	<td>1</td>
	<td>1</td>
</tr>
<tr>
	<td>ask TLF metadata to be rekeyed</td>
	<td>1</td>
	<td>1</td>
	<td>1</td>
	<td>1</td>
	<td>1</td>
</tr>
<tr>
	<td>read KBFS files</td>
	<td>1</td>
	<td>1</td>
	<td>0.5</td>
	<td>1</td>
	<td>1</td>
	<td>implicit admin blocked by access control</td>
</tr>
<tr>
	<td>write KBFS files</td>
	<td>1</td>
	<td>1</td>
	<td>0.5</td>
	<td>1</td>
	<td>0</td>
	<td>implicit admin blocked by access control</td>
</tr>
<tr>
	<td>read chat</td>
	<td>1</td>
	<td>1</td>
	<td>0.5</td>
	<td>1</td>
	<td>1</td>
	<td>implicit admin blocked by access control</td>
</tr>
<tr>
	<td>write chat</td>
	<td>1</td>
	<td>1</td>
	<td>0.5</td>
	<td>1</td>
	<td>1</td>
	<td>implicit admin blocked by access control</td>
</tr>
<tr>
	<td>make chat channels</td>
	<td>1</td>
	<td>1</td>
	<td>1</td>
	<td>1</td>
	<td>0.5</td>
	<td>readers blocked by access control</td>
</tr>
<tr>
	<td>create subteam of current team</td>
	<td>1</td>
	<td>1</td>
	<td>1</td>
	<td>0</td>
	<td>0</td>
</tr>
<tr>
	<td>can delete the team if is root team</td>
	<td>1</td>
	<td>0</td>
	<td>N/A</td>
	<td>0</td>
	<td>0</td>
	<td>root teams (e.g., nike) don't have implicit admins</td>
</tr>
<tr>
	<td>can delete the team if is a subteam</td>
	<td>N/A</td>
	<td>1</td>
	<td>1</td>
	<td>0</td>
	<td>0</td>
	<td>a subteam (e.g., nike.usa) can't have an owner</td>
</tr>
</table>

### Legend

<table class="access-matrix" id="legend">
<tr><td class="explicit">Access Permitted (✓)</td></tr>
<tr><td class="implicit">Access withheld via server-trusted Access Control (👮)</td></tr>
<tr><td class="nada">Access cryptographically denied (✗)</td></tr>
</table>

<script>
$(function() {
  $(".access-matrix td").filter(function() { return $(this).html() === "1" }).addClass('explicit').html("✓");
  $(".access-matrix td").filter(function() { return $(this).html() === "0" }).addClass('nada').html("✗");
  $(".access-matrix td").filter(function() { return $(this).html() === "0.5" }).addClass('implicit').html("👮");
  $(".access-matrix#main-table tr > td:first-child").addClass("right-label");
});
</script>

