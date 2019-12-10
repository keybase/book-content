{% set section_title = "Your Account" %}

## Your Keybase account is super, super secure
TL;DR: Accounts protected by a username and password are only somewhat secure. Your Keybase account is super secure because it’s cryptographically linked to the device(s) you install the app on and to other actions, including social proofs and following. Any messages or files you share are also asymmetrically encrypted and decrypted using public and private keys. 

{# Would be nice to format this differently than other text on this page #}

Your Keybase account is way more secure than most other online accounts, thanks to strong cryptography. To help explain how your Keybase account is so secure, we’ll start with a closer look at how most other online accounts work.

![]({{url_for("static", filename="img/kb-signup.png")}})
{# illo need: Update this one. Form should be a nice form with Username, Password, and Confirm Password labels above the fields. Fields completed with username marypoppins (or whatever example we want to use) and password ********. Draw lines from the username and password fields with arrows pointing to Mary Poppins (similar to illo on Devices but just use arrows pointing and no lock symbol - maybe even dotted lines?) to indicate that these pieces of information = Mary Poppins. #}

### Passwords are only kinda secure
Elsewhere online, a username and password are all you need to create an account. You create a username so you have a friendly way to refer to your account and establish identity. You create a password so no one else can access your account. 

Together, a username and password help establish a somewhat trustworthy online identity. To have a totally trustworthy account, you and others need to know that an account belongs to you, and that only you can access that account.

Usernames are somewhat effective. But, even if you mostly use the same username everywhere, your friends can’t know for sure that it’s really you at first. Over time, you can establish trust by linking to your account from your personal website or other established accounts, or by telling people in person.

Passwords are less effective. If you want an account to actually be secure, you likely use a password manager to generate a strong, random password. You may also set up multi-factor authentication, so even if your password is compromised, your account might not be. But with just a password, your online identity can easily be compromised. 

You don’t actually need a password on Keybase because your trustworthy identity is built differently — and is actually secure.

### Public-key encryption is more secure
Before we get into this, let’s define some terms that will be useful to understand. Encryption is the process of scrambling data or info so that it can’t be read. Decryption reverses that so data can be read again. 

Encryption and decryption can happen symmetrically or asymmetrically. In symmetric encryption, the same key, or process, is used to both scramble and unscramble the data. In asymmetric encryption, two different keys are used: one for scrambling the data and another for unscrambling. It takes a ton of math to make this happen, but we won’t get into that. For now, we’ll use a short story to show how this works.

Say two people, Alice and Bob, need to share a credit card number over the internet. If they use symmetric encryption, they both need to have the same key to encrypt and decrypt the information. If they met in person, sharing the key would be easy. But over the open internet, anyone could intercept the key and then also be able to decrypt and access the credit card number. If Alice and Bob use asymmetric encryption, Alice could encrypt the number using one key and Bob could decrypt it using another. Alice could even use Bob’s public key — a key that anyone has access to — to encrypt. (Alice just needs to be absolutely sure that Bob is really Bob. Learn about that in [Proofs](/proofs).) Bob would then decrypt it using his private key — one that only he has access to. Keybase uses this asymmetric, public-key cryptography. 

Every message or file that’s sent through Keybase is encrypted using a public key and decrypted using a private key. You can think of your account as a lockbox. Anyone can drop something in your lockbox using your public key. But only you can retrieve what’s in the lockbox using your private key. 

Public-key cryptography also powers secure websites (https://), emails sent with the PGP protocol, and cryptocurrencies like Lumens. But, the information you share on secure websites or in emails is only as secure as the username and password you use to access them. 

So, instead of relying on usernames and passwords to protect your private key, Keybase uses more cryptography. When you create a Keybase account, cryptography links your account with the device you signed up with. This means that no one else can access your account without having your device. If you add additional devices to your account, no one else can compromise your account without having all of your devices. This guarantees that only you have access to your “lockbox.” 

{# Is the encryption that links your account to your device also asymmetric? Could use a better explanation of how this works.#}

You further prove that an account belongs to you through [proofs](/account/proofs) and [following](/account/following), which are also supported by strong cryptography.

As a result, your Keybase account is much more secure and trustworthy than other online accounts.
