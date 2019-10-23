<h2>Tor Support</h2>

<p>
The Keybase command-line client supports Tor. Of course anonymity is a fraught
and subtle property. This document explains how to protect your identity with
Tor and other Keybase features.
</p>

<p>
<strong>Please note that the Keybase GUI does not support Tor mode. </strong>
If you would like to tunnel the whole application through Tor, we recommend
running it inside of a <a href="https://tails.boum.org">Tails VM</a>.
Furthermore our Tor support isn't audited, so it's possible that even in strict
mode some identifying information might creep in.
</p>

<h3>Prerequisites</h3>

<p>
To use the command-line client with Tor, you'll need the Tor SOCKS proxy running locally. See
the <a href="https://www.torproject.org/docs/installguide.html.en">Tor
project's documentation</a> for more information on how to set up a local Tor
proxy.
</p>

<h3>Enabling Tor mode</h3>

<p>
If you are already running a <code>keybase service</code> in the background,
simply adding <code>--tor-mode</code> to your commands will not work - for
commands other than <code>service</code>, the flag is only effective when
the service is not already running, so you will have to use either of the
following methods:
</p>

<h4 style="margin-top: 1.5em">Temporarily by running service with an explicitly set flag</h4>

<p>
If you'd like to use Keybase in Tor mode just for a single session, first run
<code>keybase ctl stop</code> to shut down the services running in the
background, then run <code>keybase --tor-mode=leaky|strict service</code>.
While this service is running, all <code>keybase</code> commands in other
terminals will access our servers through the Tor network.

<strong>Please note that at this point starting the Keybase GUI will shut down that service and
restart it in default mode.</strong>
</p>

<h4 style="margin-top: 1.5em">Permanently by changing service's configuration</h4>

<p>
<hcode>bash
# "leaky" mode which simply tunnels all traffic through Tor
keybase config set tor.mode leaky
# "strict" mode which makes the requests fully anonymous
keybase config set tor.mode strict

# Restart the service, making sure that the GUI is not running
</hcode>
</p>

<h3>A short demo</h3>

<p>
To enable Tor with the default options, just set the Tor mode flag to
<code>leaky</code>:
</p>

<hcode>bash
# enable leaky tor mode using either of the methods described above
keybase id malgorithms@twitter
</hcode>

<p>
And you'll get an output like:
</p>

<hcode>markdown
▶ INFO Identifying chris
✔ public key fingerprint: 94AA 3A5B DBD4 0EA5 49CA BAF9 FBC0 7D6A 9701 6CB3
✔ "malgorithms" on twitter: https://twitter.com/malgorithms/status/433640580220874754
✔ "malgorithms" on github: https://gist.github.com/2d5bed094c6429c63f21
✔ admin of chriscoyne.com via HTTPS: https://chriscoyne.com/keybase.txt
✔ "malgorithms" on hackernews: https://news.ycombinator.com/user?id=malgorithms
✔ admin of DNS zone chriscoyne.com, but the result isn't reliable over Tor: found TXT entry keybase-site-verification=2_UwxonS869gxbETQdXrKtIpmV1u8539FmGWLQiKdew
</hcode>

<p>
All network traffic is now protected via Tor, so the server or network eavesdroppers can't
discern your IP adddress, but the server can still see your login credentials. This mode of operation is akin to <a href="https://trac.torproject.org/projects/tor/wiki/doc/TorifyHOWTO#mode3:userwithnoanonymityusingToranyrecipient">Tor anonymity mode(3)</a>.  It won't protect you from a Keybase server breach, but it will prevent your
ISP (or any other nefarious network snoopers) from knowing you use Keybase.
</p>

<p>
Note that not everything could be trusted in the above attempt to identify <code>@malgorithms</code>.
The Keybase CLI printed out that the DNS record for <code>chriscoyne.com</code> is untrusted,
due to the fact that DNS and naked HTTP are inherently unreliable over Tor;
relay nodes can make up whatever they want, and a malicious node can fake a proof.
</p>

<h3>Strict mode</h3>

<p>
<strong>Strict mode is currently broken, we are working on a fix.</strong>
</p>

<p>
If you want a higher level of privacy, you can ask for <em>strict</em> Tor mode, which will
withhold all user-identifying information from the server, akin
to <a href="https://trac.torproject.org/projects/tor/wiki/doc/TorifyHOWTO#mode1:useranonymousanyrecipient"> Tor anonymity mode(1).</a> For example, try this:
</p>

