# Devices

Note: Users can sign up on the website, without a key, until at least one device is added. Chris Coyne says this is probably going away soon, so let's assume a device and key are required to establish an account.

When you sign up for Keybase, you sign up with the Keybase app on a device such as your phone or computer. Strong cryptography guarantees an association between your account and the device you sign up with.

![]({{url_for('static', filename='img/kb-one-device.png')}})

This association is guaranteed, which means the only way to lose your account is to lose your device. For this reason, a good next step is to add another device to your account. You can do this by installing Keybase on another device, providing your Keybase username, and then adding that device using the one you signed up with (using a QR code). After doing this, strong cryptography guarantees an association between your account and both devices.

![]({{url_for('static', filename='img/kb-two-devices.png')}})

Note: What's happening when you do this is that the new device generates another key pair, the new public key is added to your account, and both private keys are used to prove this.

You should also create at least one paper key, which you should store somewhere like a locked drawer. We recommend you not store a paper key on your computer, which is why we call them paper keys.

![]({{url_for('static', filename='img/kb-three-devices.png')}})

As long as you don't lose access to all of your devices (and paper keys) at the same time, you can remove any device that you have lost or replaced, and you can add any new device that you might buy in the future.

At this point, you have control over your account in a way that is extremely reliable and trustworthy. Now you're ready to let people know this account belongs to you. In the next section, you'll learn all about [proofs]().

## FAQ per section?

Possible Questions:
* Wait, I don't need a password?
* When do I need a Keybase password? (Passwords are used to encrypt your private key on a device if/when you log out of Keybase.)
* Why does Keybase not have MFA?

## Scraps

Devices are effectively keys. When you send a message from your phone, for example, that message is encrypted using the private key on your phone, and the corresponding public key is verifiably part of your Keybase identity.
