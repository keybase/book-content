{% set section_title = "Security" %}

## Security on Keybase
Everything you share through your Keybase account *and* your account itself are protected with public-key cryptography. 

Protecting your account confirms that you are actually *you* on Keybase—not someone who hacked or otherwise accessed your account. Instead of relying on a username and password combination and/or two-factor authentication to protect your account, Keybase uses more cryptography.

TL;DR Multiple layers of public-key cryptography ensure the security of your Keybase account. Everything you share through Keybase is end-to-end encrypted. And, key pairs link your account to your device(s) to ensure that only you can access it through your device(s).

### Public-key cryptography 
Here are some terms that will be useful to understand as we describe how public-key cryptography keeps your account and the things you share safe and secure:  

**Encryption** is the process of scrambling info or data so that it can’t be read. **Decryption** reverses the process so info or data can be read again. A **key** is part of a process—basically a ton of math that we won’t get into—that does the encrypting or decrypting.

Encryption and decryption can happen symmetrically or asymmetrically. In **symmetric encryption**, the same key is used to both scramble and unscramble the data. In **asymmetric encryption**, a **key pair**—two different keys, usually a public and a private key—are used.

A **public key** is widely published so anyone can access it. It’s usually used to encrypt data. A **private key** is private and usually used to decrypt data. A public key cannot be used to try and guess or hack a private key. 

More so, Keybase uses **256-bit encryption**. This means someone would have to try more than 115 quattuorvigintillion possible keys to hack your private key. Not even a hundred thousand computers could try all those keys in trillions of years. 

#### Public keys keep private info safe
This makes it safe for your public key to be public, as it is on Keybase. 

Keeping your public key public allows your contacts to safely and easily share encrypted info with you without having to rely on other—potentially unsafe—channels. 

For extra security, your private keys are **only** stored on the device(s) you use Keybase on. (A new key pair is created for every device you add to your account. Learn more on the [blog](https://keybase.io/blog/keybase-new-key-model).) They’re not even stored on Keybase’s servers. 

Your contacts can simply encrypt using your public key and you can decrypt with your private key. On Keybase, this end-to-end encryption and decryption happen automatically in [Chat](/chat), [Files](files), [Teams](/teams), [Sites](/sites), [Wallet](/wallet), and [Git](/git). 

### End-to-end encryption
Every message or file you share or receive through Keybase is end-to-end encrypted using your public and private keys. No one else can read them—not even Keybase.

Public-key cryptography also powers secure websites (those with URLS that start with https://), emails sent with the PGP protocol, and cryptocurrencies like Lumens. But, the information you share on secure websites or in emails is only as secure as your account—or as the username and password—you use to access them. 

Thank goodness your Keybase account is more secure than that.

### Trustworthy accounts
Lots of apps only require a username and password to establish an account. Your username theoretically lets others know that an account belongs to you. And your password theoretically allows only you to access it. 

But with just a username and password, accounts can be hacked, phished, and otherwise compromised. They’re not totally trustworthy. In best-case scenarios, you can use two-factor authentication for more security but it’s still not perfect. 

Keybase uses encryption instead. You can learn more about how public-key cryptography protects your account in [Your Account](/account). 

The important thing is that for an account to be trustworthy, your contacts have to be sure that an account belongs to you and that only you can access your account. 

On Keybase you prove an account belongs to you through [proofs](/account/proofs) and [following](/account/following). These are public actions that help confirm who you are. As the name “proof” implies, these actions are also provable. Your contacts don’t have to trust that you’re you just because you say you are; they can see for themselves.

You can only access your Keybase account through [devices](/account/devices) you’ve added to your account. Keybase creates a key pair between each device and your account. So long as only you have access to your device(s), only you have access to your account. 




