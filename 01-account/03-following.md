{% set section_title = "Following" %}

## Confirm who your friends are

TL;DR: Following helps confirm that people are who they say they are on Keybase. {# VIP info/tip: Only follow someone if you’re sure they are who they say they are. #} 

You can follow people you know and they can follow you. But it’s not the same as following someone on Twitter or Instagram. When you follow someone on Keybase, you’re confirming that they are who they say they are. You might recognize their Twitter account, personal website, or some other proof they’ve added. If one of their proofs or devices changes in the future, you and everyone else who follows them will be notified before you share a message or file with them. So, you can be confident that if someone’s account has been compromised and can’t be trusted, you’ll know it.
 
{# illo: need to think this through a little more: stamp of “following” in the shape of a key over someone’s profile, indicating that you have “signed” their account #}

The more followers someone has, the more confident you can be that their account is their account. {# Need a friendlier way to talk about this: You’re signing their identity (series of events, including devices added and removed, proofs, etc.), which helps prove to others that their identity hasn’t been tampered with. If someone’s account has been compromised do you need to manually stop following it if you no longer trust it? Or does following automatically break? #} Over time, this provides a lot of trust that an account has not been compromised, because it would require someone to compromise that account for a long period of time. The longer the period of time, the less likely someone could keep it up.

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
