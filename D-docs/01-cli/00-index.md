# Command Line

This page is just a sampler. [Download](/download) the Keybase app and use the built-in help:

```bash
keybase help        # general
keybase help follow # help following people
keybase help pgp    # help using PGP keys in Keybase
keybase help prove  # help with proofs
                    # etc.
```

#### Common commands

```bash
keybase version              # print the version number
keybase help                 # get help
keybase signup               # if you've never used Keybase
keybase login                # or...if you already have an account
keybase prove twitter        # prove you own a twitter account
keybase prove github         # prove a github account
keybase prove reddit         # prove a reddit account
keybase prove facebook       # prove a facebook
keybase prove hackernews     # prove an HN account
keybase prove https you.com  # prove a website
keybase prove http you.com   # if you don't have a legit cert
keybase prove dns you.com    # prove via a DNS entry
                             # ...more proof types soon...
```


#### Looking up other people & following

```bash
keybase id max                     # look "max" up, verify identity
keybase id maxtaco@twitter         # look twitter maxtaco up
keybase follow max                 # track max's identity publicly
keybase follow maxtaco@reddit      # follow a reddit user
```

#### Why follow? (previously called "tracking")

If you follow someone, subsequent commands will work without requiring more input from you:

```bash
keybase encrypt maria -m "this is a secret"
# Success! No questions asked
```

And if anything about your target has changed since you last followed them, you'll get a meaningful error.


#### Device adding + removing

Every computer you install Keybase on gets a device-specific key. This is a very big improvement over the old PGP model, where you had to move a private key around.

```bash
keybase device list        # list all your device + paper keys
keybase device remove [ID] # revoke device ID (found in device list)
keybase device add         # provision a new device
```

#### Paper keys

When you install Keybase for the first time, you'll be asked
to generate a paper key. It's  a full-powered key, just like a device key.

You can have as many paper keys as you like. You should have at least 1, until Keybase releases a mobile app.

```bash
keybase paperkey    # make a new paper key
keybase device list # see your paper keys
```

If you lose a paper key, just remove it like any other device.

#### Crypto commands

Generally:

  - `-m` means a message (as opposed to stdin or an input file)
  - `-i` means an input file
  - `-o` means an output file
  - `-b` means binary output, as opposed to ASCII

```
# given keybase user "max"
keybase encrypt max -m "this is a secret"
echo "this is a secret" | keybase encrypt max
keybase encrypt max -i secret.txt
keybase encrypt max -i secret.mp3 -b -o secret.mp3.encrypted
```

#### Encrypting for Keybase users

```bash
keybase encrypt max -m "this is a secret for max"
echo "secret" | keybase encrypt max
echo "secret" | keybase encrypt maxtaco@twitter
keybase encrypt max -i ~/movie.avi -o ~/movie.avi.encrypted
```

#### Decrypting

```bash
keybase decrypt -i movie.avi.encrypted -o movie.avi
keybase decrypt -i some_secret.txt
cat some_secret.txt.encrypted | keybase decrypt
```

#### Signing

```bash
keybase sign -m "I hereby abdicate the throne"
keybase sign -i foo.exe -b -o foo.exe.signed
```

#### Verifying

```bash
cat some_signed_statement.txt | keybase verify
keybase verify -i foo.exe.signed -o foo.exe
```

#### Encrypting a PGP message

If a Keybase user only has a PGP key, or you'd rather encrypt for that:

```bash
keybase pgp encrypt chris -m "secret"            # encrypt
keybase pgp encrypt maxtaco@twitter -m "secret"  # using a twitter name
keybase pgp encrypt maxtaco@reddit -m "secret"   # using a Reddit name
keybase pgp encrypt chris -s -m "secret"         # also sign with -s
keybase pgp encrypt chris -i foo.txt             # foo.txt -> foo.txt.asc
keybase pgp encrypt chris -i foo.txt -o bar.asc  # foo.txt -> bar.asc
echo 'secret' | keybase pgp encrypt chris        # stream
```

#### Decrypting a PGP message

```bash
keybase pgp decrypt -i foo.txt.asc             # foo.txt.asc -> stdout
keybase pgp decrypt -i foo.txt.asc -o foo.txt  # foo.txt.asc -> foo.txt
cat foo.txt.asc | keybase pgp decrypt          # decrypt a stream
```

#### Signing a PGP message

```bash
keybase pgp sign -m "Hello"                # sign a message
keybase pgp sign --clearsign -m "Hello"    # sign, but don't encode contents
keybase pgp sign -i foo.txt --detached     # generate foo.txt.asc, just a signature
keybase pgp sign -i foo.txt                # generate foo.txt.asc, containing signed foo.txt
echo "I rock." | keybase pgp sign          # stream
```

#### Verifying a PGP message

```bash
keybase pgp verify -i foo.txt.asc            # verify a self-signed file
keybase pgp verify -d foo.txt.asc -i foo.txt # verify a file + detached signature
cat foo.txt.asc | keybase pgp verify         # stream a self-signed file
```

#### Publishing a bitcoin address

```bash
keybase btc 1p90X3byTONYhortonETC  # sign and set the bitcoin
                                   # address on your profile
```

#### Assertions (useful for scripting, cron jobs, etc.)


```bash
# Here we encrypt a copy of a backup for
# maria, asserting that she's proven her key on both
# twitter and github. Both must pass.
#
# This is unnecessary if we've followed maria, as the command
# will fail if anything about her identity breaks.
cat some_backup.sql | keybase pgp encrypt -o enc_backup.asc \
  maria_2354@twitter+maria_booyeah@github+maria@keybase
```

#### More examples soon

Use `keybase help` to learn what's available.


## Tor Support

The Keybase command-line client supports Tor. Of course anonymity is a fraught and subtle property. This document explains how to protect your identity with Tor and other Keybase features.

