## Basics

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
keybase search max                 # find users like "max"
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
keybase pgp verify -d foo.txt.asc -i foo.txt # verify a file + detatched signature
cat foo.txt.asc | keybase pgp verify         # stream a self-signed file
```

#### Publishing a bitcoin address

</md>
<pre class="code code-highlighted">keybase btc 1p90X3byTONYhortonETC  <span class="hljs-comment"># sign and set the bitcoin</span>
                                   <span class="hljs-comment"># address on your profile</span>
</pre>
<md>

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
