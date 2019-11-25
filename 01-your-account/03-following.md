# Following

[Existing docs](https://keybase.io/docs/server_security/following)

Friends can also follow you. This is a bit different than following on Twitter, but it's a similar concept. When you follow someone on Keybase, you're signing their identity (series of events, including devices added and removed, proofs, etc.), which helps prove to others that their identity hasn’t been tampered with. Over time, this provides a lot of trust that your account has not been compromised, because it would require someone to compromise your account for a long period of time. The longer the period of time, the less likely someone could keep it up.

Over time, this guarantees to your friends that your Keybase account is you, and better, to future friends that your Keybase account is you.

### Questions, Assumptions, and Notes

> Note: When we use a word that might need explaining, link it always, even if the reader should've read an explanation by this point. In this way, the book has a narrative, but the web is the web, and each URL should be independent.

Every account on Keybase has a public history. "Sigchains" let Keybase clients reconstruct the present without trusting Keybase's servers. And when you "follow" someone on Keybase, you sign a snapshot of your view of the claims in their sigchain.

Following is for your benefit. When you sign a statement of who a user is and post it on the server, you (client) can later verify that, and you'll know that user's identity hasn't been messed with, so you can use that public key. (Either it has been the wrong one the whole time or the right one the whole time. Over time, the likelihood that it's the right one goes up.)

Following is for other people's benefit. Let's say a few people I know follow someone on Keybase. This does not mean they vouch for the user's identity, but it does mean the user's identity has been stable for however long they've been following. This gives me some assurance that the person I'm deciding to follow didn't have their account compromised today, which would be bad timing but is one of the weaknesses of other systems.

"Tracking is a way to cryptographically assure that the owner of a username does not change on me when I'm not looking."

"Usernames are just a shorthand, so it's important to be able to verify that bob still points to your friend Bob, and not some other Bob, whenever you want to communicate with him. When you track a user, this is done for you cryptographically. If another Bob is using bob, you'll know about it."

* ""Remember" really strikes a chord with me." — Tim Bray
* add to address book?
* [rename to following announcement](https://github.com/keybase/keybase-issues/issues/100#issuecomment-238855386)
