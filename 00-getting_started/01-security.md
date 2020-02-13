{% set section_title = "Security" %}

## Security on Keybase
Public-key cryptography protects your files, messages, *and* your account itself on Keybase. Protecting your account is important because it’s basically your online identity. It confirms that you are actually *you*—not someone who hacked or otherwise accessed your account. 

## Keybase uses public-key cryptography
Before we get into the details of how this works, let’s define some terms that will be useful to understand. **Encryption** is the process of scrambling data or info so that it can’t be read. **Decryption** reverses that so data can be read again. A **key** is the process—basically a ton of math that we won’t get into—that does the encrypting or decrypting.

Encryption and decryption can happen symmetrically or asymmetrically. In **symmetric encryption**, the same key is used to both scramble and unscramble the data. In **asymmetric encryption**, a pair of two different keys, usually, a public and a private key are used: one for scrambling the data and another for unscrambling. 

A **public key** is widely published so anyone can access it. It’s usually used to encrypt data. A **private key** is private and usually used to decrypt data. A public key cannot be used to try and guess or hack a private key. 

More so, Keybase uses **256-bit encryption**. This means someone would have to try more than 115 quattuorvigintillion possible keys to hack your private key. Not even a hundred thousand computers could try all those keys in trillions of years. 

Now, we’ll tell a short story to show why all this is useful.

#### Public keys keep private info safe
{# illo: Piece of paper with a message or something that looks like a credit card number on it —> dotted line to a public key (a key that is labeled Mary Poppins’s public key) —> dotted line to the same piece of paper but with scrambled/indecipherable data on it —> dotted line to another key (labeled Mary Poppins’s private key) —>  same piece of original paper with unscrambled message on it #}

Say you need to share a top secret message with Mary Poppins,  over the internet. If you used symmetric encryption, both of you would need to have the same key. If you met in person, sharing the key would be easy. But if you tried to share the key over the open internet, someone could intercept it and then also be able to decrypt and access your top secret message. 

If you used asymmetric encryption, you could encrypt the message using a public key and Ms. Poppins could decrypt it using her private key. You just need to be absolutely sure that Mary Poppins is really Mary Poppins. Thankfully, she has a Keybase account (or at least we’re pretending she does for the sake of this story). 

### Keybase accounts are trustworthy
![](/img/kb-signup.png)
{# illo need: Update this one. Form should be a nice form with Username, Password, and Confirm Password labels above the fields. Fields completed with username marypoppins (or whatever example we want to use) and password ********. Draw lines from the username and password fields with arrows pointing to Mary Poppins (similar to illo on Devices but just use arrows pointing and no lock symbol - maybe even dotted lines?) to indicate that these pieces of information = Mary Poppins. #}
On Keybase, your account is basically your identity. Not in the sense of who you are as a human—that’d be weird. More simply, people can be sure that you are you on Keybase.

Lots of other places online only require that you use a username and password to establish a potentially secure and trustworthy online identity. You and others may assume that the account belongs to you—thanks to your username—and that only you can access it—thanks to your password.

But, even if you use the same username everywhere, your friends can’t know for sure that it’s really you. And for example, it’d be hard to be certain that Mary Poppins is the person who gets email at mary.poppins@email.com unless she told you so in person. Over time, you can build trust with usernames by using them. But that’s all wiped out if you’re hacked. 

Passwords are even less effective. If you want an account to actually be secure, you need a strong, random password. You may also set up multi-factor authentication. So even if your password is compromised, your account might not be. But with just a password, your account can easily be compromised. And that’s bad. People can’t be totally sure that you’re really you.

### Cryptography provides better security
Instead of a username and password, Keybase uses cryptography. 

When you create your account, Keybase creates a key pair. The public key is uploaded to Keybase’s servers and is publicly available. The private key lives only on your device. This means that no one else can access your account without having your device (not even Keybase). 

#### Devices, proofs, and following provide more protection
When you add additional devices or paper keys to your account, each one also gets a key pair. So, no one else can compromise your account without having all of your devices and paper keys. This guarantees that only you have access to your account. 

You further prove that an account belongs to you through [proofs](/account/proofs) and [following](/account/following), which are also bolstered by cryptography. 

All of these actions—adding devices and paper keys, adding proofs, and following–are also publicly recorded so anyone can double-check them. 

So, you—and the people you interact with—can see that your Keybase account is much more secure and trustworthy than other online accounts. Phew.

### Messages and files are encrypted
On top of all that, every message or file on Keybase is end-to-end encrypted using a public key and decrypted using a private key. Think of Keybase as a lockbox: anyone can drop something in your lockbox using your public key. But only you can retrieve what’s in the lockbox using your private key. 

Public-key cryptography also powers secure websites (those with URLS that start with https://), emails sent with the PGP protocol, and cryptocurrencies like Lumens. But, the information you share on secure websites or in emails is only as secure as your identity or account—or as the username and password—you use to access them. 

Thank goodness you know your Keybase account is more secure than that.