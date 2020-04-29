
# Per-User Keys

Users on Keybase have one or more [*device keys*](https://keybase.io/blog/keybase-new-key-model), whose public halves are advertised in the user's
signature chain, and whose private halves stay local to the device that
generated them. Users can also have *paper keys*, which act as device
keys for the purposes of recovery from lost devices.

With the rollout of teams, we introduce a new type of key: the Per-User Key or PUK.
Conceptually, the secret half of the per-user key is encrypted for all of a user's
active device and paper keys. The public half is advertised in the user's signature
chain. When a user adds a new device, the secret-half of the PUK is simply encrypted
for the new device. When the user revokes a device, a new PUK is generated, and all
remaining devices get the new secret half.

## Cryptographic Specifics

Users start at PUK generation 1. Every time they revoke a device, they increment their version
number and roll their PUK. At generation *i*:

* A user generates a 32-byte random seed *s*.
* Computes *e* = HMAC-SHA256(*s*, `"Derived-User-NaCl-EdDSA-1"`) and uses this value as the secret key for an EdDSA signing key. Then computes the public half, yielding keypair *(E,e)*
* Computes *d* = HMAC-SHA256(*s*, `"Derived-User-NaCl-DH-1"`) and uses this value as a secret key for a Curve25519 DH encryption key. Then computes the public half, yielding keypair *(D,d)*
* Computes *c* = HMAC-SHA256(*s*, `"Derived-User-NaCl-SecretBox-1"`) and uses this value as symmetric secret key.


This process is repeated at every generation *i*. At any given generation, the
public keys *E* and *D* are signed into the user's public sigchain. Whenever a
new device is added, *s* is encrypted for the new device's device key. This is
an instantaneous operation and significantly improves keying performance over
previous designs we've considered and implemented. These NaCl boxes are
written to the server and stored in the main DB. The current *s* should have a
box for every active device.

On device revoke, the revoking device makes a new PUK, encrypts for the
private key for all remaining devices, and writes the new PUK to the
sigchain along with the statement revoking the old device. Also, whenever the
key rolls over, the previous seed *s*<sub>i</sub> is encrypted with
*c*<sub>*i*+1</sub> via NaCl's [SecretBox](https://nacl.cr.yp.to/secretbox.html) symmetric encryption,
with a random 24-byte nonce. See [newPerUserKeyPrev](https://github.com/keybase/client/blob/527fae6d5389e2899c41c5bdcb5b7097e4e5eb50/go/libkb/per_user_key.go#L79-L111)
and [openPerUsrKeyPrev](https://github.com/keybase/client/blob/527fae6d5389e2899c41c5bdcb5b7097e4e5eb50/go/libkb/per_user_key.go#L113-L163)
for an implementation of encryption and decryption, respectively.

## Sigchain Representation

The public side of PUKs are written to a user's public sigchain. To demonstrate this
by example, [here](https://keybase.io/max/sigchain#24a4189169cf5cec3b1788353c4cd801a7ed0543bd7269aef7999bec25c022b70f)
is the link in [max](https://keybase.io/max)'s sigchain where his client added a PUK for him.

The relevant sections are:

```javascript
{
  "body": {
    "per_user_key": {
      "encryption_kid": "0121f34ae7417cafa12d9d52bce5d6bdf4582f344f5aaa15022ea84d9ee54b6fe4070a",
      "generation": 1,
      "reverse_sig": "hKRib2R5hqhkZXRhY2hlZMOpaGFzaF90eXBlCqNrZXnEIwEgIFKhz54YC6M3WCKriGhYqjQrAEZMaeLZXebu5r8obpsKp3BheWxvYWTFA+R7ImJvZHkiOnsia2V5Ijp7ImVsZGVzdF9raWQiOiIwMTAxM2VmOTBiNGM0ZTYyMTIxZDEyYTUxZDE4NTY5YjU3OTk2MDAyYzhiZGNjYzliMjc0MDkzNWM5ZTRhMDdkMjBiNDBhIiwiaG9zdCI6ImtleWJhc2UuaW8iLCJraWQiOiIwMTIwNWQyZTM0YTcxM2UwMmE1ZWM1MGMzZjQxZGNkY2RhMGI5YTFkZTc0YmI1NTQ0NGNmNmI0ZGZiZjU0MTQ4N2QyNjBhIiwidWlkIjoiZGJiMTY1Yjc4NzlmZTdiMTE3NGRmNzNiZWQwYjk1MDAiLCJ1c2VybmFtZSI6Im1heCJ9LCJtZXJrbGVfcm9vdCI6eyJjdGltZSI6MTQ5ODY3NTE1MywiaGFzaCI6IjE1YTI0ZjA0MmVhODIzNjNmYjVmZmI3ZGZlYjUzM2JmYzE4YzdkNzQ3NDRkMDllYzQ2OTNjY2I3NmM2MDdjNzFkMWRmNmM1NThiMjNiNjZhNjFjMDNjMGQ5ZjBlOWM4YmE5NjExMTUyNzY1NDUzYjkyYmYyZjA4NjE0ZGVkNzI0IiwiaGFzaF9tZXRhIjoiMDdiZDU2NzZhMzgwYmU4ZDg2NWYwNmZkNDUzYzMwMTNhNTMwYTE2MzVlODk5YTg2NDRlMzUyZThiOGJiMTg2MCIsInNlcW5vIjoxMTk5MTE3fSwicGVyX3VzZXJfa2V5Ijp7ImVuY3J5cHRpb25fa2lkIjoiMDEyMWYzNGFlNzQxN2NhZmExMmQ5ZDUyYmNlNWQ2YmRmNDU4MmYzNDRmNWFhYTE1MDIyZWE4NGQ5ZWU1NGI2ZmU0MDcwYSIsImdlbmVyYXRpb24iOjEsInJldmVyc2Vfc2lnIjpudWxsLCJzaWduaW5nX2tpZCI6IjAxMjAyMDUyYTFjZjllMTgwYmEzMzc1ODIyYWI4ODY4NThhYTM0MmIwMDQ2NGM2OWUyZDk1ZGU2ZWVlNmJmMjg2ZTliMGEifSwidHlwZSI6InBlcl91c2VyX2tleSIsInZlcnNpb24iOjF9LCJjbGllbnQiOnsibmFtZSI6ImtleWJhc2UuaW8gZ28gY2xpZW50IiwidmVyc2lvbiI6IjEuMC4yNSJ9LCJjdGltZSI6MTQ5ODY3NTE4NSwiZXhwaXJlX2luIjo1MDQ1NzYwMDAsInByZXYiOiJiYWUwNWNjYWY0NzA3NDI4ZDUyNmJlYzY0MDQwMzFmYWQxZDcyMTMwYjI3NjNlMmEwYzU4MTBmOTNkZmUwNTQxIiwic2Vxbm8iOjMxMywidGFnIjoic2lnbmF0dXJlIn2jc2lnxEAekn745bQbOQLMdvurkVCQy6iKU3Tn2em8aTQlQtF5c4X0Upc+nNnQbR2KqSYNpSP2Ed83VoY0/dMKNfSZfWoNqHNpZ190eXBlIKRoYXNogqR0eXBlCKV2YWx1ZcQgDx5WL2Mwr2vEFphfaTGDtFS1jUa84efjIEmVKEXwb0qjdGFnzQICp3ZlcnNpb24B",
      "signing_kid": "01202052a1cf9e180ba3375822ab886858aa342b00464c69e2d95de6eee6bf286e9b0a"
    },
    "type": "per_user_key",
  },
}
```

As with any signing key, a *reverse signature* is computed with the new signing key over the entire JSON body, but with the
reverse signature set to empty. This proves that the user knows the private key corresponding to the advertised `signing_kid`.

One of these links appears every PUK generation, or roughly, whenever a user *revokes* a device.

## Teams

Teams the user is a member of will need to rotate their shared symmetric keys,
but this can happen lazily (before the next write) and off the critical path
(see [CLKR](clkr)).

## Rollout

Users just joining Keybase get a PUK when then provision their first device.
Some users were active before PUKs were rolled out, and their clients
opportunistically upgrade to include a PUK upon software upgrade.

Note, this change introduces a new state a user can be in: they are signed up
for keybase, they have device keys, but they don't have a PUK as
described above. New CLI users won't get here, but legacy users and new Web
users will. This makes some flows (like inviting users into teams) more
complicated.
