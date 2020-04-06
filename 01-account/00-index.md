{% set section_title = "Your Account" %}
{% set section_subtitle = "Keybase accounts are trustworthy and secure. Learn how." %}
{% set page_title = "Learn about your Keybase account" %}
{% set page_description = "Keybase accounts are protected by end-to-end encryption. Devices, proofs, and following help keep it secure. Learn how." %}

# Your Keybase Account
<div class="compose-highlight" data-text="tl;dr">Your Keybase account is secured by public-key cryptography. Installing Keybase on your computer or device, adding more devices and paper keys, adding proofs, and following all make your Keybase account more trustworthy and secure.</div>

![ !Your username, devices, proofs, and followers are visible on your Keybase profile.](/img/account-profile.png)

Your Keybase account and everything you store or share through it in [Chat](/chat), [Files](files), [Teams](/teams), [Sites](/sites), [Wallet](/wallet), and [Git](/git) are all protected with encryption.

When you create your Keybase account, it’s linked to your [devices](account/devices). You further protect your account with [proofs](account/proofs) and [following](account/following). All of these actions are backed by public-key cryptography.

You can learn more about how public-key cryptography works in [Security](/security). The gist is that, thanks to public-key cryptography your contacts can be sure your Keybase account belongs to you and that only you can access it. No phishing, spoofing, or scamming around here.

#### Devices, proofs, and following help make your Keybase account trustworthy and secure.
Lots of apps only require a username and password to create and protect an account. Your username theoretically lets others know that an account belongs to you. And your password theoretically allows only you to access it.

But with just a username and password, accounts can be hacked, phished, and otherwise compromised. They’re not totally trustworthy and secure. In best-case scenarios, you can use two-factor authentication for more security but it’s still not perfect.

