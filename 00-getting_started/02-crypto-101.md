{% set section_title = "Crypto 101" %}

## Protect your identity and your data
Your Keybase account is super secure because it uses public-key cryptography to protect both the files and messages you share and receive *and* your account itself. Protecting your account is important because it’s basically your identity. It confirms that you are actually *you* on the internet. 

To help explain how your Keybase account is so secure, we’ll start with a closer look at how most other online accounts work.

### Passwords are only kinda secure
![](/img/kb-signup.png)
{# illo need: Update this one. Form should be a nice form with Username, Password, and Confirm Password labels above the fields. Fields completed with username marypoppins (or whatever example we want to use) and password ********. Draw lines from the username and password fields with arrows pointing to Mary Poppins (similar to illo on Devices but just use arrows pointing and no lock symbol - maybe even dotted lines?) to indicate that these pieces of information = Mary Poppins. #}

Elsewhere online, a username and password are all you need to create an account. You create a username so you have a friendly way to refer to your account and establish identity. You create a password so no one else can access your account. 

Together, a username and password help establish a somewhat trustworthy online identity. To have a totally trustworthy account, you and others need to know that an account belongs to you, and that only you can access that account.

Usernames are somewhat effective. But, even if you mostly use the same username everywhere, your friends can’t know for sure that it’s really you at first. Over time, you can establish trust by linking to your account from your personal website or other established accounts, or by telling people in person.

Passwords are less effective. If you want an account to actually be secure, you likely use a password manager to generate a strong, random password. You may also set up multi-factor authentication. So even if your password is compromised, your account might not be. But with just a password, an online account or identity can easily be compromised. 

You don’t actually need a password on Keybase because your account and identity are built differently — and are actually secure.

### Public-key encryption is more secure
Before we get into the details, let’s define some terms that will be useful to understand. Encryption is the process of scrambling data or info so that it can’t be read. Decryption reverses that so data can be read again. 

Encryption and decryption can happen symmetrically or asymmetrically. In symmetric encryption, the same key, or process, is used to both scramble and unscramble the data. In asymmetric encryption, a pair of two different keys are used: one for scrambling the data and another for unscrambling. It takes a ton of math to make this happen, but we won’t get into that. For now, we’ll use a short story to show how this works.

{# illo: Piece of paper with a message or something that looks like a credit card number on it —> dotted line to a public key (a key that is labeled Mary Poppins’s public key) —> dotted line to the same piece of paper but with scrambled/indecipherable data on it —> dotted line to another key (labeled Mary Poppins’s private key) —>  same piece of original paper with unscrambled message on it #}

Say you need to share a top secret message with Mary Poppins,  over the internet. If you use symmetric encryption, both of you need to have the same key to encrypt and decrypt the information. If you met in person, sharing the key would be easy (plus, you could shake her hand!). But over the open internet, anyone could intercept the key and then also be able to decrypt and access your top secret message. If you use asymmetric encryption, you could encrypt the message using one key of a pair and Ms. Poppins could decrypt it using the other. You could even use Ms. Poppin’s public key — a key that anyone has access to — to encrypt. (You just needs to be absolutely sure that Mary Poppins is really Mary Poppins. Learn about that in [Proofs](/proofs).) Ms. Poppins would then decrypt it using her private key — one that only she has access to. Keybase uses this asymmetric, public-key cryptography. 

#### Messages and files shared on Keybase are encrypted
Every message or file that’s sent through Keybase is encrypted using a public key and decrypted using a private key. You can think of your account as a lockbox. Anyone can drop something in your lockbox using your public key. But only you can retrieve what’s in the lockbox using your private key. 

Public-key cryptography also powers secure websites (those with URLS that start with https://), emails sent with the PGP protocol, and cryptocurrencies like Lumens. But, the information you share on secure websites or in emails is only as secure as the username and password you use to access them. 

#### Keybase accounts are also encrypted
{# illo: need to think this through more but would be nice to have something that shows something like a lockbox inside of a lockbox. The outer lockbox is your encrypted account (maybe show the two keys, one on your device and one on Keybase’s server) and the inter lockbox contains the encrypted messages and files you send (maybe also show the keys encrypting and decrypting your messages). #}

Instead of relying on usernames and passwords to protect your account and your private key, Keybase uses more cryptography. When you create your account, Keybase creates a key pair. The public key is uploaded to Keybase’s servers and is publicly available. The private key lives only on your device. This means that no one else can access your account without having your device (not even Keybase). If you add additional devices to your account, [each one of those devices also gets a key pair]. So, no one else can compromise your account without having all of your devices. This guarantees that only you have access to your “lockbox.” 

You further prove that an account belongs to you through [proofs](/account/proofs) and [following](/account/following), which are also supported by strong cryptography. More on that soon.

But now you know, your Keybase account is much more secure and trustworthy than other online accounts.


