{% set section_title = "Teams" %}
{% set section_subtitle = "Use Keybase Files, Chat, and Git with groups of people." %}
{% set page_title = "Learn about using Keybase with Teams" %}
{% set page_description = "Use Keybase for end-to-end encrypted chat, files, and Git with teams. Collaborate with groups of people to get work done safely and securely. Learn more." %}

# Keybase for Teams
Use Keybase Teams to work, connect, and organize. A team on Keybase is simply a group of people—colleagues, cabals, families, flashmobs, magic circles—any group.

Teams can [chat](/chat), use [files](/files), and [collaborate on Git](/git).

Like everything else on Keybase, team chats, files, and Git are end-to-end encrypted. What you and your team share, store, and commit stays between you and your team.

Cryptography also protects the integrity of teams on Keybase. Every team member gets a shared key pair. The private key only lives on their devices and is changed anytime someone on the team is removed or revokes a device. This key guarantees that only team admins can add or remove people and edit their permissions. Even if Keybase’s servers are compromised, or if Keybase’s employees are coerced, we can’t access that key and can’t add unauthorized people or “ghost users” into teams. Only team members added by an admin can access that team. Period.

Likewise, person-to-person interactions remain private. Team admins and owners can’t access one-on-one chats between team members or any other interactions they’re not explicitly a part of.

No snooping—anywhere, ever—on Keybase.

## Managing a team
Before you create a team, there are a few things you should know:
* Teams are public. Everyone can see that they exist but not necessarily who is in them.
* Team members can choose to publish the teams they belong to on their profiles.
* Team names must be unique.
* Team names cannot be changed.
* Team names must be lowercase letters (a-z), numbers, and underscores (no spaces).

