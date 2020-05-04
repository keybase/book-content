{% set section_title = "Command Line" %}

# Command Line

This page is just a sampler. [Download](https://keybase.io/download) the Keybase app and use the built-in help:

```bash
keybase help        # general
keybase help follow # help following people
keybase help pgp    # help using PGP keys in Keybase
keybase help prove  # help with proofs
                    # etc.
```

### Common commands

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


### Looking up other people & following

```bash
keybase search max                 # find users like "max"
keybase id max                     # look "max" up, verify identity
keybase id maxtaco@twitter         # look twitter maxtaco up
keybase follow max                 # track max's identity publicly
keybase follow maxtaco@reddit      # follow a reddit user
```

### Why follow? (previously called "tracking")

If you follow someone, subsequent commands will work without requiring more input from you:

```bash
keybase encrypt maria -m "this is a secret"
# Success! No questions asked
```

And if anything about your target has changed since you last followed them, you'll get a meaningful error.


### Device adding + removing

Every computer you install Keybase on gets a device-specific key. This is a very big improvement over the old PGP model, where you had to move a private key around.

```bash
keybase device list        # list all your device + paper keys
keybase device remove [ID] # revoke device ID (found in device list)
keybase device add         # provision a new device
```

### Paper keys

When you install Keybase for the first time, you'll be asked
to generate a paper key. It's  a full-powered key, just like a device key.

You can have as many paper keys as you like. You should have at least 1, until Keybase releases a mobile app.

```bash
keybase paperkey    # make a new paper key
keybase device list # see your paper keys
```

If you lose a paper key, just remove it like any other device.

### Crypto commands

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

### Encrypting for Keybase users

```bash
keybase encrypt max -m "this is a secret for max"
echo "secret" | keybase encrypt max
echo "secret" | keybase encrypt maxtaco@twitter
keybase encrypt max -i ~/movie.avi -o ~/movie.avi.encrypted
```

### Decrypting

```bash
keybase decrypt -i movie.avi.encrypted -o movie.avi
keybase decrypt -i some_secret.txt
cat some_secret.txt.encrypted | keybase decrypt
```

### Signing

```bash
keybase sign -m "I hereby abdicate the throne"
keybase sign -i foo.exe -b -o foo.exe.signed
```

### Verifying

```bash
cat some_signed_statement.txt | keybase verify
keybase verify -i foo.exe.signed -o foo.exe
```

### Encrypting a PGP message

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

### Decrypting a PGP message

```bash
keybase pgp decrypt -i foo.txt.asc             # foo.txt.asc -> stdout
keybase pgp decrypt -i foo.txt.asc -o foo.txt  # foo.txt.asc -> foo.txt
cat foo.txt.asc | keybase pgp decrypt          # decrypt a stream
```

### Signing a PGP message

```bash
keybase pgp sign -m "Hello"                # sign a message
keybase pgp sign --clearsign -m "Hello"    # sign, but don't encode contents
keybase pgp sign -i foo.txt --detached     # generate foo.txt.asc, just a signature
keybase pgp sign -i foo.txt                # generate foo.txt.asc, containing signed foo.txt
echo "I rock." | keybase pgp sign          # stream
```

### Verifying a PGP message

```bash
keybase pgp verify -i foo.txt.asc            # verify a self-signed file
keybase pgp verify -d foo.txt.asc -i foo.txt # verify a file + detached signature
cat foo.txt.asc | keybase pgp verify         # stream a self-signed file
```

### Publishing a bitcoin address

```
keybase btc 1p90X3byTONYhortonETC  # sign and set the bitcoin
                                   # address on your profile
```

{#
TODO:
</md>
<pre class="code code-highlighted">keybase btc 1p90X3byTONYhortonETC  <span class="hljs-comment"># sign and set the bitcoin</span>
                                   <span class="hljs-comment"># address on your profile</span>
</pre>
<md>
#}

### Assertions (useful for scripting, cron jobs, etc.)


```
# Here we encrypt a copy of a backup for
# maria, asserting that she's proven her key on both
# twitter and github. Both must pass.
#
# This is unnecessary if we've followed maria, as the command
# will fail if anything about her identity breaks.
cat some_backup.sql | keybase pgp encrypt -o enc_backup.asc \
  maria_2354@twitter+maria_booyeah@github+maria@keybase
```

### More examples soon

Use `keybase help` to learn what's available.

{# Teams #}

{#
<style>
.gs-img {
  text-align:center;
  margin:40px 0;
}
#page-teams-alpha ul li {
  margin-bottom:10px;
}
#page-teams-alpha h3 {
  margin-top:50px;
}
</style>

<div id="page-teams-alpha">

      <md>
#}

## Teams for Keybase


### What is it?

A keybase team is a *named* group of people, with flexible membership. If you work on a project called Acme, you could register the team name `acme` on Keybase. This team name is *universal*; there can be only one Keybase team with a given name.

A team's encrypted files can be found in `/keybase/team`:

![](https://keybase.io/images/teams/team_kbfs.png)

Teams can have chat channels, kind of like Slack.  But unlike Slack, Keybase chats are end-to-end encrypted, and your team's admins cryptographically control who is on the team.

Each team gets a default `#general` chat channel, but you can make more.

During this early alpha, team administration is solely done through the command line. If that's ok with you, keep reading.

### A command-line TL;DR:
```bash
# make a team
# -----------

> keybase team create dingbatz

# see what teams you're in
# ------------------------

> keybase team list-memberships
Team            Role      Username    Full name
keybase         owner     chris       Chris Coyne
dingbatz        owner     chris       Chris Coyne

# add some people
# ---------------------------------------------

> keybase team add-member dingbatz --user max     --role=admin
> keybase team add-member dingbatz --user crudder --role=writer
> keybase team list-memberships dingbatz

# end-to-end encrypted KBFS folders
# ---------------------------------
> mv ~/Dropbox/Manifesto.pdf .

# and chats!
# --------------------------------------------

> keybase chat send dingbatz "hello to my pals"

```

### In the GUI

I actually ran the above commands, so now I see the "dingbatz #general" chat channel show up in my UI. Max and crudder do, too, since I added them. We can share files in KBFS, and we can chat. If I add someone else to the team, they'll get access to the files and chat histories, too, as we'll rekey for them.

In an upcoming release, it will be prettier, but right now team chat looks like a regular chat with no avatar, and prefixed with that ugly `#general`. This is an MVP, so please bear with us.

![](https://keybase.io/images/teams/dingbatz.png)

### Casual teams and big orgs

We want to support both casual discussions (e.g., pokerpals) and large organizations (e.g., nytimes).

To serve bigger groups:

 * there will soon be a teams tab in the app for administering with greater complexity
 * we have baked-in subteam support. For example, `atlassian.usa.marketing` or `nytimes.devops`.

For the next 4-8 weeks, all administration is in the CLI.


### The most important command

```bash
keybase team help
```

### Making chat channels

In the first days of our alpha, creating a chat channel other than `#general` is slightly annoying. You have to kick it off by sending a message from the CLI:

```bash
keybase chat send --channel '#hr-issues' uber "let's do this"
```

After that your team can use it in the GUI - both on the desktop and phone apps. Anyone who wants to join the channel (for now) can do it from the command line.

```bash
# join a channel
keybase chat join-channel fyre '#festival2018'

# or list channels
keybase chat list-channels acme
```

Oh, also, at-mentioning a team member will pull them in...so the simplest thing is just to make a channel, join it yourself, and then ping someone on it in the GUI.

A chat channel can be joined by anyone on a team. For example, if you have an `acme #design` channel, anyone in `acme` can join and read it.

If you want to segregate chats, cryptographically, this is what subteams will be for. More on that below.


### Subteams

We have implemented subteams! For example, if you're the owner of `nike`, you could keep the top team pretty empty and divide your company into `nike.usa` and `nike.marketing` and even deeper teams such as `nike.web.engineering.interns2017`. And if you did a partnership with Apple, you could make `nike.apple_partnership` and put some people who work at Apple into that subteam.

```bash
# assuming you're an admin of nike
keybase team create nike.board
```

Each subteam in your org has its own chat channels. So to have an encrypted discussion with only your board of directors, you could make the subteam `acme.board`. Inside that team, you could make chat channels for whatever B.O.D.'s talk about, `#plausible-deniability` and `#efficient-breach`.

Members of `acme` won't know there's a subteam called `acme.board` unless they're an admin of `acme` or invited into `acme.board`.

More details:

* to create a subteam you must be an admin of its parent
* parent admins have certain admin controls of a subteam, even if they don't join the team. This prevents lost, orphaned subteams. If you're an admin of `acme` and make `acme.interns` without joining it, you won't see its chat or files; even though you have cryptographic keys to the group, the server will refuse to give you the encrypted data unless you explicitly sign yourself into the team, which lets all its members know.
* subteam members don't need to be parent team members. So `acme.interns` don't need to be members of `acme`.
* members of a team cannot tell the name or membership of subteams they're not a part of.
* members of sibling teams cannot see each other's names or memberships. Lowly `nike.interns` can't see `nike.sweatshop`.
* members of a subteam *can* tell membership of parent teams.
* subteams can be renamed, unlike root team names.



### Asking to join a team

You can request team access:

```bash
> keybase team request-access acme
```

As an outsider, you can't tell who's in a team, so Keybase will reach out to the admins and say you've requested access. They can then add you or ignore the request.

### Approving by social media handle

Ultimately admins are signing into a team the username + key chain of a Keybase user. Continued team membership does not require maintaining specific social proofs, so if an admin cares about a social proof they should check it at the time they sign someone in.

All that said, there's a protocol to approve by other proven identities:

```bash
keybase team add-member --role writer --user acmeceo@twitter acme
```

1. this signs an admin statement (to yourself and other admins) in the team sig chain, saying, "hey, if @acmeceo on twitter proves their account, sign whoever that user is into our team."

2. an admin's client will obey the fellow admin's signed link and perform the action.

To be clear, this user does not need to maintain the twitter account indefinitely; they are not kicked out of the team if Twitter goes down or they abandon the account.

### A taste of TOFU: quick team building by email

The following is a common desire, so we've made it work:

```bash
keybase team add-member --role writer --email wonderwoman@acme.com acme
```

Here's what happens when you run this command:

1. you sign an admin statement, saying you want wonderwoman@acme.com to join the team
2. **the Keybase servers** get wonderwoman@acme.com to join and establish a username
3. the next admin online gets pinged to automatically sign her onto the team, trusting Keybase checked the email.

This is "Trust on First Use" (TOFU) because you're trusting Keybase isn't lying about the email proof...the same kind of TOFU you see when using Signal or WhatsApp to lookup a key by phone number.

Once wonderwoman is on the team, her identity can't be swapped out. Also, as she adds more devices you won't have to go through TOFU again, unlike when people wipe/install their phones with some chat apps. (That really isn't TOFU, now, is it?)

Keybase can't abuse this feature to insert extra people on your team. It only works if you start the process off by posting a signed statement that you want it to work, and the admin(s) on your team verify the signed statement, because that statement is checked in step 3. The invitation can be revoked, cryptographically, if you change your mind.

Admin privileges cannot be granted with TOFU.

### Understanding roles

We'll move this to a table soon. Here's a screenshot of a spreadsheet:

![](https://keybase.io/images/teams/roles.png)

In the above, an "implied admin" of a subteam is someone who is an admin of a parent team.

### Metadata

Keybase servers do know team memberships: team names, users, and roles. Keybase servers *cannot* read the contents of chats or files or even know the names of chat channels or files, as that is end-to-end encrypted.  **At no point does Keybase have any private keys for any KBFS or chat data.**

### On the immutability of teams' sig chains

Any change to a team is signed into a chain, referencing the hash of the last change to the team. This chain itself hangs off a Merkle tree, where it can be found, deterministically. If you're a member of `acme` you can traverse the tree to the chain. This means you will see the exact same `acme` chain as any other acme user. [We even write the root of our merkle tree to the bitcoin blockchain](https://keybase.io/docs/server_security/merkle_root_in_bitcoin_blockchain).

This is so you can say or type: "Hey - we're in a team on Keybase called 'lollipops'. Join Keybase and request access." Or "Expect an invitation from the team dunkindonuts...that'll be me." We believe this kind of human discourse without fingerprints or codes is crucial. Just say no to hex strings or 60-digit numbers you're supposed to compare.

Teams do not have a concept of being "reset" or recovered. Once a team is created, it can never be stolen by Keybase or given to someone else. Links can only be added to its signature chain by admins, and links can be added but never removed. Only revoked. This prevents the server from lying by omission.

If all your admins lose all their keys, you will permanently lose your team! There's nothing Keybase can do to help, because Keybase can't mess with your team.

### Small odds of team screwup

You're among the first testers of Keybase Teams, so there is a small chance we'll screw something up and you'll need to haul your data out and pick a new team name. We hope this doesn't happen. Call it 1% chance of this for July-Sept 2017.

### Limits

During our testing:

- teams are limited to 20 people
- subteam creation is disabled for a little while
- you can only make 100 total teams. Don't go squatting names for companies and projects that you know others will want, please.

### Anticipated Questions

**Why are team names universal?**

So people can talk about a team just using its name, without using fingerprints or security codes.

**Why can't I rename top-level teams?**

You can rename subteams, but top-level team renaming is not something we're ready to implement yet. It would require a level of redirection in our Merkle tree and, more important, extensive user experience considerations. So we may never implement it. If you dislike your team name, make a new team and invite everyone.

**Can people outside my teams know what teams I'm in?**

No. As mentioned in the metadata section above, the Keybase servers need to know, for a variety of user experience and notification reasons. But team sig chains are not published, unlike user sig chains, which are.

**What happens if I "reset" my account**

Account resetting on Keybase is where you throw away all your keys and start over, and redo your identity proofs. **This kicks you off all your teams.** You will need to be added again.

It has to be this way, otherwise Keybase could kick you out of a team and put someone else in your place.

**How do I test?**

Just install Keybase and make a team with the command line.

**How do I send feedback?**

```bash
# if you have any issues in the desktop client
> keybase log send
```

In the phone app, you can go to **gear icon > feedback**.

For general non-bug feedback, you can create an issue on [https://github.com/keybase/client](https://github.com/keybase/client)

**How does this fit into Keybase's business model?**

We think someday if teams take off, we'll charge for larger teams. Nothing we're offering for free now will flip to a pay model, so if you make a 20 person team now and start using it, you won't someday be faced with a credit card screen to get your files or messages.

**Is this actually open source?**

Yes, on all clients.

[https://github.com/keybase/client](https://github.com/keybase/client)

[Installation instructions here](https://keybase.io/download)

![](https://keybase.io/images/teams/acme.png)


## Tor Support

The Keybase command-line client supports Tor. Of course anonymity is a fraught and subtle property. This document explains how to protect your identity with Tor and other Keybase features.

*Please note that the Keybase GUI does not support Tor mode.* If you would like to tunnel the whole application through Tor, we recommend running it inside of a [Tails VM](https://tails.boum.org). Furthermore our Tor support isn't audited, so it's possible that even in strict mode some identifying information might creep in.

### Prerequisites

To use the command-line client with Tor, you'll need the Tor SOCKS proxy running locally. See the [Tor project's documentation](https://www.torproject.org/docs/installguide.html.en) for more information on how to set up a local Tor
proxy.

### Enabling Tor mode

If you are already running a `keybase service` in the background, simply adding `--tor-mode` to your commands will not work - for commands other than `service`, the flag is only effective when the service is not already running, so you will have to use either of the following methods:

#### Temporarily by running service with an explicitly set flag

If you'd like to use Keybase in Tor mode just for a single session, first run `keybase ctl stop` to shut down the services running in the background, then run `keybase --tor-mode=leaky|strict service`. While this service is running, all `keybase` commands in other terminals will access our servers through the Tor network.

*Please note that at this point starting the Keybase GUI will shut down that service and restart it in default mode.*

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

```
▶ INFO Identifying chris
✔ public key fingerprint: 94AA 3A5B DBD4 0EA5 49CA BAF9 FBC0 7D6A 9701 6CB3
✔ "malgorithms" on twitter: https://twitter.com/malgorithms/status/433640580220874754
✔ "malgorithms" on github: https://gist.github.com/2d5bed094c6429c63f21
✔ admin of chriscoyne.com via HTTPS: https://chriscoyne.com/keybase.txt
✔ "malgorithms" on hackernews: https://news.ycombinator.com/user?id=malgorithms
✔ admin of DNS zone chriscoyne.com, but the result isn't reliable over Tor: found TXT entry keybase-site-verification=2_UwxonS869gxbETQdXrKtIpmV1u8539FmGWLQiKdew
```

All network traffic is now protected via Tor, so the server or network eavesdroppers can't discern your IP address, but the server can still see your login credentials. This mode of operation is akin to [Tor anonymity mode(3)](https://trac.torproject.org/projects/tor/wiki/doc/TorifyHOWTO#mode3:userwithnoanonymityusingToranyrecipient). It won't protect you from a Keybase server breach, but it will prevent your ISP (or any other nefarious network snoopers) from knowing you use Keybase.

Note that not everything could be trusted in the above attempt to identify `@malgorithms`. The Keybase CLI printed out that the DNS record for `chriscoyne.com` is untrusted, due to the fact that DNS and naked HTTP are inherently unreliable over Tor; relay nodes can make up whatever they want, and a malicious node can fake a proof.

### Strict mode

*Strict mode is currently broken, we are working on a fix.*

If you want a higher level of privacy, you can ask for <em>strict</em> Tor mode, which will withhold all user-identifying information from the server, akin to [Tor anonymity mode(1)](https://trac.torproject.org/projects/tor/wiki/doc/TorifyHOWTO#mode1:useranonymousanyrecipient) For example, try this:

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

Some commands won't work at all in strict mode. For instance, if you try to log-in
afresh:

```bash
keybase logout
keybase login
```

You'll get:

```markdown
▶ WARNING Failed to load advisory secret store options from remote: We can't send out PII in Tor-Strict mode; but it's needed for this operation
▶ ERROR Login required: login failed after passphrase verified
```

{#
<h3>Configuring Tor Support</h3>

<p>The relevant options are:</p>
<ul>

  <li><strong>Enable Tor</strong>: turn on Tor support.  Default to anonymity mode(3) as described above.
    <ul class="sub-ul">
      <li>Command line: `--tor-mode=[strict|leaky]`</li>
      <li>Config file: `{ "tor" : { "enabled" : true }}`</li>
      <li>Environment variable: `TOR_ENABLED=1`</li>
      <li>Default: OFF</li>
    </ul>
  </li>

  <li><strong>Enable Tor Strict Mode</strong>: Hide all identifying user information from the server,
     and route all traffic through the given Tor SOCKS proxy (anonymity mode(1)). If present, it implies
     Tor mode is turned on.
     <ul class="sub-ul">
      <li>Command line: `--tor-strict`</li>
      <li>Config file: `{ "tor" : { "strict" : true } }`</li>
      <li>Environment variable: `TOR_STRICT=1`</li>
      <li>Default: OFF</li>
     </ul>
  </li>

  <li><strong>Enable Tor "Leaky" Mode</strong>: If you've specified <em>strict</em> mode
     in your configuration or environment, but want to turn strict mode off temporarily
     (say, to log in), you can specify this flag.
     <ul class="sub-ul">
      <li>Command line: `--tor-leaky`</li>
      <li>Environment variable: `TOR_LEAKY=1`</li>
      <li>Default: OFF</li>
     </ul>
   </li>

  <li><strong>Tor Hidden Address</strong>: Specify the Tor hidden address of the Keybase server
    (or a mirror).  If specified, implies that Tor mode should be turned on.
     <ul class="sub-ul">
      <li>Command line: `--tor-hidden-address foofoobar.onion:80`</li>
      <li>Config file: `{ "tor" : { "hidden_address" : "foofoobar.onion:80"} }`</li>
      <li>Environment variable: `TOR_HIDDEN_ADDRESS=foofoobar.onion:80`</li>
      <li>Default: `keybase5wmilwokqirssclfnsqrjdsi7jdir5wy7y7iu3tanwmtp6oid.onion`</li>
     </ul>
  </li>

  <li><strong>Tor Proxy</strong>: Specify the host and port of your Tor proxy.
    If specified, implies that Tor mode should be turned on.
     <ul class="sub-ul">
      <li>Command line: `--tor-proxy localhost:9050`</li>
      <li>Config file: `{ "tor" : { "proxy" : "localhost:9050"} }`</li>
      <li>Environment variable: `TOR_PROXY=localhost:9050`</li>
      <li>Default: `localhost:9050`</li>
     </ul>
  </li>

</ul>
#}

### Web Support

As part of Tor support, we've also exposed `https://keybase.io` as a hidden address; this is a marginal improvement over standard anonymous Tor browsing, since your traffic need not traverse an exit node.  Our hidden address is:

> *http://keybase5wmilwokqirssclfnsqrjdsi7jdir5wy7y7iu3tanwmtp6oid.onion*

Note that the command-line client uses this hidden address internally, by default.
