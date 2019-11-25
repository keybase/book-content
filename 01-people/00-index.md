# People

Let’s talk about identity.

When you first sign up for an account online, there are a couple of steps that have become pretty standard:

* You create a username, so that you have a friendly way to refer to your account and establish identity.
* You create a password, so that no one else can access your account.

![]({{url_for('static', filename='img/kb-signup.png')}})

These two concepts are important when we talk about identity online. There needs to be trust that an account belongs to you, and there needs to be trust that only you can access the account.

Usernames do a pretty good job, but even if you typically use the same username everywhere, your friends can’t know for sure that it’s really you at first. Over time, you can establish trust by linking to your account from your personal website (or from other, established accounts), telling people in person, etc.

![]({{url_for('static', filename='img/kb-passwords.png')}})

Passwords don’t do such a good job, so additional concepts have been introduced to help. Password managers can be used to generate strong, random passwords for every account. You can also set up [multi-factor auth](TK), so even if your password is compromised, your account might not be.

Keybase improves upon both of these basic concepts in important ways.

When you sign up for Keybase, strong cryptography guarantees an association between your account and the device you signed up with. This means that no one else can compromise your account without having your device, and if you authenticate with multiple devices, no one else can compromise your account without having all of your devices. We’ll talk about this more in the [next section](TK).

You prove that an account belongs to you through [social proofs](TK) and [following](TK), both of which also rely on strong cryptography.

The result is that your Keybase account is more secure than other online accounts. Keybase is a place where you can think of people as people, because the association between you, your account, and your devices is trustworthy.

## Scraps

Keybase is like MMFA, multi-multi-factor auth. Maybe a table that shows what's needed to compromise an account protected with MFA and what's needed to compromise a Keybase account. In one column, a compromised password (super common, unfortunately) and a spoofed phone number (possible and proven, link to examples) is what you need. In the other column, you have to steal every device authed with a Keybase account at the same time, and break into someone's house to steal their paper keys, and keep up the compromise over a long period of time. Which do you think is stronger?

We provide secure communication tools for individuals and teams.

In this chapter, we'll explain how Keybase does more than keep your secrets secret, exploring topics like [proofs](/people/proofs), [devices](/people/devices), and [following](/people/following).

{# Note: this is a helpful explanation of identity that most non-technical users might understand: https://www.quora.com/What-is-Keybase-in-laymans-terms #}

[what do we trust Keybase with?](https://github.com/keybase/keybase-issues/issues/78)
