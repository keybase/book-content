{% set section_title = "Managing a team  " %}
Before you create a team, you should know that teams are public. Outsiders can see that they exist but not necessarily who is in them. Team members can choose to publish the teams they belong to on their profiles. 

And like other names on Keybase, team names cannot be changed. All team names must be unique, between 2 and 16 characters, and cannot start with an underscore. 

## Adding and removing team members
Turning a group chat into a team lets you add and remove team members. You can also create a team from scratch. Or, if your team is on Slack, you can [import it right into Keybase](https://keybase.io/slack-importer/).

Adding members by Keybase username is the quickest way to create a team. If you add others by their social handle, email, or phone numbers, they will need to create a Keybase account before they can join. If you add a team member who has a Keybase account by a social profile, you will need to confirm that the person you know by their social profile is the same person on Keybase before they can join your team. {# <-- this paragraph is maybe TMI? #}

As team members are added, they’re announced in chat. All new team members can search and read the entire chat history (or at least whatever hasn’t exploded). 

If you remove a team member, they lose access to all team chats and folders. Removed team members cannot rejoin a team unless an admin adds them again.

### Roles and permissions
As you add team members, you will need to assign roles which give each team member different permissions. In most cases, most people should be writers, unless you’re managing a community. Then, you might want readers for your members. You can always change roles later. 

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

## Big teams
If you create channels for a chat, your team becomes a big team (no matter how many people are in it, even a team of two can be a big team). Chats for big teams appear in the lower part of your inbox. 

Channels are a way to organize chats. They’re useful for focused conversations on say, a specific project or lunch ideas, but they are not private. **Everyone on a team can search and read all messages and files shared in any and every channel.**  Channels are not a way to privately chat or share files. To do that, you need to create a subteam. 

## Subteams
A subteam is a group of people created from within a small team or big team. A subteam does not need to include all members of a team. A subteam can also include people from outside of a team. For example, an organization may want to create subteams for a particular team and a hiring committee. These subteams might be named patagonia.design and patagonia.design.hiring.

Essentially, subteams are a way to create private chats and folders within teams. {# Need to add something about what subteams enables for Git. #} And while teams are public (outsiders may see that they exist but can’t necessarily see everyone who is in them), subteams can be completely hidden from anyone who isn’t in them. If you want a subteam to remain totally hidden, make sure members don’t publish the subteam to their profiles.

Just like teams, subteams are “small teams” until they add chat channels and become a “big team.” But permissions and roles work a little differently. Only team owners and admins can make subteams. Subteams do not have owners. Subteams may have implicit admins, people who are admins of the parent team but not of this subteam. Implicit admins do not have access to files and chats shared within a subteam.

{# Docs say this: “An implicit admin of a subteam who hasn’t been explicitly added to the subteam does not get access to server-gated keys for that team, and therefore does not get access to KBFS and chat data. Thus, a subteam can avoid dangerous situations in which all of its members have lost their access to data.” BUT implicit admins can delete subteams, which would delete all of their files and chats. #}

[Learn more about how subteams work on Keybase](https://keybase.io/docs/teams/design). 

## Open teams
If you’re building a community, you can make an open team that anyone can join. If you like, you can also publicize it to the Keybase community. 

If you know of an open team you’d like to join, for example keybasefriends or stellar.public, you can hit [Join a team] to request being added. Since you can’t necessarily see who is on a team, Keybase pings the admin for you. The admin can accept or ignore your request.

## Leaving or deleting a team
If you leave a team, any messages and files you shared remain with the team, but you lose access to them. You can only rejoin a team if you are invited by an admin or owner. 

Only a team owner can delete a team. A team can only be deleted if there are no subteams. If a team or subteam is deleted, all team chats are lost, all data in the team folder(s) is lost, and all team members are notified.