Learn more about names on Keybase in [Usernames](account#usernames).

### Adding and removing people
You can create a team from scratch. Or if your team’s on Slack, you can [import it into Keybase](https://keybase.io/slack-importer/).

Adding people by Keybase username is the quickest way to create a team. If you add people by their social handle, email, or phone numbers, they’ll need to create a Keybase account if they don’t already have one.

As you add people to a team, they’re announced in the team chat. All new team members can search and read the entire team chat history, except for exploding messages sent before they joined.

If you remove a team member, they lose access to all team chats and folders. Removed team members cannot rejoin a team unless an admin adds them again.

#### Roles and permissions
When you add someone to a team, you’ll assign them a role that gives them specific permissions. In most cases, most people should be writers. If you’re managing an [open team](teams#build-community), you might want your team members to be readers. You can always change roles later.

<div class="table-wrapper">
    <h5><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 600">
        <path fill="currentColor" d="M286.17 419a18 18 0 1018 18 18 18 0 00-18-18zm111.92-147.6c-9.5-14.62-39.37-52.45-87.26-73.71q-9.1-4.06-18.38-7.27a78.43 78.43 0 00-47.88-104.13c-12.41-4.1-23.33-6-32.41-5.77-.6-2-1.89-11 9.4-35L198.66 32l-5.48 7.56c-8.69 12.06-16.92 23.55-24.34 34.89a51 51 0 00-8.29-1.25c-41.53-2.45-39-2.33-41.06-2.33-50.61 0-50.75 52.12-50.75 45.88l-2.36 36.68c-1.61 27 19.75 50.21 47.63 51.85l8.93.54a214 214 0 00-46.29 35.54C14 304.66 14 374 14 429.77v33.64l23.32-29.8a148.6 148.6 0 0014.56 37.56c5.78 10.13 14.87 9.45 19.64 7.33 4.21-1.87 10-6.92 3.75-20.11a178.29 178.29 0 01-15.76-53.13l46.82-59.83-24.66 74.11c58.23-42.4 157.38-61.76 236.25-38.59 34.2 10.05 67.45.69 84.74-23.84.72-1 1.2-2.16 1.85-3.22a156.09 156.09 0 012.8 28.43c0 23.3-3.69 52.93-14.88 81.64-2.52 6.46 1.76 14.5 8.6 15.74 7.42 1.57 15.33-3.1 18.37-11.15C429 443 434 414 434 382.32c0-38.58-13-77.46-35.91-110.92zM142.37 128.58l-15.7-.93-1.39 21.79 13.13.78a93 93 0 00.32 19.57l-22.38-1.34a12.28 12.28 0 01-11.76-12.79L107 119c1-12.17 13.87-11.27 13.26-11.32l29.11 1.73a144.35 144.35 0 00-7 19.17zm148.42 172.18a10.51 10.51 0 01-14.35-1.39l-9.68-11.49-34.42 27a8.09 8.09 0 01-11.13-1.08l-15.78-18.64a7.38 7.38 0 011.34-10.34l34.57-27.18-14.14-16.74-17.09 13.45a7.75 7.75 0 01-10.59-1s-3.72-4.42-3.8-4.53a7.38 7.38 0 011.37-10.34L214 225.19s-18.51-22-18.6-22.14a9.56 9.56 0 011.74-13.42 10.38 10.38 0 0114.3 1.37l81.09 96.32a9.58 9.58 0 01-1.74 13.44zM187.44 419a18 18 0 1018 18 18 18 0 00-18-18z"></path>
    </svg> Keybase Teams: Roles & Permissions</h5>
    <div class="sub-wrapper">
        <table>
            <tr>
                <th class="empty">&nbsp;</th>
                <th>Owners</th>
                <th>Admins</th>
                <th>Writers</th>
                <th>Readers</th>
            </tr>
            <tr>
                <th>Write and read chat messages</th>
                <td class="yes">Yes</td>
                <td class="yes">Yes</td>
                <td class="yes">Yes</td>
                <td class="yes">Yes</td>
            </tr>
            <tr>
                <th>View, edit, and save files</th>
                <td class="yes">Yes</td>
                <td class="yes">Yes</td>
                <td class="yes">Yes</td>
                <td class="other">View only</td>
            </tr>
            <tr>
                <th>Create chat channels</th>
                <td class="yes">Yes</td>
                <td class="yes">Yes</td>
                <td class="yes">Yes</td>
                <td class="no">No</td>
            </tr>
            <tr>
                <th>Create subteams</th>
                <td class="yes">Yes</td>
                <td class="yes">Yes</td>
                <td class="no">No</td>
                <td class="no">No</td>
            </tr>
            <tr>
                <th>Add and remove team members</th>
                <td class="yes">Yes</td>
                <td class="yes">Yes</td>
                <td class="no">No</td>
                <td class="no">No</td>
            </tr>
            <tr>
                <th>Manage team members’ roles</th>
                <td class="yes">Yes</td>
                <td class="yes">Yes</td>
                <td class="no">No</td>
                <td class="no">No</td>
            </tr>
            <tr>
                <th>Delete team</th>
                <td class="yes">Yes</td>
                <td class="no">No</td>
                <td class="no">No</td>
                <td class="no">No</td>
            </tr>
            <tr>
                <th>Add bots</th>
                <td class="yes">Yes</td>
                <td class="yes">Yes</td>
                <td class="no">No</td>
                <td class="no">No</td>
            </tr>
        </table>
    </div>
</div>

### Leaving a team
If you leave a team, any messages and files you shared remain with the team, but you lose access to them. You can only rejoin a team if you are added again by an admin or owner.

### Deleting a team
A team can only be deleted by the team owner. A team can only be deleted if there are no subteams. If a team or subteam is deleted, all team chats are lost forever, all data in the team folder(s) is lost forever, and all team members are notified.

## Team features
Teams can be what we call [big teams](teams#organize-chats-in-channels), [subteams](teams#share-private-messages-and-files), or [open teams](teams#build-community). Each has different features and abilities.

### Big teams
#### Organize chats in channels.
If you create channels for a chat, your team becomes a big team. It doesn’t matter how many people are in it; even two people can be a big team.

Channels are a way to organize chats. They’re useful for focusing conversations on a specific project or idea but they’re not private. Everyone on a team can search and read all messages and files shared in any and every channel. To share private messages or files, you need to [create a subteam](teams#subteams).

### Subteams
#### Share private messages and files.
A subteam is a private group created within a team. A subteam can include members of a team as well as people who are not a part of that team.

For example, an organization may want to create a subteam for a hiring committee. The hiring committee subteam could include team members as well as board members that aren’t a part of the team.

In a subteam, you can share private chats and files within a team. Only members of the subteam can read them. And while teams are public (outsiders may see that they exist but can’t necessarily see who is in them), subteams are stealthy. People who aren’t in them can’t even see that they exist.

Just like any other team, a subteam becomes a big team when you add chat channels. But permissions and roles work a little differently:
* Only team owners and admins can make subteams.
* Subteams do not have owners.
* Subteams may have “implicit admins,” people who are admins of the parent team but not of this subteam. Implicit admins do not have access to files and messages shared within a subteam, but they can add themselves to the subteam and gain access.
* When implicit admins add anyone (including themselves) to a team, it is announced to the other members.

### Open teams
#### Build community.
Anyone can join an open team. So, if you’re building a community, you might want to make an open team. You can also let Keybase know about it and we may be able to help get the word out.

If you know of an open team you’d like to join, for example `keybasefriends` or `stellar.public`, you can select `Join a team` to request being added. Since you can’t necessarily see who’s on a team, Keybase pings the admin for you. The admin can accept or ignore your request.

## Chat for Teams
Chat for Teams works pretty much the same way it does for individuals. Learn more in [Chat](/chat).

A chat is automatically created for each team. Team members with the right permissions can organize chats with [channels](teams#channels) and manage chat [privacy](teams#privacy).

### Channels
Owners, admins, and writers (everyone except readers) can create channels to organize team chats. If you add a channel to a team chat, your team becomes a big team (and the chat moves to the lower part of your inbox).

Channels are not private. Everyone on a team can read messages and files shared in any team channel.

If you delete a chat channel, all messages will be lost and gone forever.

### Privacy
Everyone on a team can search and read all of the messages and files shared in team chats. But when team members chat directly with each other, their messages remain private. Team owners or admins can’t access private chats.

By default, your entire chat history is saved and searchable forever. But team owners can manage how long messages are saved. Messages can be auto-deleted never or at set intervals as short as 30 seconds and as long as 365 days.

To keep chats or files private to specific team members, create a [subteam](teams#share-private-messages-and-files).

## Files for Teams
Files for Teams on Keybase works pretty much the same way it works for individuals. Learn more in [Files](/files).

Teams and subteams can store up to 100 GB of documents, photos, and videos. Anything you store or share with a team on Keybase is automatically end-to-end encrypted. Only the people on that team can access team files. But, everyone on a team can access every file.

To make files private to specific team members, [create a subteam](teams#subteams).

## Git for Teams
Git for Teams on Keybase works pretty much the same way it works for individuals. Learn more in [Git](/git).

Git repositories on Keybase are free, encrypted, authenticated, and private. They’re especially useful for sharing secret or private content within teams. Repositories shared with teams can be viewed in the Keybase app.

To see a demo, ask to join the team `keybasefriends`.
