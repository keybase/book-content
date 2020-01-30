{% set section_title = "Security" %}

## Protect your data and identity
Keybase uses public-key cryptography to protect both your files and messages *and* your account itself. Protecting your account is important because it’s basically your online identity. It confirms that you are actually *you* — not someone who hacked or otherwise accessed your account. 

### Your account is your identity
![](/img/kb-signup.png)
{# illo need: Update this one. Form should be a nice form with Username, Password, and Confirm Password labels above the fields. Fields completed with username marypoppins (or whatever example we want to use) and password ********. Draw lines from the username and password fields with arrows pointing to Mary Poppins (similar to illo on Devices but just use arrows pointing and no lock symbol - maybe even dotted lines?) to indicate that these pieces of information = Mary Poppins. #}

Often, a username and password are all you need to create an online account. You create a username so you have a friendly way to claim the account as your own. You create a password so no one else can access it. 

Together, a username and password help establish a potentially secure and trustworthy online identity. You and others may assume that the account belongs to you and that only you can access it.

But, usernames are only somewhat effective. Even if you use the same username everywhere, your friends can’t know for sure that it’s really you. Over time, you can build trust by linking to your account from your personal website or other established accounts (like your Twitter or Instagram), or by telling people in person.

Passwords are less effective. If you want an account to actually be secure, you likely use a password manager to generate a strong, random password. You may also set up multi-factor authentication; so even if your password is compromised, your account might not be. But with just a password, your account — and with it, your identity — can easily be compromised. 

### Encryption provides exponential security
You don’t need a password on Keybase because your account is protected with layers of encryption. Creating an account on Keybase establishes an online identity that’s much more  trustworthy than most other accounts. Your friends, family, and other contacts can be sure that you are who you say you are on Keybase.

#### Keybase uses asymmetric, 256-bit encryption
Before we get into the details of how this works, let’s define some terms that will be useful to understand. **Encryption** is the process of scrambling data or info so that it can’t be read. **Decryption** reverses that so data can be read again. A **key** is the process — basically a ton of math that we won’t get into — that does the encrypting or decrypting.

Encryption and decryption can happen symmetrically or asymmetrically. In **symmetric encryption**, the same key is used to both scramble and unscramble the data. In **asymmetric encryption**, a pair of two different keys, usually, a public and a private key are used: one for scrambling the data and another for unscrambling. 

A **public key** is widely published so anyone can access it. It’s usually used to encrypt data. A **private key** is private and usually used to decrypt data. A public key cannot be used to try and guess or hack a private key. 

More so, Keybase uses 256-bit encryption. Someone would have to try more than 115 quattuorvigintillion possible keys to hack your private key. Not even a hundred thousand computers could try all those keys in trillions of years. 

That is really secure. But in case you’re not convinced, we’ll tell a short story to show why this is useful.

{# illo: Piece of paper with a message or something that looks like a credit card number on it —> dotted line to a public key (a key that is labeled Mary Poppins’s public key) —> dotted line to the same piece of paper but with scrambled/indecipherable data on it —> dotted line to another key (labeled Mary Poppins’s private key) —>  same piece of original paper with unscrambled message on it #}

Say you need to share a top secret message with Mary Poppins,  over the internet. If you used symmetric encryption, both of you would need to have the same key. If you met in person, sharing the key would be easy. But if you tried to share the key over the internet, anyone could intercept it and then also be able to decrypt and access your top secret message. 

If you used asymmetric encryption, you could encrypt the message using a public key and Ms. Poppins could decrypt it using her private key. You just need to be absolutely sure that Mary Poppins is really Mary Poppins. Thankfully, for the purposes of this story, at least, she has a Keybase account. You can send her your top secret message by finding her and chatting her on Keybase.

### Messages and files are encrypted
Every message or file on Keybase is encrypted using a public key and decrypted using a private key. If think of Keybase as a lockbox: anyone can drop something in your lockbox using your public key. But only you can retrieve what’s in the lockbox using your private key. 

Public-key cryptography also powers secure websites (those with URLS that start with https://), emails sent with the PGP protocol, and cryptocurrencies like Lumens. But, the information you share on secure websites or in emails is only as secure as your identity or account — or as the username and password you use to access them. 

### Accounts are also encrypted
{# illo: need to think this through more but would be nice to have something that shows something like a lockbox inside of a lockbox. The outer lockbox is your encrypted account (maybe show the two keys, one on your device and one on Keybase’s server) and the inter lockbox contains the encrypted messages and files you send (maybe also show the keys encrypting and decrypting your messages). #}

Instead of relying on usernames and passwords to protect your account — your identity — Keybase uses more cryptography. 

#### Devices, proofs, and following provide even more protection
When you create your account, Keybase creates a key pair. The public key is uploaded to Keybase’s servers and is publicly available. The private key lives only on your device. This means that no one else can access your account without having your device (not even Keybase). If you add additional devices to your account, [each one of those devices also gets a key pair]. So, no one else can compromise your account without having all of your devices. This guarantees that only you have access to your account, your “lockbox,” or more importantly — your identity. 

You further prove that an account belongs to you through [proofs](/account/proofs) and [following](/account/following), which are also protected by cryptography. 

But now you know, your Keybase account is much more secure and trustworthy than other online accounts.


