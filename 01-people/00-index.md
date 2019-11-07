# People

We provide secure communications tools for individuals and teams.

Keybase provides much more than secure end-to-end encryption. Fundamentally, what makes Keybase extra special is that we also care about the identity of people and helping you ensure you're communicating with the right people whether it's in a team chat, a shared file, or a commit to a Git repo.

In this chapter, we'll explain how Keybase does more than keep your secrets secret, exploring topics like proofs, devices, and following.

## TODO

We need to explain what signing is. Just crypto magic to guarantee something doesn't change? Tripwire analogy? "The first thing that came to mind is "snapshot". Like, snapshotting a person's identity at this point in time. This conveys that it's something that could change the road, but that you have a historical piece of evidence to compare those changes to."To my understanding, "tracking" is more like "pinning". You pin a key of somebody else and remember it.

> When you generate a key pair, it's completely arbitrary which one you choose to be the public key, and which is the private key. If you encrypt with one, you can decrypt with the other - it works in both directions.
>
> So, it's fairly simple to see how you can encrypt a message with the receiver's public key, so that the receiver can decrypt it with their private key.
>
> A signature is proof that the signer has the private key that matches some public key. To do this, it would be enough to encrypt the message with that sender's private key, and include the encrypted version alongside the plaintext version. To verify the sender, decrypt the encrypted version, and check that it is the same as the plaintext."

[what do we trust Keybase with?](https://github.com/keybase/keybase-issues/issues/78)
