{% set section_title = "Your Account" %}

Elsewhere online, a username and password are a standard way to establish an account and with that, a somewhat trustworthy identity. You create a username so you have a friendly way to refer to your account and establish identity. You create a password so no one else can access your account.

![]({{url_for('static', filename='img/kb-signup.png')}})

These two concepts are important to online identity: others need to trust that an account belongs to you, and that only you can access that account.

Usernames are somewhat effective for establishing identity. But, even if you mostly use the same username everywhere, your friends can’t know for sure that it’s really you at first. Over time, you can establish trust by linking to your account from your personal website or other established accounts, or by telling people in person, etc.

Passwords are less effective. If you want an account to actually be secure, you likely use a password manager to generate strong, random passwords for every account. You may also set up multi-factor authentication, so even if your password is compromised, your account might not be.

Keybase improves upon both of these concepts in significant ways.

![]({{url_for('static', filename='img/kb-one-device.png')}})

When you create a Keybase account, strong cryptography guarantees an association between your account and the device you signed up with. This means that no one else can access your account without having your device. If you add additional devices to your account, no one else can compromise your account without having all of your devices. You further prove that an account belongs to you through social proofs and following, both of which also rely on strong cryptography.

The result is that your Keybase account is much more secure and trustworthy than other online accounts.
