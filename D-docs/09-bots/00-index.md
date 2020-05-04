# Bots

Here is the technical documentation for bot development. This section is under development, check back soon for updates!

## Key-Value Storage

Keybase has added an encrypted key-value store intended to support security-conscious bot development with persistent state. It is a place to store small bits of data that are

1. encrypted for yourself (or for anyone in a team you're in)
1. persistent across logins
1. fast and durable.

### Technical Details

If you're a bot developer who has needed persistent state, you may already be using KBFS for your storage needs. We've implemented the key-value storage feature for more lightweight applications storing small blobs of data - maybe you just need to store a session key, or you're building a team password manager.

Key-value storage exposes a simple API to put, get, list, and delete entries.

Entry values are encrypted for yourself by default (this is probably what you want), but you can also specify a team:

1. you plus any list of other keybase users (e.g. `you,alice,bob`)
1. a named team or subteam (e.g. `myawesometeam.passwords`)

A team has many namespaces, a namespace has many entryKeys, and an entryKey has one current entryValue. You cannot fetch old versions of your data if you've `put` a new revision or deleted it.

Namespaces and entryKeys are in cleartext, and the Keybase client service will encrypt and sign the entryValue on the way in (as well as decrypt and verify on the way out) so Keybase servers cannot see it or forge it.

If you prepend a namespace or entryKey with double-underscores (e.g. `__whatever`), it will be undiscoverable from the corresponding `list` endpoint.


#### Revision Numbers

The Keybase server keeps track of the latest revision number for each entry, and it requires the client to specify the correct revision number on every update request. When you put a new entry or update an existing one (deleting works this way too), your Keybase client will first run a `get` for that entry so it knows exactly what revision the server is expecting (e.g. 1 for a totally new entry). This complexity is hidden from the API because you probably don't need it. If, however, you would like to manage your own revisions (e.g. you have two different bots that absolutely need to share and update the same entries concurrently), you can pass in a revision and your Keybase client will use it.

For example, assuming that this entry has not been inserted previously, the following command will insert an entry with revision 1:

```
keybase kvstore api -m '{"method": "put", "params":
{"options": {"namespace": "pw-manager", "entryKey":
"geocities", "entryValue": "all my secrets"}}}'
```

If we `put` with an explicit revision number 2 at this point (as is done in the command below), the `put` will fail, because it is expecting revision 3:

```
keybase kvstore api -m '{"method": "put", "params": {"options":
{"namespace": "pw-manager", "revision": 2,
"entryKey": "geocities", "entryValue": "some update"}}}'
```

### Security Details

Much of the metadata, including namespaces, entryKeys, as well as database access patterns, is known to the Keybase server. EntryValues, however, are signed by the device key of the writer and then encrypted for a specific team. This ensures that the server cannot read or forge an entryValue, nor prove any of the metadata it knows about it. The security tradeoffs are modeled after and are extremely similar to chat. Here are some of the distinguishing details.

#### Metadata

We use [authenticated encryption with associated metadata (AEAD)](https://en.wikipedia.org/wiki/Authenticated_encryption#Authenticated_encryption_with_associated_data_%28AEAD%29), a construct that allows the inclusion of associated data (in our case, a bunch of metadata) as part of what is signed then encrypted. We do this to mitigate several possible attacks that might otherwise be available to the server.

One of the main risks of signing-then-encrypting a message is what happens if someone who is able to decrypt the outer layer can then reencrypt the signed message for some other purpose (e.g. a different entryKey or a previous revision). In the context of this product, an attack like that would require collusion between the Keybase server and a current (or former, depending on the specifics) member of the team. We handle this family of problems (including for example a malicious Keybase server swapping your entryValues between entryKeys) by having the writer sign over not just the entryValue, but also a hash of a bunch of metadata. The metadata specifies the expected signing and encryption keys as well as the expected entry details (team, namespace, entryKey, and revision). And this metadata hash is checked whenever an entry is decrypted and verified by a Keybase client.

#### Rollback Protection

Because the server can return different responses for the same request (when the current entryValue at a given entryKey changes), there are some additional verifications that each client performs: that the revision number and team key generation of an entry cannot decrease, and that the same revision number always maps to the same entryValue and team key generation.

### Usage

You can interact with key-value storage via the Keybase CLI. To see sample commands:

```
keybase kvstore api help
```

Key-value storage support has been implemented in three of our bot libraries for [Python](https://github.com/keybase/pykeybasebot), [JavaScript](https://github.com/keybase/keybase-bot), and [Golang](https://github.com/keybase/go-keybase-chat-bot). To get you started, you can also find in those libraries helpful examples of bot implementations that use the key-value store. Our very own managed bot Jirabot (for interacting with Jira) also [utilizes key-value storage](https://github.com/keybase/managed-bots/tree/master/jirabot). Give them a try!
