{% set section_title = "Manage a team  " %}

### Organize your people
Teams can be what we call big teams, subteams, or open teams. Each has different features and abilities.

#### Big teams: Organize chats in channels
If you create channels for a chat, your team becomes a big team. It doesn’t matter how many people are in it; even a team of two can be a big team.

Channels are a way to organize chats. They’re useful for focused conversations on say, a specific project or lunch ideas, but they’re not private. Everyone on a team can search and read all messages and files shared in any and every channel. To privately chat or share files, you need to create a subteam.

#### Subteams: Share private messages and files
A subteam is a group of people within a team. {# TODO: The next sentence clarifies, but it feels awkward to lead with an untrue statement. #} A subteam can also include people from outside of a team. For example, an organization may want to create subteams for a particular team and a hiring committee. These subteams might be named `earnieforpresident.policy` and `earnieforpresident.policy.hiring`.

Subteams let you share private chats and folders within teams. And while teams are public (outsiders may see that they exist but can’t necessarily see everyone in them), subteams are stealthy. People who aren’t in them can’t even see that they exist.

Just like teams, a subteam can become a “big team” by adding chat channels. But permissions and roles work a little differently:

* Only team owners and admins can make subteams.
* Subteams do not have owners.
* Subteams may have “implicit admins,” people who are admins of the parent team but not of this subteam.
* Implicit admins do not have access to files and chats shared within a subteam.

{# Docs say this: “An implicit admin of a subteam who hasn’t been explicitly added to the subteam does not get access to server-gated keys for that team, and therefore does not get access to KBFS and chat data. Thus, a subteam can avoid dangerous situations in which all of its members have lost their access to data.” BUT implicit admins can delete subteams, which would delete all of their files and chats. #}

#### Open teams: Build community
Anyone can join an open team. So, if you’re building a community, you might want to make an open team. You can also let the Keybase community know about it, and we may be able to help get the word out.

If you know of an open team you’d like to join, for example `keybasefriends` or `stellar.public`, you can click `Join a team` to request being added. Since you can’t necessarily see who is on a team, Keybase pings the admin for you. The admin can accept or ignore your request.