Your Keybase account is trustworthy and secure because—instead of being protected by just a password—it’s cryptographically linked to your [devices](account#devices). Your account can only be accessed through your devices. So long as only you have access to your devices, only you can access your Keybase account.

You do create a username to help let others know that an account belongs to you. But you further confirm who you are with [proofs](account#proofs), which link your Keybase account to your other online accounts.

[Following](account#following) provides a public record that also confirms that you are who you say you are. Adding proofs and following are both public actions. And, as the name “proof” implies, these actions are also provable. Your contacts don’t have to trust that you’re you on Keybase just because you say you are; they can see for themselves.

Anyone can check your proofs; Keybase regularly does as well. If anything changes to your devices or proofs—indicating that your account has possibly been hacked—your contacts are notified before they interact with you.

## Usernames
<div class="compose-highlight" data-text="tip">Before you create your account, give your username some thought. Everyone on the internet can see it.</div>

#### Your username is public and can’t be changed.
Choosing your username is the first action of many that you take to help establish your account on Keybase. These actions are part of a public record that helps secure your account and confirm that you are who you say you are. Changing your username has the potential to undo this.

We know there are lots of reasons why people may need to change their usernames. And there are solutions we could implement to help people do so. But they’re complicated and, unfortunately, not something we can work on right now. In the meantime, you can learn more about this issue [on GitHub](https://github.com/keybase/keybase-issues/issues/2842#issuecomment-283706335).

#### Usernames must be lowercase letters and numbers only, with no spaces.
This format helps keep Keybase accounts secure because it makes it harder for tricksters to use visually similar names to impersonate people.

For example, if uppercase letters were allowed someone could create the account Isteele (with a capital “i”) and pretend to be lsteele (with a lowercase “L”). Spaces are not allowed for the same reason. The difference between “karen m” and “karen  m” is too subtle for people to notice the difference.

#### Deleting a username and account is permanent.
If you’ve gone to the trouble of deleting your account, we don’t want to give that username to anyone who asks for it. If undeleting were allowed, it would be hard to be sure that the person undeleting is the same person who deleted the account. 

## Devices
<div class="compose-highlight" data-text="tl;dr">You can think of your devices and paper keys as keys to your account. You can only access your account through your devices. Paper keys provide backup access to your account in case you lose your devices.</div>

<div class="compose-highlight" data-text="tip">Add multiple devices and paper keys to your account to ensure its security.</div>

When you create your Keybase account, Keybase creates a key pair for your account and the device—your phone or computer—that you sign up with.

![ !Your Keybase account is linked to the device you sign up on.](/img/kb-one-device.png)

The public key is uploaded to Keybase’s servers and is publicly available. The private key lives only on your device. This means that no one else can access your account—or anything shared through it—without having your device (not even Keybase).

You can and should add more devices and paper keys to your account so you don’t lose access to it if you lose a device. A **paper key** is a long string of randomly-generated words that’s linked to your account the same way a device is.

![ !Adding more devices and paper keys helps make your account more secure.](/img/kb-three-devices.png)

When you add a new device or paper key, your existing device vouches for the new one. All your devices and paper keys are cryptographically linked. And each additional device or paper key you add to your account also gets a key pair.  

So, no one can compromise your account without having all of your devices and paper keys. This guarantees that only you have access to your account.

### Adding devices
Install Keybase on your other devices so that you don’t lose access to your account if you lose access to a device.

#### To install Keybase on additional devices, you need:
*  your Keybase username
*  the device you signed up with (you’ll use a QR code to vouch for the new device)
*  a name for the new device

Download the Keybase app on any device using [iOS](https://apps.apple.com/us/app/keybase-crypto-for-everyone/id1044461770), [MacOS](https://keybase.io/docs/the_app/install_macos), [Android](https://play.google.com/store/apps/details?id=io.keybase.ossifrage), [Windows](https://keybase.io/docs/the_app/install_windows), or [Linux](https://keybase.io/docs/the_app/install_linux). 

#### Device names are public and can’t be changed.
When you add a device, you’ll have to name it. Device names are visible to everyone on the internet and can’t be changed. Choose carefully.

Like your username, devices names are part of a public record that helps secure your account and confirm that you are who you say you are. Changing device names has the potential to undo this.

### Revoking devices
If you lose or replace a device, you should revoke it. Revoking removes the device from your account.

Revoking lost or old devices helps ensure that only you can access your account. Your account cannot be accessed through revoked devices.

Revoked devices still publicly appear on your account but are marked as revoked.

### Adding paper keys
Add paper keys so that you can access your account even if (worst-case scenario) you lose all of your devices.

When you create a paper key, write it down on—you guessed it—paper. It’ll be too long to memorize. We recommend storing paper keys somewhere like a locked drawer at home.

## Proofs  
<div class="compose-highlight" data-text="tip">Add as many proofs as you can to provide the most assurance that you are you on Keybase.</div>

The best way to let others know that your Keybase account belongs to you is to tell them in person. The next best way is through proofs.

Proofs link your Keybase account to your other online accounts. Proofs help people trust that you are really you on Keybase.

![ !You can link your Twitter and GitHub accounts and personal website to your Keybase account as proofs.](/img/kb-three-accounts.png)

Some people may already know you as you through your other accounts. But proofs are public, so Keybase can (and does) check them, and importantly, anyone can. Publicly proving that you are who you say you are is an important part of what makes Keybase accounts so secure and trustworthy.

If a proof changes, indicating that your Keybase or other social accounts may have been compromised, Keybase automatically warns the people you interact with.

### Adding proofs
You can add proofs for your personal website and social accounts on Twitter, GitHub, Reddit, and Hacker News. Your accounts must be public for them to work as proofs.

For example, if you use your Twitter account as a proof, Keybase will give you a specific phrase to tweet that includes your Keybase username.

![ !Proofs must be public so anyone can check them.](/img/kb-proof-twitter.png)

For the proof to work, you must tweet the phrase exactly as Keybase gives it to you. The tweet must be public and you can’t delete it.

Keeping proofs public lets Keybase—and anyone else—check them. Everyone can be sure that you are you.

## Following
<div class="compose-highlight" data-text="tl;dr">Following helps keep Keybase accounts secure. It allows you and those you interact with to be notified quickly if something on an account changes, indicating that it may be compromised and isn’t trustworthy.</div>

<div class="compose-highlight" data-text="tip">Follow people on Keybase to help make your account and theirs more trustworthy.</div>

Following helps confirm that people are who they say they are on Keybase. But it doesn’t necessarily indicate a relationship. More importantly, following helps provide reassurance that accounts are trustworthy and secure.

#### Follow people you interact with.
You can and definitely should follow people you know and interact with on Keybase. But following helps keep accounts secure and trustworthy even if you don’t know someone you follow or someone who follows you.

For example, let’s say you follow Mary Poppins on Keybase. You probably don’t know her and she probably doesn’t know you (if that’s not true, lucky you). By following her, you’re essentially documenting her Keybase account, including all her proofs and devices. 

This documentation is a time-stamped public record that can be checked by anyone else on Keybase. It’s also automatically checked by your computer or device every time you share messages or files with Ms. Poppins. If anything about her account changes, you—and everyone else who follows her—will be notified when you attempt to interact with her on Keybase again.

#### More followers provide more security.
But if you don’t know Ms. Poppins, you might not interact with her and get notified that her account has changed. This is where safety in numbers kicks in.

The more followers Mary Poppins has, the more likely that *someone* who follows her will attempt to interact with her on Keybase, be notified about the change, and reach out to her over other channels. Then she can confirm that she made the change or recover her account if it’s been hacked. This helps gives both you and Ms. Poppins more confidence about the safety and trustworthiness of her account.

And even if no one’s interacting with Ms. Poppins on Keybase, you get some confidence knowing that for every follower she has, a public record of who she is (according to her devices and proofs) has been added to a giant, public Keybase database.
Someone might be able to fake one or even two of these records so they look the same, but it’d be virtually impossible to fake dozens or more.

#### Older followers provide more security than newer ones.
Along the same lines, the older a follower is, the more security it provides. Remember that following someone creates a time-stamped public record of who they are on Keybase (according to their proofs and devices). So, if you followed Ms. Poppins way back in February 2014, your record helps confirm that her account hasn’t been hacked over the years between now and then. If someone had hacked her account, they’d have to maintain control of her computer, other device(s), and proofs over that whole period of time.

As long as someone’s account hasn’t been hacked the day you follow them (which would be kinda wild), you can be pretty confident they are who they say they are on Keybase. Likewise, your own followers help guarantee to your contacts—and better, to future contacts—that your Keybase account is controlled by you.

#### Follow soon and follow often.
If you keep (ahem) *following* this logic, it’s easy to see that an older Keybase account is more secure and trustworthy than a newer Keybase account. And, older followers are more valuable than new followers. So, if you haven’t already, set up your account and start following your contacts.

This is a pretty simplified version of how following works. You can dig into more details in our [docs](https://keybase.io/docs/server_security/following) and on [Github](https://github.com/keybase/keybase-issues/issues/100). (Note: following was previously called tracking.)

### Blocking followers
While even followers you don’t know help keep your account trustworthy, you can block them.

When you block someone, you can remove them from your public list of followers. You won’t see them and their account will not be publicly associated with yours. They also won’t be able to chat with you or add you to a team.

But please note, they will still, technically, be following you. The public record that was created when they followed you will still exist. And they may know that you blocked them if they attempt to chat with you or add you to a team. You can learn more about blocking in [Chat](/chat).
