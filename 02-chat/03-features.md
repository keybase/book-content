{% set section_title = "Special features" %}
## Special features 
 The cryptography that powers Keybase Chat also lets you do a lot of things you can’t do in other chat apps, like share your live location, make extra-sensitive messages explode, flip a coin, or use a bot. 

You can also send or request funds over chat, in Lumens or any other currency you choose. Learn more in [Wallet](/wallet).

### Location sharing
So long as you’re using a mobile device, you can securely share your location with any individual, group, or team on Chat. You can even share your live location for a set period of time and it will automatically update as you move. 

When you do so, only the person or people you intend to share your location with will receive it. Not even Keybase or Google Maps will know where you are. 

### Exploding messages
Exploding messages are great for your most sensitive information like passwords or credit card numbers. 

An exploding message is completely and permanently erased after a chosen period of time. It won’t be searchable. No one will ever be able to find or read it, not even if they have access to your device or the device of a person you shared the message with. It will disappear into thin air. Poof!

#### Team chats
If you share an exploding message with a team, it will only be  readable for existing members of the team. For example:

* Anyone in the team when the message is sent will be able to read it before it explodes, even if they leave and rejoin the team within that time period.
* Anyone added to the team after an exploding message is sent will not be able to read it, even if it hasn’t yet exploded. 

### Coin flips
Coin flips can help you make a really important decision—should you take that job? Buy a Corvette? Type `/flip` into a chat and you’ll get a totally randomized heads-or-tails coin flip. 

There are lots of other randomly generated things you can use for more fun: roll a die, pick a random number in a range, shuffle a list of items, and more. 

You can safely use `/flip` for important things, too. It’s cryptographically designed to make cheating and colluding all but impossible.

Learn more about cryptographic coin flipping on [the Keybase blog](https://keybase.io/blog/cryptographic-coin-flipping).

### Bots
You can add bots to do things like send reminders, start a Google Meet, integrate your Github or Jira workflow, and so much more in Chat. 

All Keybase bots are open source. Keybase builds some but anyone can. You can see documentation on [Github](https://github.com/keybase/managed-bots)

#### Permissions
In individual or group chats, anyone can add a bot. 

In a team, owners and admins can add bots. Readers and writers can not add bots. And importantly, other bots cannot add other bots (to slow the inevitable robot takeover).

#### Privacy
When you add a bot to a chat or team, you decide what it can read. 

If you choose “unrestricted,” the bot will be able to read all the messages in the chat. 

If you choose “restricted,” the bot will only be able to read the messages it’s mentioned in or otherwise summoned.  