# Devices

Note: Users can sign up on the website, without a key, which makes the account (until at least one device is added) pretty weak—as weak as any other online account.

When you sign up for Keybase, you ideally sign up with the Keybase app on a device such as your phone or computer. Strong cryptography guarantees an association between your account and the device you signed up with.

DIAGRAM: Keybase account ---lock--- Device

This is very secure, unless you lose the device you signed up with. To make it more secure, you should add another device to your account. You can do this by installing Keybase on another device, entering your username, and then scannning a QR code.

```
DIAGRAM: Keybase account ---lock--- Device
                     \___lock___ Device         
```
Note: What's happening when you do this is that the new device generates another key pair, the new public key is added to your account, and both private keys are used to prove this.

You should also create at least one paper key, which you should store somewhere like a locked drawer.

Now, as long as you don't lose access to all of your devices (and paper keys) at the same time, you can remove any device that you have lost or replaced, and you can add any new device that you might buy in the future.

At this point, you have control over your account in a way that is extremely reliable and trustworthy.

## FAQ per section?

Possible Questions:
* When do I need a Keybase password? (Passwords are used to encrypt your private key on a device if/when you log out of Keybase.)
* Why does Keybase not have MFA?

## Scraps

Devices are effectively keys. When you send a message from your phone, for example, that message is encrypted using the private key on your phone, and the corresponding public key is verifiably part of your Keybase identity.
