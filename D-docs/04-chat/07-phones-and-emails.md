# Phone Numbers and Emails

When you want to communicate with people you know on the Internet, Keybase is
great because you can address them by their social identities (Twitter, Reddit,
Mastodon, etc.).

But identity proofs aren&rsquo;t that useful for many people you know _in real
life_. They might not be on the same social media you&rsquo;re on, or you
might have just met this person at a coffee shop.

In Keybase 4.3.0, users can now add and verify their phone numbers and
emails, as well as send messages to phone numbers and emails. Like with
social identities, you can send messages [even if the recipient isn&rsquo;t on
Keybase yet](/blog/keybase-chat).

## Show me how!

First, ensure you&rsquo;ve updated to the latest Keybase version.

To add a phone number or email address, go to the Settings tab (or on mobile,
hamburger menu&rarr;Your account).

<center style="margin:40px 0;"><img src="/docs-assets/contacts/settings.png" class="img img-responsive" width="500"
    alt="Keybase Settings tab on desktop"></center>

To start a conversation with a phone number or email, go to the Chat tab, click
the new conversation button at the top left (Ctrl-N or ⌘N on Mac).

<center style="margin:40px 0;"><img src="/docs-assets/contacts/chat.png" class="img img-responsive" width="500"
    alt="Keybase Chat tab on desktop"></center>

Type in a phone number or email address. If a user on Keybase has verified it
and made it searchable, they&rsquo;ll appear; otherwise, you&rsquo;ll still be
able to start a conversation, and the recipient will get the messages when they
join Keybase, verify their contact, and make it searchable.

<center style="margin:40px 0;"><img src="/docs-assets/contacts/new-chat.png" class="img img-responsive" width="300"
    alt="Keybase New Chat modal on mobile"></center>

On mobile, you can import your address book to quickly find which of your
contacts are already on Keybase. You can toggle this setting in hamburger
menu&rarr;Phone contacts.

## Security considerations

Unlike identity proofs, which are public and checkable by all Keybase devices,
phone number and email verifications are only verified by the Keybase server.
That means that when you start a conversation with a phone number or email, you
trust the Keybase server to give you the right user the first time&mdash;this
is called trust on first use (TOFU).

After the initial conversation is started, the Keybase server can&rsquo;t play
any more tricks, since both users&rsquo; devices now verify each other. Then
when users chat, their devices encrypt messages only for the devices they've
already verified.

On apps like Signal, Wire, and Riot, you can optionally verify a [key
fingerprint or safety
number](https://support.signal.org/hc/en-us/articles/360007060632-What-is-a-safety-number-and-why-do-I-see-that-it-changed-)
to be sure you&rsquo;re talking to the right person.

Because of the [global Merkle tree](/docs/server_security), to achieve the same
level of security on Keybase when starting conversations with phone numbers and
emails, you only need to exchange Keybase usernames outside of Keybase (in
person, over a phone call, etc.).

## Privacy considerations

Some users may not want the Keybase servers to know their phone numbers or
email addresses. Users will never be required to add a phone number on
Keybase, and although email addresses are currently required to signup for
Keybase, in a future Keybase version, we will remove this requirement as well.

Some users may want to have phones and emails registered for notifications from
Keybase, but not want other users to find them by those phone numbers or email
addresses. This can be accomplished by deselecting &ldquo;Allow friends to find
you by this number/email address&rdquo; option when adding them. You can toggle
this option in the Settings tab by making it &ldquo;unsearchable.&rdquo;

<center style="margin:40px 0;"><img src="/docs-assets/contacts/unsearchable.png" class="img img-responsive" width="500"
    alt="Make unsearchable menu in the Keybase settings tab on desktop"></center>

All users who signed up before the rollout of this feature have their emails set as
unsearchable by default.

Some users may not want the Keybase servers to know their address book. Contact
syncing is an optional feature intended to help you find friends who may
already be on Keybase. When contact syncing, devices send the server the phone
numbers and emails of the contacts in their address book, but not names, labels
or other metadata. The server will reply with any Keybase users with accounts
which match those phone numbers and emails, and then immediately discards the
data: user address books are not stored permanently on the server.

We do not currently prove this via a system like private set intersection or
Signal&rsquo;s [private contact discovery via
SGX](https://signal.org/blog/private-contact-discovery/). In the future, we
hope to increase the privacy of contact syncing so users do not have to trust
the Keybase server to discard address book data.
