{% set section_title = "Following" %}

Friends can also follow you. This is a bit different than following on Twitter, but it’s a similar concept. When you follow someone on Keybase, you’re signing their identity (series of events, including devices added and removed, proofs, etc.), which helps prove to others that their identity hasn’t been tampered with. Over time, this provides a lot of trust that your account has not been compromised, because it would require someone to compromise your account for a long period of time. The longer the period of time, the less likely someone could keep it up.

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
