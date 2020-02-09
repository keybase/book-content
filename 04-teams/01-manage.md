{% set section_title = "Manage a team  " %}
## Manage a team
Before you create a team, there are a few things you should know:
* Teams are public. Outsiders can see that they exist but not necessarily who is in them. 
* Team members can choose to publish the teams they belong to on their profiles. 
* Team names cannot be changed. 
* All team names must be unique, between 2 and 16 characters, and cannot start with an underscore. 

### Add and remove team members
You can create a team from scratch. Or if your team’s on Slack, you can [import it right into Keybase](https://keybase.io/slack-importer/).

Adding members by Keybase username is the quickest way to create a team. If you add people by their social handle, email, or phone numbers, they’ll need to create a Keybase account before they can join. 

As team members are added, they’re announced in chat. All new team members can search and read the entire chat history (or at least whatever hasn’t exploded). 

If you remove a team member, they lose access to all team chats and folders. Removed team members cannot rejoin a team unless an admin adds them again.

#### Roles and permissions
When you add team members, you’ll assign roles which give each team member different permissions. In most cases, most people should be writers, unless you’re managing a community. Then, you might want your members to be readers. You can always change roles later. 

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

{# The above info may be more useful as a diagram/chart. There’s a reference with more detail here, under Access Matrix: https://keybase.io/docs/teams/design #}

### Leave or delete a team
If you leave a team, any messages and files you shared remain with the team, but you lose access to them. You can only rejoin a team if you are invited by an admin or owner. 

Only a team owner can delete a team. A team can only be deleted if there are no subteams. If a team or subteam is deleted, all team chats are lost, all data in the team folder(s) is lost, and all team members are notified.
