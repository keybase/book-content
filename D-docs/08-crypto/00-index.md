
# Keybase Crypto Documents

Here is a collection of documents describing the crypto at play throughout the
Keybase system.

## Core Security

[This document](/docs/server) describes our high-level approach to system security: namely, that Keybase clients take hints and raw data from our server, but mistrust it, and check all of its work.

We posted a [follow-on public document](/docs/server/merkle_root_in_bitcoin_blockchain) describing how we use the bitcoin blockchain to enhance security guarantees.

As we launched per-device secret keys, we posted another [document](/docs/sigchain) describing the specifics of user signature chains, and how users go about delegating authority to new keys and revoking old keys.

## Key Exchange

When users provision new devices, they exchange keys so that the existing device signs the new device into operation, and the new device gets access to some secret data that otherwise would only be available if the user entered her passphrase (which we try to avoid on mobile devices).  This [document](/docs/crypto/key-exchange) describes the protocol, but will eventually be public once the protocol is reviewed.

## Local Key Storage (LKS)

A usability requirement of Keybase is that the user only should have to remember one passphrase, and if that passphrase changes on one device, all other devices to immediately reflect that change.  In general, we are trying to make light use of passphrases, but for certain operations like locking local secret keys, passphrases can be unavoidable. This [document](/docs/crypto/local-key-security) describes the local-key security system.

## File System

The Keybase File system (KBFS) is now in active development and will be our first product launch. This [document](/docs/crypto/kbfs) describes the cryptographic decisions in the design.  This document also touches on our plan for organizations, which isn't yet in development.


{##

## Account Corner Cases

How do users change passwords, deal with lost devices, change e-mail addresses, etc?  These issues are all related, and covered in this [document](/docs/crypto/account-corner-cases) on "account corner cases."

##}


## SaltPack Message Format

We want something like PGP messages but simpler, more modern, and easier to
implement. The two important cases we cover now are [authenticated-encrypted
messages](https://saltpack.org/encryption-format-v2) and [publicly signed
statements](https://saltpack.org/signing-format-v2). We call this system
"SaltPack", since it's half [NaCl](http://nacl.cr.yp.to/) and half [message
pack](http://msgpack.org). More details at [saltpack.org](https://saltpack.org).
