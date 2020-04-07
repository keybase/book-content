
# Lockdown mode

Lockdown mode is a setting that can be enabled for a Keybase account
that turns most of the website read-only. It's an extension of Keybase
API server access control. When lockdown mode is enabled, non-devices
(like browsers) are not able to do the following actions:

- deleting or resetting the account,
- changing password or e-mail address,
- changing profile information (full name, bio, location),
- changing profile picture,
- decrypting or signing PGP messages (if PGP key is synced),
- posting signatures to sigchain (signed with PGP key, if synced).

Additionally, all endpoints that return encrypted private PGP key will
be either blocked or not return the key anymore, if lockdown mode is
enabled.

Lockdown mode protects you from an adversary who obtains your password
or your browser session cookie. With lockdown mode enabled, having
just that is not enough to do damage to your account.

The API server knows that [NIST sessions](nist) come from a device
(and which one), and lets these requests through. Sessions established
by [other](call/login) [means](call/sig/post_auth) will see a
`"LOCKDOWN_INVALID_ACCESS"` error when trying to access protected
endpoints.

## Enabling lockdown mode

Lockdown mode can only be enabled using Keybase client from a
provisioned device. For example, using command-line interface:

<pre>
> keybase account lockdown --enable
Do you want to <span style="color:#3dcca6">ENABLE</span> lockdown mode? [y/N] y
Lockdown mode is: <span style="color:#3dcca6">enabled</span>
</pre>

To see if lockdown mode is currently enabled:

<pre>
> keybase account lockdown
Learn more about lockdown mode: <b>`keybase account lockdown -h`</b>
Lockdown mode is: <span style="color:#3dcca6">enabled</span>
</pre>