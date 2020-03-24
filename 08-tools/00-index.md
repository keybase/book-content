{% set section_title = "Tools" %}
{% set section_subtitle = "Encrypt, decrypt, sign, and verify messages and files." %}

# Keybase Tools
Everywhere else in Keybase, encryption, decryption, signing, and verifying happen seamlessly. All you see are messages and files that you can read or store, safely and securely, within Keybase. 

But, you can also encrypt, decrypt, sign, and verify messages and files that need to exist outside of Keybase but remain safe and secure. 

Messages and files that have been encrypted or signed through Keybase are converted into a Keybase format called [Saltpack](https://saltpack.org/) (you’ll see Saltpack in the file names). 

Among other things, this allows you to encrypt or sign messages or files and then share or store them safely anywhere. You can decrypt and verify messages and files from others.

## Encrypting
Encrypt a message or file you want to share with someone specific. Just copy and paste, type it right in, drag and drop, or find a file. Keybase will use your recipient’s public key to encrypt the message or file so only they can decrypt and read it. 

You can encrypt something for anyone using their Keybase, Twitter, Facebook, GitHub, Reddit, or Hacker News username. If they’re not on Keybase yet, they’ll need an account before they can decrypt it. 

An encrypted message can be copied and pasted or exported so you can easily store or share it anywhere. 

The encrypted file is automatically saved alongside your original file in the Saltpack format. From there, you can put the encrypted file anywhere you like. Rest assured that only your recipient will be able to read it.

### Signing encrypted data
If you choose to sign an encrypted message or file, your private key will also be used. So, when your message is decrypted by the recipient, they’ll know for certain that you encrypted it and it hasn’t been changed by anyone else. 

If you do not sign the message or file, the recipient will be able to decrypt it but they won’t necessarily know it came from you.

## Decrypting
If someone uses Keybase to encrypt a message or file just for you, you can simply copy and paste or drag and drop it in the app to decrypt it with your private key. 

When you copy and paste, be sure to include “BEGIN KEYBASE SALTPACK MESSAGE.” and “END KEYBASE SALTPACK MESSAGE.” You may also have to remove any extra spaces that occur as a result of copying and pasting from the source.

When you decrypt something, you’ll also be able to see whether or not it’s signed by a specific person. If it is signed, their private key was used so you know that the message hasn’t been tampered with by anyone else.

## Signing
Sign messages or files when you want people to know for certain that it was encrypted by you.

If you sign a message or file, anyone who has it can decrypt it and verify that it came from you. This is different from encrypting and then choosing to sign because the ability to decrypt isn’t limited to a specific recipient. 

When you sign a message or file, your private key is used in the encryption. No one can guess your private key, but when the message or file is decrypted, they’ll be able to see that it came from you.

A signed file is automatically saved alongside your original file in the Saltpack format. From there, you can put the encrypted file anywhere you like. Your recipients will know that it came from you when they decrypt it.

## Verifying
Verify a message or file to decrypt it and see who it came from. Verifying is the inverse of signing. Anyone on Keybase can verify and decrypt a signed message. 

When you copy and paste, be sure to include “BEGIN KEYBASE SALTPACK SIGNED MESSAGE.” and “END KEYBASE SALTPACK SIGNED MESSAGE.” You may also have to remove any extra spaces that occur as a result of copying and pasting from the source.

When you verify a message or file, you’ll be able to read it, know who it came from and that it hasn’t been tampered with by anyone else. 