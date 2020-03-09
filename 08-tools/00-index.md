{% set section_title = "Tools" %}
{% set section_subtitle = "Encrypt, decrypt, sign, and verify messages and files." %}

# Keybase Tools
Everywhere else in Keybase, encryption, decryption, signing, and verifying happen seamlessly. All you see are messages and files that you can read or store, safely and securely, within Keybase. 

But, you can also encrypt, decrypt, sign, and verify messages and files that need to exist outside of Keybase but remain safe and secure. 

Messages and files that have been encrypted or signed through Keybase are converted into a Keybase format called [Saltpack](https://saltpack.org/). Among other things, this allows you to encrypt or sign messages or files and then share or store them safely anywhere. You can also decrypt and verify to unscramble Saltpack messages and files from others.

## Encrypt
Encrypt a message or file you want to share with someone specific. Just copy and paste, type it right in, drag and drop or find a file. Keybase will use your recipient’s public key to encrypt the message or file so no one else can read it. 

You can encrypt something for anyone using their Keybase, Twitter, Facebook, GitHub, Reddit, or Hacker News username. But if they’re not on Keybase yet, they’ll need an account before they can decrypt it. 

If you choose to sign an encrypted message or file, your private key will also be used. So, when your message is decrypted by the recipient, they’ll know for certain that you encrypted it and it hasn’t been changed by anyone else. If you do not sign the message or file, the recipient will be able to decrypt it but they won’t necessarily know it came from you.

An encrypted message can be copied and pasted or exported as a text file so you can easily store or share it anywhere. 

An encrypted file is automatically saved alongside your original file in the Saltpack format. From there, you can put it anywhere you like and rest assured that only your recipient will be able to read it.

## Decrypt
If someone uses Keybase to encrypt a message or file just for you, you can simply copy and paste or drag and drop it in the app to decrypt it with your private key. You’ll know if someone used Keybase to encrypt a message or file because it will be called a Saltpack message or file.

When you copy and paste, be sure to include “BEGIN KEYBASE SALTPACK MESSAGE.” and “END KEYBASE SALTPACK MESSAGE.”. You may also have to remove any extra spaces that occur as a result of copying and pasting from the source.

When you decrypt something, you’ll also be able to see whether or not it’s signed by a specific person. If it is signed, their private key was used so you know that the message hasn’t been tampered with by anyone else.

## Sign
Sign messages or files when you want people to know for certain that you created them.

If you sign a message or file, anyone who has it can decrypt it and verify that it came from you. This is different from encrypting and then choosing to sign because the ability to decrypt it isn’t limited to a specific recipient. 

When you sign a message or file, your private key is used in the encryption. No one can guess your private key, but when the message or file is decrypted, they’ll be able to see that from you.

A signed file is automatically saved alongside your original file in the Saltpack format. From there, you can put it anywhere you like and rest assured that only your recipient will be able to read it and know that it was created by you.

## Verify
Verify a message or file to decrypt it and see who created it. Verifying is basically the inverse of signing. You’ll know if someone used Keybase to sign a message or file because it will be called a Saltpack message or file.

When you copy and paste, be sure to include “BEGIN KEYBASE SALTPACK SIGNED MESSAGE.” and “END KEYBASE SALTPACK SIGNED MESSAGE.”. You may also have to remove any extra spaces that occur as a result of copying and pasting from the source.

When you verify a message or file, you’ll be able to read it, know who created it, and that it hasn’t been tampered with by anyone else. 





