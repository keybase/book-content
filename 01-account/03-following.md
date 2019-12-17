{% set section_title = "Following" %}

## Help keep accounts trustworthy

TL;DR: Following helps confirm that people are who they say they are on Keybase. But more importantly, it helps provide reassurance that accounts are trustworthy and haven’t been compromised.

You can follow people you know and they can follow you. But it’s not the same as following someone on Twitter or Instagram for a couple reasons. We’ll use an example to help explain. Let’s say you follow Mary Poppins on Keybase. In doing so, you’re basically confirming that she is who she says she is. You’re telling your account that it’s safe to interact with Mary Poppins’s account — it appears trustworthy to you. You might know her personally (lucky you) or recognize a proof or two she’s added. Your computer or device will also check that all of Mary Poppins’s proofs are provable. (This is a very simplified version of what actually happens. You can read more details in [the docs](https://keybase.io/docs/server_security/following).)

{# illo: a server displays Mary Poppins’s proofs (website, twitter, git), a computer and a person are both looking at/confirming the proofs that Mary Poppins’s proofs = Mary Poppins #}

Then — and this is the more important part — if one of Mary Poppins’s proofs or devices changes, you (and everyone else who follows her) will be notified before you share a message or file with her. If you get a notification, you can and should check out Mary’s account and see if anything looks off. If you have any doubts, you’d probably want to reach out to Mary through another channel to find out if she made the change or if her account was compromised. This helps gives both you and Mary more confidence about the safety of her account.

{# illo: TK: A computer waving a red flag ? #}

But you might *not* reach out to Mary if her account changes. You might not interact with her frequently. So, you might not get a notification. Or you just might not know her well enough to reach out through another channel. This is where more followers provides more security. The more followers Mary Poppins has, the more likely that *someone* will reach out to her when her account changes. She can then confirm that her account is fine or, if need be, recover her account. So, you can be confident that if someone’s account has been compromised and can’t be trusted, you’ll know it. 
 
### Follow sooner than later
It’s best to follow someone you know (or even someone you’d like to know) now rather than when you want or need to interact with them. Because the longer you follow them, the more confident you can be that their account hasn’t been compromised. 


Over time, this guarantees to your friends that your Keybase account is you, and better, to future friends that your Keybase account is you.

### Questions, Assumptions, and Notes

[Existing docs](https://keybase.io/docs/server_security/following)

A person is a timeline of events.

* “This device (phone/computer/tablet) is me.”
* “I exist!”
* “This Twitter account is me.”
* “This device is no longer me, because I lost it.”

Each statement references the last one, which prevents Keybase from leaving any out maliciously (like the last statement, above).

When you sign a statement of who a user is and post it on the server, you (client) can later verify that, and you’ll know that user’s identity hasn’t been messed with, so you can use that public key. (Either it has been the wrong one the whole time or the right one the whole time. Over time, the likelihood that it’s the right one goes up.)