<hcode>bash
# enable strict tor mode using either of the methods described above
keybase follow malgorithms@twitter
</hcode>

<p>
And you'll get an output like:
</p>

<hcode>markdown
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
</hcode>

<p>
Notice a few new things going on. In the third line of output, there's a warning
that the client skipped syncing its local view of your profile with the server's.
If it did, someone analyzing traffic on the server could correctly guess that a
lookup of Alice directly followed by a lookup of Bob implies that Alice was
following or ID'ing Bob. So the lookup of Alice is surpressed. Also note that
the client doesn't offer to write a follower statement to the server, which
would also divulge the user's identity. Instead, it just settles for writing
following information to the local store.
</p>

<p>
Some commands won't work at all in strict mode. For instance, if you try to log-in
afresh:
</p>

<hcode>bash
keybase logout
keybase login
</hcode>

<p>
You'll get:

<hcode>markdown
▶ WARNING Failed to load advisory secret store options from remote: We can't send out PII in Tor-Strict mode; but it's needed for this operation
▶ ERROR Login required: login failed after passphrase verified
</hcode>
</p>

{##
<h3>Configuring Tor Support</h3>

<p>The relevent options are:</p>
<ul>

  <li><strong>Enable Tor</strong>: turn on Tor support.  Default to anonymity mode(3) as described above.
    <ul class="sub-ul">
      <li>Command line: <code>--tor-mode=[strict|leaky]</code></li>
      <li>Config file: <code>{ "tor" : { "enabled" : true }}</code></li>
      <li>Environment variable: <code>TOR_ENABLED=1</code></li>
      <li>Default: OFF</li>
    </ul>
  </li>

  <li><strong>Enable Tor Strict Mode</strong>: Hide all identifying user information from the server,
     and route all traffic through the given Tor SOCKS proxy (anonymity mode(1)). If present, it implies
     Tor mode is turned on.
     <ul class="sub-ul">
      <li>Command line: <code>--tor-strict</code></li>
      <li>Config file: <code>{ "tor" : { "strict" : true } }</code></li>
      <li>Environment variable: <code>TOR_STRICT=1</code></li>
      <li>Default: OFF</li>
     </ul>
  </li>

  <li><strong>Enable Tor "Leaky" Mode</strong>: If you've specifed <em>strict</em> mode
     in your configuration or environment, but want to turn strict mode off temporarily
     (say, to log in), you can specify this flag.
     <ul class="sub-ul">
      <li>Command line: <code>--tor-leaky</code></li>
      <li>Environment variable: <code>TOR_LEAKY=1</code></li>
      <li>Default: OFF</li>
     </ul>
   </li>

  <li><strong>Tor Hidden Address</strong>: Specify the Tor hidden address of the Keybase server
    (or a mirror).  If specified, implies that Tor mode should be turned on.
     <ul class="sub-ul">
      <li>Command line: <code>--tor-hidden-address foofoobar.onion:80</code></li>
      <li>Config file: <code>{ "tor" : { "hidden_address" : "foofoobar.onion:80"} }</code></li>
      <li>Environment variable: <code>TOR_HIDDEN_ADDRESS=foofoobar.onion:80</code></li>
      <li>Default: <code>keybase5wmilwokqirssclfnsqrjdsi7jdir5wy7y7iu3tanwmtp6oid.onion</code></li>
     </ul>
  </li>

  <li><strong>Tor Proxy</strong>: Specify the host and port of your Tor proxy.
    If specified, implies that Tor mode should be turned on.
     <ul class="sub-ul">
      <li>Command line: <code>--tor-proxy localhost:9050</code></li>
      <li>Config file: <code>{ "tor" : { "proxy" : "localhost:9050"} }</code></li>
      <li>Environment variable: <code>TOR_PROXY=localhost:9050</code></li>
      <li>Default: <code>localhost:9050</code></li>
     </ul>
  </li>

</ul>
##}

<h3>Web Support</h3>

<p>
As part of Tor support, we've also exposed <code>https://keybase.io</code> as a hidden address;
this is a marginal improvement over standard anonymous Tor browsing, since your traffic
need not traverse an exit node.  Our hidden address is:
</p>

<blockquote>
 <strong>http://keybase5wmilwokqirssclfnsqrjdsi7jdir5wy7y7iu3tanwmtp6oid.onion</strong>
</blockquote>

<p>
Note that the command-line client uses this hidden address internally, by default.
</p>

