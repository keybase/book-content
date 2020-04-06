
# Non-Interactive Session Tokens (NISTs)

To achieve fast reconnects after network outages, Keybase allows clients to
authenticate users via Non-Interactive Session Tokens (NISTs). With NISTs,
the client doesn't have to wait for a challenge from the server; it can
just sign a statement with its private key over session credentials.

Previous versions of the login protocol are detailed in these
docs for [password-](call/getsalt) [based](call/login) and [public-key based](call/sig/post_auth)
protocols.

## Long-Form NISTs

To generate a NIST, the client first posts a "long-form NIST" which is a signature
made with the user's private device key. The payload of the signature is an
array of the form:

```javascript
payload = [
  34,           // Hard-coded constant, for this version of session token strings
  1,            // implies "long-form", and 2 implies "short-form"
  "keybase.io", // the host we're authenticating to
  uid,          // encoded in binary
  device_id,    // encoded in binary
  kid,          // key ID, encoded in binary
  generated,    // in seconds since 1970 UTC
  lifetime,     // Seconds it can be valid for, no more than 2 days
  session_id    // a random 16-byte session ID, only can be used once, binary encoded
]
```

The user's client then generates a signature with the `key` that corresponds to `kid`
in the above payload:

```javascript
sig = sign(key, "Keybase-Auth-NIST-1\0" + msgpack(payload))
```

Here, `"Keybase-Auth-NIST-1\0"` is a *context string* so that these signatures cannot be
used in other conexts (like signing chats or signing updates to the user's sigchain). The
function `msgpack` is the [canonical packing](canonical_packings) via the Msgpack encoding
scheme.

Next, we make an abbreviated version of the above signature payload, so that we don't
need to send unnecessary data over to the server. These fields must have the same
values as in `payload`. Elided values are imputed by the server:

```javascript
payload_short = [ uid, device_id, generated, lifetime, session_id ]
```

Finally, this signature is wrapped up and encoded to a base64 string:

```javascript
long_token_binary = msgpack([
  34,           // Same version as above
  1,            // Same "long-form" mode as above
  sig,          // the output of the signature (in binary)
  payload_short // an abbreviated version of payload
])
long_token = long_token_binary.toString('base64')
```

The string `long_token` is then supplied as a `X-Keybase-Session` HTTP header, and can be sent over
to the server piggy-backing on any sort of request.

## Short-Form NISTs

Once a long-form NIST has been accepted by the server, and the server replies with an
`HTTP OK`, then it's safe to use a *short-form* version of a previously-posted long-form NIST,
which is a hash:

```javascript
short_token = msgpack([ 34, 2, SHA256(long_token_binary)[0:19] ]).toString('base64')
```

Here, `long_token_binary` is the binary encoding of the long-form NIST from above (before
base64-encoding), and `2` in the "mode" field implies short-form. The `short_token`
string can be specified in a `X-Keybase-Session` header field, where it's synonymous
with the long-form NIST it's derived from.

To save some bandwidth, we're only using the first 19 bytes of the SHA256 of the
long token. If Keybase had 2<sup>24</sup> concurrently active users, an attacker
would have a 1 in 2<sup>128</sup> chance of guessing a session token, which is small
enough to be comfortable with. We don't need the full collision-resistence property
of SHA256 here, and we can shave bandwidth.

## The Finer Points

NISTs stay valid until `generated+lifetime`, as computed by the server's clock. If the
client uploads a NIST with a `generated` time more than a day away from the current time,
or with a `lifetime` that's too short or long, or with `generated+lifetime` in the past,
then the NIST is immiedately rejected.

When a user deletes or resets his/her account, or revokes the signing device, the NIST
(whether short-form or long-form) is also revoked and is no longer valid.

Clients must manage token lifetime themselves, and know to refresh when their tokens
are running out of time.
