{% set section_title = "Teams" %}
{% set section_subtitle = "Use Keybase Files, Chat, and Git with groups of people." %}

# Keybase for Teams
Use Teams to work, connect, organize. A team on Keybase is simply a group of people—colleagues, cabals, families, flashmobs, magic circles—any group.

Teams can [chat](/chat), use [files](/files), and [collaborate on Git](/Git).

Like everything else on Keybase, your team chats, files, and Git are end-to-end encrypted. What you and your team share, store, and commit stays between you and your team.

Likewise, person-to-person interactions remain private. Team admins or owners can’t access individual chats between team members or any other interactions they’re not explicitly a part of. No snooping—anywhere, ever—on Keybase.

## Managing a team
Before you create a team, there are a few things you should know:
* Teams are public. Outsiders can see that they exist but not necessarily who is in them.
* Team members can choose to publish the teams they belong to on their profiles.
* Team names cannot be changed.

### Adding and removing people
You can create a team from scratch. Or if your team’s on Slack, you can [import it into Keybase](https://keybase.io/slack-importer/).

Adding people by Keybase username is the quickest way to create a team. If you add people by their social handle, email, or phone numbers, they’ll need to create a Keybase account if they don’t already have one.

As you add people to a team, they’re announced in the team chat. All new team members can search and read the entire team chat history, except for exploding messages sent before they joined.

If you remove a team member, they lose access to all team chats and folders. Removed team members cannot rejoin a team unless an admin adds them again.

#### Roles and permissions
When you add someone to a team, you’ll assign them a role that gives them specific permissions. In most cases, most people should be writers, unless you’re managing a community. Then, you might want your team members to be readers. You can always change roles later.

<div class="table-wrapper">
    <h5><img src="/static/img/kbicon.svg" alt=""> Keybase Teams: Roles & Permissions</h5>
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
            <th>Manage team members' roles</th>
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

### Leaving a team
If you leave a team, any messages and files you shared remain with the team, but you lose access to them. You can only rejoin a team if you are invited by an admin or owner.

### Deleting a team
A team can only be deleted by the team owner. A team can only be deleted if there are no subteams. If a team or subteam is deleted, all team chats are lost forever, all data in the team folder(s) is lost forever, and all team members are notified.

## Team features
Teams can be what we call big teams, subteams, or open teams. Each has different features and abilities.

### Big teams
#### Organize chats in channels.
If you create channels for a chat, your team becomes a big team. It doesn’t matter how many people are in it; even two people can be a big team.

Channels are a way to organize chats. They’re useful for focusing conversations on a specific project or idea but they’re not private. Everyone on a team can search and read all messages and files shared in any and every channel. To share private messages or files, you need to create a subteam.

### Subteams
#### Share private messages and files.
A subteam is a private group created within a team. A subteam can include members of a team as well as people who are not a part of that team.

For example, an organization may want to create a subteam for a hiring committee. The hiring committee subteam could include team members from the organization as well as board members that aren’t a part of the team.

In a subteam, you can share private chats and files within a team. Only members of the subteam can read them. And while teams are public (outsiders may see that they exist but can’t necessarily see who is in them), subteams are stealthy. People who aren’t in them can’t even see that they exist.

Just like any other team, a subteam becomes a big team when you add chat channels. But permissions and roles work a little differently:
* Only team owners and admins can make subteams.
* Subteams do not have owners.
* Subteams may have “implicit admins,” people who are admins of the parent team but not of this subteam.
* Implicit admins do not have access to files and messages shared within a subteam.

### Open teams
#### Build community.
Anyone can join an open team. So, if you’re building a community, you might want to make an open team. You can also let the Keybase community know about it and we may be able to help get the word out.

If you know of an open team you’d like to join, for example `keybasefriends` or `stellar.public`, you can hit `Join a team` to request being added. Since you can’t necessarily see who’s on a team, Keybase pings the admin for you. The admin can accept or ignore your request.

## Chat for Teams
Chat for Teams works pretty much the same way it does for individuals. Learn more in [Chat](/chat).

A chat is automatically created for each team. Team members with the right permissions can organize chats with channels and manage chat privacy.

### Channels
Everyone on a team (except readers) can create channels to organize team chats. If you add a channel to a team chat, your team becomes a big team (and the chat moves to the lower part of your inbox).

Everyone on a team can read messages and files shared in any team channel.

If you delete a chat channel, all messages will be lost and gone forever.

### Privacy
Everyone on a team can search and read all of the messages and files shared in team chats. But when team members chat directly with each other, their messages remain private. Team owners or admins can’t access private chats.

By default, your entire chat history is saved and searchable forever. But team owners can manage how long messages are saved. Messages can be auto-deleted never or at set intervals as short as 30 seconds and as long as 365 days.

To keep chats or files private to specific team members, create a subteam.

## Files for Teams
Files for Teams on Keybase works pretty much the same way it works for individuals. Learn more in [Files](/files).

Teams and subteams can store up to 100 GB of documents, photos, and videos. Anything you store or share with a team on Keybase is automatically end-to-end encrypted. Only the people on a team can access team files. But, everyone on a team can access every file.

To make files private to specific team members, create a subteam.


## Git for Teams
Git for Teams on Keybase works pretty much the same way it works for individuals. Learn more in [Git](/git).

Git repositories on Keybase are free, encrypted, authenticated, and private. They’re especially useful for sharing secret or private content within teams. Repositories shared with teams can be viewed in the Keybase app.

To see a demo, ask to join the team `keybasefriends`.
