# People

{# Falling back to an outline for now. #}

When you first sign up for Keybase, you create an account with a username.

Keybase creates a key pair, and the public key is guaranteed to be associated with the account you just created.

This is very secure, unless you lose your phone or computer (whichever you signed up with). It's so secure, you don't need a password.

To make it more secure, you can attach another device to your account. What's really happening when you do this is that the new device generates another key pair, and that public key is also associated with your account, and both private keys are used to assure this.

This is very secure, and now you're protected against losing a single device.

You can also create paper keys, which you should store somewhere like a locked drawer.

Now your account is even more secure. As long as you don't lose access to all of your devices (and paper keys) at the same time, you can remove any device that you have lost or replaced.

At this point, you have control over your account in a way that is extremely resistent to known attacks.

But, to fully realize the power of Keybase, it's important to prove this account really belongs to you.

Proofs are one way to do this. Explain proofs. Maybe explain signing. Telling people in person is another way.

Friends can also follow you. This is a bit different than following on Twitter, but it's a similar concept. When you follow someone on Keybase, you're signing their identity (series of events), which helps prove to others that their identity hasn't been tampered with. Over time, this provides a lot of trust that your account has not been compromised, because it would require someone to compromise your account for a long period of time. The longer the period of time, the less likely someone could keep it up.

Over time, this guarantees to your friends that your Keybase account is you, and better, to future friends that your Keybase account is you.

We provide secure communication tools for individuals and teams.

In this chapter, we'll explain how Keybase does more than keep your secrets secret, exploring topics like [proofs](/people/proofs), [devices](/people/devices), and [following](/people/following).

{# Note: this is a helpful explanation of identity that most non-technical users might understand: https://www.quora.com/What-is-Keybase-in-laymans-terms #}

## TODO

We need to explain what signing is. Just crypto magic to guarantee something doesn't change? Tripwire analogy? "The first thing that came to mind is "snapshot". Like, snapshotting a person's identity at this point in time. This conveys that it's something that could change the road, but that you have a historical piece of evidence to compare those changes to."To my understanding, "tracking" is more like "pinning". You pin a key of somebody else and remember it.

> When you generate a key pair, it's completely arbitrary which one you choose to be the public key, and which is the private key. If you encrypt with one, you can decrypt with the other - it works in both directions.
>
> So, it's fairly simple to see how you can encrypt a message with the receiver's public key, so that the receiver can decrypt it with their private key.
>
> A signature is proof that the signer has the private key that matches some public key. To do this, it would be enough to encrypt the message with that sender's private key, and include the encrypted version alongside the plaintext version. To verify the sender, decrypt the encrypted version, and check that it is the same as the plaintext."

[what do we trust Keybase with?](https://github.com/keybase/keybase-issues/issues/78)
