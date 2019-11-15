# Teams
A team on Keybase is simply a group of people. For example, an organization or company, a group of friends, or an open community with a shared interest can all be teams.

Teams on Keybase can use [chat](link to chat section), with or without different [channels](link to channels section), [files](link to files section), and [Git](link to Git section). 

Like everything else on Keybase, your team chats, file sharing, and [Git] are secure and end-to-end encrypted. What you and your team say and share cannot be compromised — it all stays just between you and your team. Likewise, individual, person-to-person interactions also remain encrypted and private. A team admin or owner can never access private replies or any other interactions they are not a part of. 

## Creating and managing a team  
You can create, manage, and join teams from [the Teams part of the app]. This is also where you can edit team member roles and permissions, create a subteam, make chat channels, manage message history, remove team members, write your team description, and manage other team settings. {# Note: order that list so it’s the same as the order in which these topics are covered below. #} 

**To create a team on Keybase:**
1. Navigate to teams. 
2. Hit Create a team.
3. Name your team. 
Note: All team names on Keybase are unique and cannot be changed. Team names must be between 2 and 16 characters and cannot start with an underscore. 
4. Add a team avatar if you have one.
5. Start adding team members. 
Note: As you add team members, you will need to [assign roles](link to section about roles and permissions) which give each team member different permissions. In most cases, most people should be writers, unless you're managing a community. Then, you might want readers for your members. You can always change roles later.

A few good things to know:
Adding members by Keybase username is the quickest way to create your team. If you add others by their social handle, email, or phone numbers, they will need to [create a Keybase account](link to account creation section) before they can join. 

If you add a team member who has a Keybase account by a social profile, you will need to [accept/confirm] that the person you know by their social profile is the same person on Keybase before they can join your team.

If your team is on Slack, you can [import the team from Slack](https://keybase.io/slack-importer/).

### Leaving or deleting a team
If you leave a team, any messages and files you shared remain with the team, but you lose access to them. You can only rejoin a team if you are invited by an admin or owner. 

Only a team owner can delete a team. A team can only be deleted if there are no subteams. If a team or subteam is deleted, all team chats are lost, all data in the team folder(s) is lost, and all team members are notified.

### Roles and permissions
Each person on a team has different permissions according to the role they are assigned. Roles are visible to all other members of a team. Roles can be changed at any time. 

**Owners:**
* Can create chat channels
* Can create subteams
* Can add and remove members
* Can manage team members’ roles
* Can write and read in chats and folders
* Can delete team 

**Admins:**
* Can create chat channels
* Can create subteams
* Can add and remove members
* Can manage team members’ roles
* Can write and read in chats and folders
* *Can not* delete the team

**Writers:** 
* Can write and read in chats and folders
* Can create chat channels
* *Can not* create subteams
* *Can not* add and remove members
* *Can not* manage team members’ roles
* *Can not* delete the team

**Readers:**
* Can write in chats but can only read in folders
* *Can not* create chat channels
* *Can not* create subteams
* *Can not* add and remove members
* *Can not* manage team members’ roles
* *Can not* delete team

{# The above info may be useful as a diagram/chart. There’s a reference with more detail here, under Access Matrix: https://keybase.io/docs/teams/design #}

### Subteams
A subteam is a group of people created from within a team. A subteam does not include all members of a team. A subteam can also include people from outside of a team. 

Essentially, subteams are a way to create private chats and files within teams. While teams are public (outsiders may see that they exist but can’t see who is in them), subteams are completely hidden from anyone who isn’t in them. As examples, you may want to create a subteam for your board or a hiring committee. 

Just like teams, subteams can share files and chats with as many channels as they like. But permissions and roles work a little differently. Only team owners and admins can make subteams. Subteams do not have owners. 
* An implicit admin is one who is an admin of a parent subteam, but not this subteam
* All explicit admins have read/write access to their teams, and get full access to server-gated keys, which in turn allow access to KBFS and chat data.
* An implicit admin of a subteam who hasn't been explicitly added to the subteam does not get access to server-gated keys for that team, and therefore does not get access to KBFS and chat data.
* Thus, a subteam can avoid dangerous situations in which all of its members have lost their access to data.

{# Note: Need to better understand the above because I think implicit admins can delete subteams, which would delete all of their data? #}

{# Questions: Subteams can also have subteams: what’s the point of this? Can  people with admin access for the team can join any subteam, but just not secretly? #}

[Learn more about how subteams work on Keybase](https://keybase.io/docs/teams/design). 

### Open teams
If you’re building a community, you can make an open team that anyone can join. If you like, you can also publicize it to the Keybase community. [You can find both of these options under Team Settings].

If you know of an open team you’d like to join, for example keybasefriends or stellar.public, you can hit [Join a team] to request being added. Since you can’t necessarily see who is on a team, Keybase pings the admin for you. The admin can accept or ignore your request.