**Please note that the Keybase GUI does not support Tor mode.**

If you would like to tunnel the whole application through Tor, we recommend running it inside of a [Tails VM](https://tails.boum.org). Furthermore our Tor support isn't audited, so it's possible that even in strict mode some identifying information might creep in.

### Prerequisites

To use the command-line client with Tor, you'll need the Tor SOCKS proxy running locally. See the [Tor project's documentation](https://www.torproject.org/docs/installguide.html.en) for more information on how to set up a local Tor proxy.

### Enabling Tor mode

If you are already running a `keybase service` in the background, simply adding `--tor-mode` to your commands will not work—for commands other than `service`, the flag is only effective when the service is not already running, so you will have to use either of the following methods:

#### Temporarily by running service with an explicitly set flag

If you'd like to use Keybase in Tor mode just for a single session, first run `keybase ctl stop` to shut down the services running in the background, then run `keybase --tor-mode=leaky|strict service`. While this service is running, all `keybase` commands in other terminals will access our servers through the Tor network.

**Please note that at this point starting the Keybase GUI will shut down that service and restart it in default mode.**

#### Permanently by changing service's configuration

```bash
# "leaky" mode which simply tunnels all traffic through Tor
keybase config set tor.mode leaky
# "strict" mode which makes the requests fully anonymous
keybase config set tor.mode strict

# Restart the service, making sure that the GUI is not running
```

### A short demo

To enable Tor with the default options, just set the Tor mode flag to `leaky`:

```bash
# enable leaky tor mode using either of the methods described above
keybase id malgorithms@twitter
```

And you'll get an output like:

```markdown
▶ INFO Identifying chris
✔ public key fingerprint: 94AA 3A5B DBD4 0EA5 49CA BAF9 FBC0 7D6A 9701 6CB3
✔ "malgorithms" on twitter: https://twitter.com/malgorithms/status/433640580220874754
✔ "malgorithms" on github: https://gist.github.com/2d5bed094c6429c63f21
✔ admin of chriscoyne.com via HTTPS: https://chriscoyne.com/keybase.txt
✔ "malgorithms" on hackernews: https://news.ycombinator.com/user?id=malgorithms
✔ admin of DNS zone chriscoyne.com, but the result isn't reliable over Tor: found TXT entry keybase-site-verification=2_UwxonS869gxbETQdXrKtIpmV1u8539FmGWLQiKdew
```

All network traffic is now protected via Tor, so the server or network eavesdroppers can't
discern your IP address, but the server can still see your login credentials. This mode of operation is akin to [Tor anonymity mode(3)](https://trac.torproject.org/projects/tor/wiki/doc/TorifyHOWTO#mode3:userwithnoanonymityusingToranyrecipient).  It won't protect you from a Keybase server breach, but it will prevent your ISP (or any other nefarious network snoopers) from knowing you use Keybase.

Note that not everything could be trusted in the above attempt to identify `@malgorithms`. The Keybase CLI printed out that the DNS record for `chriscoyne.com` is untrusted, due to the fact that DNS and naked HTTP are inherently unreliable over Tor; relay nodes can make up whatever they want, and a malicious node can fake a proof.

### Strict mode

**Strict mode is currently broken, we are working on a fix.**

If you want a higher level of privacy, you can ask for *strict* Tor mode, which will withhold all user-identifying information from the server, akin to [ Tor anonymity mode(1).](https://trac.torproject.org/projects/tor/wiki/doc/TorifyHOWTO#mode1:useranonymousanyrecipient) For example, try this:

```bash
# enable strict tor mode using either of the methods described above
keybase follow malgorithms@twitter
```

And you'll get an output like:

```markdown
warn: In Tor mode: strict=true; proxy=localhost:9050
warn: Tor support is in alpha; please be careful and report any issues
warn: Tor strict mode: not syncing your profile with the server
info: ...checking identity proofs
✔ public key fingerprint: 20AA 7564 29A0 B9B9 5974 3F72 E1E4 B2A1 286B A323
✔ "btcdrak" on twitter: https://twitter.com/btcdrak/status/513395408845148160
✔ "btcdrak" on github: https://gist.github.com/e4435571fe4c7d55231b
✔ "btcdrak" on reddit: https://www.reddit.com/r/KeybaseProofs/comments/2gyyej/my_keybase_proof_redditbtcdrak_keybasebtcdrak/
Is this the btcdrak you wanted? [y/N] y
warn: Can't write tracking statement to server in strict Tor mode
info: ✔ Wrote tracking info to local database
info: Success!
```

Notice a few new things going on. In the third line of output, there's a warning that the client skipped syncing its local view of your profile with the server's. If it did, someone analyzing traffic on the server could correctly guess that a lookup of Alice directly followed by a lookup of Bob implies that Alice was following or ID'ing Bob. So the lookup of Alice is suppressed. Also note that the client doesn't offer to write a follower statement to the server, which would also divulge the user's identity. Instead, it just settles for writing following information to the local store.

Some commands won't work at all in strict mode. For instance, if you try to log-in afresh:

```bash
keybase logout
keybase login
```

You'll get:

```markdown
▶ WARNING Failed to load advisory secret store options from remote: We can't send out PII in Tor-Strict mode; but it's needed for this operation
▶ ERROR Login required: login failed after passphrase verified
```

### Web Support

As part of Tor support, we've also exposed `https://keybase.io` as a hidden address; this is a marginal improvement over standard anonymous Tor browsing, since your traffic need not traverse an exit node.  Our hidden address is:

```
http://keybase5wmilwokqirssclfnsqrjdsi7jdir5wy7y7iu3tanwmtp6oid.onion
```

Note that the command-line client uses this hidden address internally, by default.
