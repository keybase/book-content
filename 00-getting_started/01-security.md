{% set section_title = "Security" %}

## Security on Keybase
To protect your files, messages, *and* your account itself, Keybase uses public-key cryptography. 

Protecting your account is key to confirming that you are actually *you* on Keybase—not someone who hacked or otherwise accessed your account. 

TL;DR Multiple layers of public-key cryptography ensure the security of your Keybase account. Instead of relying on a username and password, your account is cryptographically linked directly to your device. 

### Keybase uses public-key cryptography 
Here are some terms that will be useful to understand as we describe how public-key cryptography keeps your account and the things you share safe and secure:  

**Encryption** is the process of scrambling info or data so that it can’t be read. **Decryption** reverses that so info or data can be read again. A **key** is the process—basically a ton of math that we won’t get into—that does the encrypting or decrypting.

Encryption and decryption can happen symmetrically or asymmetrically. In **symmetric encryption**, the same key is used to both scramble and unscramble the data. In **asymmetric encryption**, a pair of two different keys—usually a public and a private key—are used.

A **public key** is widely published so anyone can access it. It’s usually used to encrypt data. A **private key** is private and usually used to decrypt data. A public key cannot be used to try and guess or hack a private key. 

More so, Keybase uses **256-bit encryption**. This means someone would have to try more than 115 quattuorvigintillion possible keys to hack your private key. Not even a hundred thousand computers could try all those keys in trillions of years. 

#### Public keys keep private info safe
So, on Keybase your private key is very secure. This makes it safe for your public key to be public, as it is on Keybase. 

Keeping your public key public allows your contacts to safely and easily share encrypted info with you without having to rely on other—potentially unsafe—channels. 

Your contacts can simply encrypt using your public key and you can decrypt with your private key. On Keybase, this encryption and decryption happen seamlessly in [Chat](/chat), [Files](files), [Teams](/teams), [Sites](/sites), [Wallet](/wallet), and [Git](/git). 

Your contacts just need to be sure that you are you on Keybase. In other words, your account needs to be trustworthy.

### Devices, proofs, and following help make your Keybase account trustworthy
To be sure that your Keybase account is trustworthy, your contacts need to know that your account belongs to you and that only you have access to it.

Lots of online accounts require a username and password to accomplish this. Your username theoretically lets others know that an account belongs to you. And your password theoretically allows only you to access it. You can use two-factor authentication for more security with a password but it’s still not perfect. (*[WIRED](https://www.wired.com/story/keybase-two-factor-authentication/)* has a nice explanation.) 

Keybase uses encryption instead. Your account is cryptographically linked to the device you sign up with and any other devices you add to your account. You can learn more about how this works in [Devices](/devices).

Basically, this ensures that your account can only be accessed through your device. So long as only you have access to your device, only you have access to your account. 

You prove that an account belongs to you through [proofs](/account/proofs) and [following](/account/following). 

All of these actions—adding devices and paper keys, adding proofs, and following–are also publicly recorded. Anyone can double-check them. 

So, you and your contacts can see that your Keybase account is yours and that only you have access to it. Phew.

### Messages and files are encrypted
On top of all that, every message or file on Keybase is end-to-end encrypted using a public key and decrypted using a private key. 

Public-key cryptography also powers secure websites (those with URLS that start with https://), emails sent with the PGP protocol, and cryptocurrencies like Lumens. But, the information you share on secure websites or in emails is only as secure as your identity or account—or as the username and password—you use to access them. 

Thank goodness you know your Keybase account is more secure than that.



