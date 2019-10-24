#{partial './server_security_header.toffee'}
{#
  lcol = "col-sm-6 col-md-6"
  rcol = "col-sm-6 col-md-6"
#}

<div id="page-doc-following">

  <h2>Understanding following (previously called "tracking")</h2>

  <div class="row">
    <div class="col-sm-8">
      <p>
        We get some big questions about Keybase following:
      </p>
      <ul class="questions">
        <li class="question">When should I follow?</li>
        <li class="question">What does it get me?</li>
        <li class="question">Is it a "web of trust?"</li>
      </ul>
      <p>
        Hopefully this page can clarify and answer your q's.
      </p>
    </div>
    <div class="col-sm-4">
        <img src="/images/tracking/man_in_the_middle.jpg" class="img-responsive img-dreaming" width="1110" height="1113">
    </div>
  </div>


      <h3>But first, the goal of Keybase</h3>

      <p>
        Keybase aims to provide public keys that can be trusted without any backchannel communication. If you need someone's public key,
        you should be able to get it, and know it's the right one, without talking to them in person.
      </p>

      <p>This is a daunting proposition: servers can be hacked or coerced into lying about a key. So when you run a Keybase client - whether it's our <a href="/docs/command_line">reference client</a> or someone else's - that client needs to be highly skeptical about what the server says.
      </p>


      <p>
        When the Keybase server replies <b>"this is twitter user @maria2929's public key"</b>, there has to be a protocol for verification.
      </p>

  <div class="row">
    <div class="col-sm-3">
      <img src="/images/tracking/dreams_of_maria.jpg" class="img-responsive img-dreaming" width="1110" height="975">
    </div>
    <div class="col-sm-9">
      <p>
        Therefore, any cryptographic action on Maria follows 3 basic steps:
      </p>

      <ol>
        <li>The server provides maria's info</li>
        <li>Your client verifies her identity proofs on its own</li>
        <li>You perform a human review of her usernames</li>
      </ol>

      <p>Let's go over these three steps.</p>

    </div>
  </div>

      <h2>Step 1: the request</h2>
      <p>
        When you wish to encrypt a message for your friend Maria, you might execute a command like this:
      </p>
      <hcode>bash
      keybase encrypt maria -m "grab a beer tonight?"
      </hcode>
      <p>
        So, first, your client asks the Keybase server who this mysterious maria is.
      </p>
      <p>
        Keybase, the <i>server</i>, provides a response that explains its view of "maria".
        Technically speaking, it's a JSON object and there's a little more data in there, but the meat is something like this:
      </p>
      <hcode>json
      {
        "keybase_username": "maria",
        "public_key":       "---- BEGIN PGP PUBLIC KEY...",
        "twitter_username": "@maria2929",
        "twitter_proof":    "https://twitter.com/maria2929/2423423423"
      }</hcode>
      <p>
        Keybase has done its own server-side verification of maria, and it won't pass back identities that it hasn't checked.
      </p>


  <div class="row row-doc">
    <div class="#{lcol}">
      <h2>Step 2: the computer review</h2>

      <p>
        The keybase client does not trust the Keybase server. The server has just <i>claimed</i> that <b>keybase:maria</b> and <b>@maria2929</b> are the same person. But are they? In step
        2, the client checks on its own.
      </p>

      <p>
        Fortunately, the server included a link to maria's tweet. The Keybase client scrapes it.
      </p>

    </div>
    <div class="#{rcol}">
      <img src="/images/tracking/maria_twitter.jpg" class="img-responsive img-dreaming hidden-xs" width="1110" height="448">
    </div>
  </div>

  <div class="row row-doc">
    <div class="#{lcol}">
      <img src="/images/tracking/chalkboard.jpg" class="img-responsive img-dreaming" width="1110" height="971">
    </div>
    <div class="#{rcol} chalk-col">
      <p>
        To satisfy the client, the tweet must be special.  It must link to a signed statement which claims to be from maria on Keybase.
      </p>
      <p>
        In simplest terms, the Keybase client guarantees that "maria" has access to three things: (1) the Keybase account, (2) the twitter account, and (3) the private key referenced
        back in step 1.
      </p>
      <p>
        All this happens really fast in the client with no inconvenience to you. And it happens for all of maria's identities: her twitter account, her personal website, her github account, etc.
      </p>

    </div>
  </div>

      <h2>Step 3: the human review</h2>

      <p>
        Recall, in Step 2 your client proved "maria" has a number of identities, and it cryptographically
        verified all of them.  Now you can review the usernames it verified, to determine if it's the maria you wanted.
      </p>
<pre class="code code-highlighted">✔ <span class="hljs-string">maria2929</span> on <span class="hljs-attribute">twitter</span>: https://twitter.com/2131231232133333...
✔ <span class="hljs-string">pasc4l_programmer</span> on <span class="hljs-attribute">github</span>: https://gist.github.com/pasc4...
✔ admin of <span class="hljs-string">mariah20.com</span> via <span class="hljs-attribute">HTTPS</span>: https://mariah20/keybase.tx...

Is this the maria you wanted? [y/N]</pre>
      <p>
        If it is, the Keybase client encrypts and you're done.
      </p>

      <h2>Finally: following</h2>

      <p>
        Steps 2 and 3 were easy enough, but it would stink to keep repeating them, every time you switched computers. Especially
        the human review.
        Ideally, once you're satisfied with maria, you can just do this from any computer:
      </p>

      <hcode>bash
      # this should work with no interactivity
      keybase encrypt maria -m "another beer?"
      </hcode>

      <p>
        But we have a problem: recall, you don't trust the Keybase server.
        So how can you get maria's info when you switch machines, without doing that username review thing again? The answer is following.
      </p>

      <p>
        <b>"Following" (which we used to call "tracking") is taking a signed snapshot.</b>
      </p>

      <p>
        Using your own private key, you can sign a snapshot of her identity. Specifically, you're signing the data from step 1, with some extra info about your own review.
      </p>

      <p>
        When you switch computers, the Keybase server can provide you with your own definition of maria, which is signed by you, so it can't be tampered with.
      </p>

      <p>
        Your client can continue to perform the computer review as often as it wants. If the tweet disappears, your client will want to know.
      </p>

      <p>

      </p>


  <div class="row row-doc">
    <div class="col-sm-8">
      <h3>The advantages of public following</h3>

      <p>
        When Maria is followed by 100 people, and they've all signed identical snapshots to yours, this is helpful.
      </p>

      <p>
        If some of these statements are months old, but your own is only 1 day old, you can get some peace of mind that her identity was not compromised today, the day you decided to follow her.
      </p>

      <p>
        This is not a web of trust. You can prove maria's identity, even if there are no other followers. But more followers means more confidence in the age of her account.
      </p>

    </div>
    <div class="col-sm-4">
      <img src="/images/tracking/social.jpg" class="img-responsive img-dreaming" width="1110" height="1046">
    </div>
  </div>

      <h3>Why follow now?</h3>

      <p>
        As hinted above, an older follower statement is superior to a new one. It's hard for a hacker to maintain a <i>public</i> compromise of all of maria's accounts over a span of many months. Maria or
        maria's friends would surely notice.
      </p>
      <p>
        By comparison, if you started following Maria right now, today could've been the day all her accounts were broken into, simultaneously.
      </p>

      <p>
        Therefore, an older follower statement is a better one.
      </p>

      <p>
        <b>A gentle conclusion:</b> if you find someone interesting on Keybase - say you know them, or you like to read things they write, or they're a software developer who might sign code - following them now makes sense. This will begin a long and auditable history of following their identity.
      </p>


  <hr>
  <p>
    <i>We hope this doc helps. We'll revise it as questions/suggestions arrive in our <a href="https://github.com/keybase/keybase-issues/issues/100">github issue #100 (I don't understand tracking)</a>.</i>
  </p>

  <div class="appendix">
      <h2>footnote 1: <i>the PGP web of trust</i></h2>
      <p>
        In the web of trust model, you know you have Maria's key because you trust John, and John signed a statement
        saying that another key belongs to his friend "Carla", and then Carla in turn signed a statement saying that Maria is someone whose drivers license
        and key fingerprint she reviewed at a party. Your trust of Maria's key is a function of these such connections.
      </p>
      <p style="text-align:center;">
       <b>you</b> &rarr; john &rarr; carla &rarr; <b>maria</b><br>
       <b>you</b> &rarr; herkimer &rarr; carla &rarr; <b>maria</b>
      </p>
      <p>
        The PGP web of trust has existed for over 20 years. However it is very difficult to use, it requires in-person verifications,
        and it's hard to know what trust level to assign transitively. (Herkimer reports that Carla was drunk; John can't remember, but he was drunk too, and who's Carla again???)
      </p>
  </div>

</div>{## /page-doc-following /.contents ##}
#{partial './server_security_footer.toffee'}

