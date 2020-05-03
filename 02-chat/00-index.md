{% set section_title = "Chat" %}
{% set section_subtitle = "Share messages and files with anyone." %}
{% set page_title = "Learn about using Keybase for Chat" %}
{% set page_description = "Use Keybase Chat for end-to-end encrypted messaging with anyone. Keep your private messages safe and secure. Learn more." %}

# Keybase for Chat
Message with friends, share important info with colleagues, or organize entire events. No matter how many chats you lead (or take part in), you can access them from within one single place which is Chat Inbox.

![ !One-on-one chats are organized at the top of your inbox; team chats are below.](/img/chat-profileteams.png)

Whatever you share, gets end-to-end encrypted.

You can chat with individuals or groups, [block people](/chat#blocking) you don’t want to chat with, and get even more done with [special features](/chat#special-features) like location sharing, exploding messages, coin flips, and bots.

## Starting a chat
To start new chats, find your contacts by name, email, phone number, or username from other platforms like Twitter, Facebook, and GitHub.

If you start a chat with someone who doesn’t have a Keybase account, they’ll have to create one before they can receive your message. This helps ensure that only your intended recipients can read your messages. Additionally, one of your devices will need to be online for them to receive your message.

You can use Keybase Chat just like you would for one-on-one or group messages on your phone. Except, of course, it’s super, super secure. You can do a lot more if you turn a group into a team.

## Team chats
If you turn a group chat into a team, you can add or remove people from it. [Teams](/teams) also allow you to organize chats by adding channels. If you add channels, your team becomes what we call a big team.

### Channels
You can create channels to organize chats—on say, a specific project or lunch ideas—but they’re not private. Everyone in a team can search and read all messages and files shared in any and every channel.

### Subteams
To create group chats or to share files that are private to specific team members, you need to [make a subteam](/teams#subteams). Subteams are cryptographically distinct from the parent team, so you can add people to a subteam who are not in the parent team.

### Private messages
You can reply privately to messages within team chats. Those chats move outside of the team chat and always remain private between you and that other person. Team owners and admins can’t snoop.

### Chat history
Your entire chat history of messages and files is searchable and readable by everyone in a team, including new team members.

In team chats, owners can determine how long messages are saved. Messages can be auto-deleted never or at set intervals from 30 seconds to 365 days. Individual messages can also be set to [explode](chat#exploding-messages) after a certain time period.

So long as you choose to keep your chat history, you’ll always be able to search and read all of it.

## Privacy
Keybase accounts are public, but you can control who can chat or otherwise interact with you by blocking, reporting, and/or restricting contacts.

If someone you don’t follow and haven’t chatted with before contacts you on Keybase, you’ll automatically get a heads up. You can choose to wave hello, view their account profile, or block them. If you want to chat, just start typing and the notification will automatically disappear.

### Blocking
When you block someone, they won’t be able to chat with you or add you to a team. You can also remove them from your public list of followers. You won’t see them, and their account will not be publicly associated with yours.

But they can still follow you. They may also know that you blocked them because they won’t be able to chat with you or add you to a team.

### Reporting
When you report someone, we review their account as quickly as humanly possible. We will remove people that have violated our [terms](https://keybase.io/docs/terms). Please provide additional information so we can remove spammers, abusers, and harassers even faster.

### Restricting contacts
You can further restrict who can chat with you or add you to a team, under Settings > Chat.

You can select a box that gives you options to only let someone message you or add you to a team if:
* you follow them,
* you follow someone who follows them, or
* they’re in a particular team with you.

If you select the team option, you can further specify which teams.

## Special features
 The cryptography that powers Keybase Chat also lets you do a lot of things you can’t do in other chat apps, like share your live [location](chat#location-sharing), make extra-sensitive messages [explode](chat#exploding-messages), flip a [coin](chat#coin-flips), or use a [bot](chat#bots).

You can also send or request funds over chat, in Lumens or any other currency you choose. Learn more in [Wallet](/wallet).

### Location sharing
On mobile devices, you can safely and securely share your location with any individual, group, or team on Keybase Chat. You can even share your live location for a set period of time and it will automatically update as you move.

When you do so, only the person or people you intend to share your location with will receive it. Not even Keybase or Google Maps will know where you are.

![ !Safely and securely show your contacts where you are.](/img/chat-location.png)

### Exploding messages
Exploding messages are great for your most sensitive information, like passwords or credit card numbers.

An exploding message is completely and permanently erased after your chosen period of time. It won’t be searchable. No one will ever be able to find or read it, not even if they have access to your device or the device of a person you shared the message with. It will disappear into thin air. Poof!

![ !Permanently erase super sensitive information in an exploding message.](/img/chat-explodingmessage.gif)

#### Team chats
If you share an exploding message with a team, it will only be  readable for existing members of the team. This means:

* Everyone in the team—at the time the message is sent—will be able to read it before it explodes, even if they leave and rejoin the team within that time period.
* Anyone added to the team after an exploding message is sent will not be able to read it, even if it hasn’t yet exploded.

### Coin flips
Coin flips can help you make decisions, like where to go to lunch.

Type `/flip` into a chat and you’ll get a totally randomized heads-or-tails coin flip.

You can also roll a die, pick a random number in a range, shuffle a list of items, and more.

![ !Make very important decisions with a randomized coin flip.](/img/chat-coinflip.gif)

You can safely use `/flip` for important things, too. It’s cryptographically designed to make cheating and colluding all but impossible.

Learn more about cryptographic coin flipping on [the Keybase blog](https://keybase.io/blog/cryptographic-coin-flipping).

### Bots
You can add bots to do things like send reminders, start a Google Meet, integrate your GitHub or Jira workflow, and so much more in Chat.

All Keybase bots are open source. Keybase builds some but anyone can. You can see documentation on [GitHub](https://github.com/keybase/managed-bots).

#### Permissions
In individual or group chats, anyone can add a bot.

In a team, owners and admins can add bots. Readers and writers can not add bots.

Importantly, other bots cannot add other bots (we’re doing our part to slow the inevitable robot takeover).

#### Privacy
When you add a bot to a chat or team, you decide what it can read.

If you choose “unrestricted,” the bot will be able to read all the messages and files in the chat.

If you choose “restricted,” the bot will only be able to read the messages it’s mentioned in or otherwise summoned.
