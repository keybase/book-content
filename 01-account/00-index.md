{% set section_title = "Your Account" %}

Your Keybase account is way more secure than most other online accounts, thanks to strong cryptography. To help explain how your Keybase account is so secure, we’ll start with a closer look at how most other online accounts work.

![]({{url_for("static", filename="img/kb-signup.png")}})
{# Can we update this image? Form should be a nice form with Username, Password, and Confirm Password labels above the fields. Fields completed with username marypoppins (or whatever example we want to use) and password ********. Draw lines from the username and password fields with arrows pointing to Mary Poppins (similar to illo on Devices but just use arrows pointing and no lock symbol - maybe even dotted lines?) to indicate that these pieces of information = Mary Poppins. #}

Elsewhere online, a username and password are all you need to create an account. You create a username so you have a friendly way to refer to your account and establish identity. You create a password so no one else can access your account. 

Together, a username and password help establish a somewhat trustworthy online identity. To have a totally trustworthy account, you and others need to know that an account belongs to you, and that only you can access that account.

Usernames are somewhat effective for establishing identity. But, even if you mostly use the same username everywhere, your friends can’t know for sure that it’s really you at first. Over time, you can establish trust by linking to your account from your personal website or other established accounts, or by telling people in person.

Passwords are less effective. If you want an account to actually be secure, you likely use a password manager to generate a strong, random password. You may also set up multi-factor authentication, so even if your password is compromised, your account might not be. But with just a password, your online identity isn’t totally trustworthy and secure. 

You don’t actually need a password on Keybase because your trustworthy identity is built differently — and is actually secure.

When you create a Keybase account, strong cryptography associates your account with the device you signed up with. This means that no one else can access your account without having your device. If you add additional devices to your account, no one else can compromise your account without having all of your devices. You further prove that an account belongs to you through proofs and following, which are also supported by strong cryptography.

The result is that your Keybase account is much more secure and trustworthy than other online accounts.
