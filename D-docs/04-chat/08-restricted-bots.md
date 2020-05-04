# Restricted Bots in Chat

Keybase has support for restricted bots; isolated members of a chat
conversation. The separation allows chat conversations to benefit from bots --
providing games, utilities, or notification workflows without entrusting the
content to the bots of the world. Users can interact with bots directly in a
conversation without having to trust bot developers/maintainers with sensitive
communications.

An encryption key derived from the main chat key is used to encrypt messages
for these members, keeping the bot from accessing content of the conversation
besides messages directly intended for them. The chat client determines which
messages to encrypt based on a signed configuration of the bot when it is added
to the team.

## High Level Design

Chat conversations are backed by [Keybase teams](/docs/teams) and use a
per-team-key (PTK) to encrypt messages. Restricted bots are signed into the
[team signature chain](/docs/teams/details#team-sigchains) as members of a team
but lack access to the PTK, rendering them unable to decrypt any team secrets
(chat, files, etc). Instead, team members derive a new encryption key for the
bot called a `TeambotKey` and store a copy of the key on the server encrypted
with the bot's [per-user-key (PUK)](/docs/teams/puk). Members use the `TeambotKey`
when communicating with the bot, allowing all regular members to send and
receive to the bot without exposing messages for other team members or other
bots.

## Technical Details

### Bot Settings Chain Link

A new team chain link `bot_settings` specifies the policies of when a
restricted bot member will have content keyed for them. When sending a chat
message, the message contents are checked against the rule set and if they
match, the content is keyed using the derived bot key instead of the PTK. This
data is stored in the sigchain instead of a chat message to prevent a server
rollback of the bot’s configuration. The link is of the form:

```
{
  "bot": {
    "uid": "f1f49e2da3db6392b47dc913b4e85519",
    "eldest_seqno": 1,
  },
  "cmds": true,
  "mentions": true,
  "triggers": ["remind me", "new reminder"],
  "channels": null,
}
```

The config field specifies what constitutes a match:
    - cmds: boolean
        - "messages that begin with !<cmd>, a bot advertised command <cmd>, will match"
    - mentions: boolean
        - "@-mentions of the bot will match"
    - triggers: []string | null
        - "word(s) can be present in the message to match"
        - "may be a regular expression for advanced usage"
    - channels: []string | null
        - "configuration is only respected in the given channels or all channels if null"

Users specify this configuration when adding a bot to the team and can modify
it with an updated chain link -- the latest config in the chain is applied when
checking messages.


### Key Derivation

When a bot member is added as a restricted bot, a `TeambotKey` is derived from
the latest `PerTeamKey` seed and boxed for the bot’s PUK. The keys can be
derived by any team member with access to team secrets by computing `HMAC(seed
|| botUID || "Derived-Teambot-Key-NaCl-DH-1")`. The resulting box is signed by
the latest PTK, which the bot validates when unboxing. Since bots cannot derive
their own keys, if a box signed by an old PTK is seen it is considered valid
for a short window while team members are notified to create a new key. The bot
caches the first time a particular key is invalid on disk to prevent the server
from repeatedly giving old boxes.

Restricted bots can also use [exploding messages](/docs/chat/ephemeral) using a
derived `TeambotEphemeralKey` from the teams latest TeamEK.
