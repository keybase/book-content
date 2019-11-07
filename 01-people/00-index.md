# People

## Sara Hey!

skjdfhsdajkfhadsfsd

We provide secure communications tools for individuals and teams.

Keybase provides much more than secure end-to-end encryption. Fundamentally, what makes Keybase extra special is that we also care about the identity of people and helping you ensure you're communicating with the right people whether it's in a team chat, a shared file, or a commit to a Git repo.

In this chapter, we'll explain how Keybase does more than keep your secrets secret, exploring topics like identity, devices, and following.

## Identity

In the world of Keybase, people are people. Yes, we have accounts, and our accounts have usernames, but the promise of Keybase goes deeper than this.

Brief history lesson? What brought us to public key cryptography and how the challenge has been reduced to knowing whether a particular public key really belongs to the person you think it belongs to.

Work in this concept? "A person is a timeline of events."

## Devices

When you first sign up for Keybase, you install the app somewhere such as your computer. The app generates its own key pair and publishes the public key. From this point forward, any other device you add goes through the same process, and you verify your ownership using the same crypto. This is far, far stronger, and it's why you don't have to have a Keybase password or MFA.

Related (links): When do I need a Keybase password? Why does Keybase not have MFA? (Passwords are used to encrypt your private key on a device if/when you log out of Keybase.)

Because of this, devices are effectively keys. When you send a message from your phone, for example, that message is encrypted using the private key on your phone, and the corresponding public key is verifiably part of your Keybase identity.

## Following

[Existing docs](https://keybase.io/docs/server_security/following)

> Note: When we use a word that might need explaining, link it always, even if the reader should've read an explanation by this point. In this way, the book has a narrative, but the web is the web, and each URL should be independent.

Every account on Keybase has a public history. "Sigchains" let Keybase clients reconstruct the present without trusting Keybase's servers. And when you "follow" someone on Keybase, you sign a snapshot of your view of the claims in their sigchain.

Following is for your benefit. When you sign a statement of who a user is and post it on the server, you (client) can later verify that, and you'll know that user's identity hasn't been messed with, so you can use that public key. (Either it has been the wrong one the whole time or the right one the whole time. Over time, the likelihood that it's the right one goes up.)

Following is for other people's benefit. Let's say a few people I know follow someone on Keybase. This does not mean they vouch for the user's identity, but it does mean the user's identity has been stable for however long they've been following. This gives me some assurance that the person I'm deciding to follow didn't have their account compromised today, which would be bad timing but is one of the weaknesses of other systems.

"Tracking is a way to cryptographically assure that the owner of a username does not change on me when I'm not looking."

"Usernames are just a shorthand, so it's important to be able to verify that bob still points to your friend Bob, and not some other Bob, whenever you want to communicate with him. When you track a user, this is done for you cryptographically. If another Bob is using bob, you'll know about it."

* ""Remember" really strikes a chord with me." — Tim Bray
* add to address book?
* [rename to following announcement](https://github.com/keybase/keybase-issues/issues/100#issuecomment-238855386)

## TODO

We need to explain what signing is. Just crypto magic to guarantee something doesn't change? Tripwire analogy? "The first thing that came to mind is "snapshot". Like, snapshotting a person's identity at this point in time. This conveys that it's something that could change the road, but that you have a historical piece of evidence to compare those changes to."To my understanding, "tracking" is more like "pinning". You pin a key of somebody else and remember it.

> When you generate a key pair, it's completely arbitrary which one you choose to be the public key, and which is the private key. If you encrypt with one, you can decrypt with the other - it works in both directions.
>
> So, it's fairly simple to see how you can encrypt a message with the receiver's public key, so that the receiver can decrypt it with their private key.
>
> A signature is proof that the signer has the private key that matches some public key. To do this, it would be enough to encrypt the message with that sender's private key, and include the encrypted version alongside the plaintext version. To verify the sender, decrypt the encrypted version, and check that it is the same as the plaintext."

[what do we trust Keybase with?](https://github.com/keybase/keybase-issues/issues/78)
