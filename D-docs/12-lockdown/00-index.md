
# Lockdown Mode

Keybase users can opt! into _lockdown mode_ if they want extra protection for
their account. Doing so will disable all Web site features that mutate or
expose sensitive cloud-hosted data. Once in lockdown mode, all
security-sensitive features must be performed on a valid Keybase device, with an active
signing key...

For example, the following features require a Keybase device when a user is in lockdown mode:

  * changing password or recovering password
  * changing email address
  * changing your fullname, bio, or avatar
  * following or unfollowing a user
  * establishing or removing identity proofs (like Twitter, Reddit or Bitcoin)
  * team management operations
  * adding or revoking a device
  * updating or removing a PGP key
  * access to encrypted PGP secret key (for those who opt into this feature)
  * resetting account
  * deleting account

In other words, the user's view of the Keybase Web site when locked down is
roughly equivalent to an anonymous, logged-out user.

Lockdown mode affords protections similar to those provided by 2FA (Two Factor
Auth) on a traditional server-trust-based service. If you are in lockdown, an
attacker who gains control over your email inbox or your Keybase passphrase
has no ability to make any changes to your account. The attacker would need,
in addition, physical access to one of your *unlocked* devices, or remote
backdoor access (i.e., to have "rooted" your device). Unlike 2FA, lockdown
mode has no UX inconveniences and won't ask you to go fishing for your phone
or key fob.

## Enabling or Disabling Lockdown Mode

Users can only enable or disable lockdown mode with a valid Keybase device (and, of course,
never from the Web site). This can be done:

  * via mobile apps (☰ → Advanced → "Forbid accounts changes from the Website")
  * via desktop apps (☰ → Settings → Advanced → "Forbid accounts changes from the Website")
  * via the CLI (`keybase account lockdown --enable`)

You can see a history of all lockdown-related changes to your account via the CLI. For instance:

```sh
$ keybase account lockdown --history
Learn more about lockdown mode: `keybase account lockdown -h`
Lockdown mode is: enabled
Changed to:    Change time:               Device:
enabled        2018-08-16 13:36:30 EDT    iphone 8 (75873ef47b4beb15f62880ae4f943818)
disabled       2018-08-15 11:40:41 EDT    Work iMac 5k 2015-11 (d3cd754f30775a297c1ef61e5f3e3018)
enabled        2018-08-15 06:48:53 EDT    home mac mini - meuse (bb74a26dac2deeb11d66c7f1959f1d18)
disabled       2018-08-14 22:29:31 EDT    home mac mini - meuse (bb74a26dac2deeb11d66c7f1959f1d18)
enabled        2018-08-09 13:36:53 EDT    Work iMac 5k 2015-11 (d3cd754f30775a297c1ef61e5f3e3018)
```

## Internals

The implementation of lockdown mode is simple. Any API request to the Keybase server
can choose either [traditional password authentication](/docs/api/1.0/call/login)
or [non-interactive session token (NIST) authentication](/docs/api/1.0/nist).
The latter is only possible with a valid Keybase device. Thus, when a user enables lockdown,
any access to security-sensitive server-side endpoints can proceed only when accompanied
with a valid NIST token.
