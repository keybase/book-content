{% set section_title = "Security" %}

## Public-key cryptography 
TL;DR Public-key cryptography makes it easy for you to securely share or store anything you want on Keybase.

Here are some terms that will be useful to understand as we describe how public-key cryptography keeps your account and the things you share safe and secure:  

**Encryption** is the process of scrambling info or data so that it can’t be read. **Decryption** reverses the process so info or data can be read again. A **key** is used in the process—basically a ton of math that we won’t get into—of encrypting or decrypting.

Encryption and decryption can happen symmetrically or asymmetrically. In **symmetric encryption**, the same key is used to both scramble and unscramble the data. In **asymmetric encryption**, a **key pair**—two different keys, usually a public and a private key—are used.

A **public key** is widely published so anyone can access it. It’s usually used to encrypt data. A **private key** is private and usually used to decrypt data. A public key cannot be used to try and guess or hack a private key.  

### Public and private key security
Keybase uses **256-bit encryption**. This means someone would have to try more than 115 quattuorvigintillion possible keys to hack your private key. Not even a hundred thousand computers could try all those keys in trillions of years.

This makes it safe for your public key to be public, as it is on Keybase. Keeping your public key public allows your contacts to safely and easily share encrypted info with you without having to rely on other—potentially unsafe—channels. 

When you and your contacts use Keybase, they encrypt using your public key and you can decrypt with your private key. On Keybase, this end-to-end encryption happens automatically in [Chat](/chat), [Files](files), [Teams](/teams), [Sites](/sites), [Wallet](/wallet), and [Git](/git). 

For extra security, your private keys are **only** stored on the device(s) you use Keybase on. They’re not even stored on Keybase’s servers. So if Keybase gets hacked, the security of your account isn’t compromised. 

(A new key pair is created for every device you add to your account. Learn more on the [blog](https://keybase.io/blog/keybase-new-key-model).) 

## End-to-end encryption
Every message or file you share or receive through Keybase is end-to-end encrypted using your public and private keys. No one else can read them—not even Keybase.

Public-key cryptography is also used to encrypt information shared through secure websites (those with URLS that start with https://), emails sent with the PGP protocol, and cryptocurrencies like Lumens. But, the information you share on secure websites or in emails is only as secure as your account—or as the username and password—you use to access them. 

Thank goodness your [Keybase account](/account) is more secure than that, thanks to more public-key cryptography.

### Reviewed by global cyber security experts 
Read the 2018 report by NCC Group, the global cyber security and risk mitigation experts: [Keybase Protocol Security Review](https://www.nccgroup.trust/us/our-research/keybase-protocol-security-review/).
{# Henry: can the above blurb be offset/look special like the TL;DR and Tip blurbs? TODO: can we talk about the report in a way that validates Keybase without asking people to read the report? E.g. some sort of rating or quick summary? #}







