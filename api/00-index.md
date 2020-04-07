{% set section_title = "API" %}
{% set section_subtitle = "Learn about the Keybase API." %}
{% set nav_title = "API" %}
{% set page_title = "Learn about the Keybase API" %}
{% set page_description = "Learn about key posting, key accessing, identity proof lookups, and more on Keybase." %}

<h2>Intro</h2>

<h4>First, welcome.</h4>

<p>
  Keybase is two things.
</p>

<ol>
  <li>a public, publicly-auditable directory of keys and identity proofs</li>
  <li>a protocol (this API) for accessing the directory</li>
</ol>

<p>
  If you just want to use Keybase from the command line, you should be looking at the <a href="/docs/command_line">command line doc</a>. This API doc is for people who want to write their own client or study how our reference implementation works.
</p>

<p>
  Please note we're in alpha and there may be some errors or missing calls in this documentation, and we may change calls without bumping version numbers.
  As we approach an official beta
  we'll make sure this document aligns better with the client. If you have any questions or notice an error, <a href="https://github.com/keybase/client/issues">visit us on github</a>.
</p>


<h4>Philosophy: simplicity!</h4>

<p>
  As you read about the Keybase API, you might start pondering the possibilities. <em>How do I post subkeys? How do I revoke
  a key on a precise date? Can I sign someone else's key?</em>
</p>
<p>
  The answer in most cases will be <b>not yet</b>. We believe
  public/private key crypto offers a world of possibilities, but there are some problems to overcome first.
</p>

<ul>
  <li>PKI is confusing as hell.</li>
  <li>private keys are hard to manage.</li>
  <li>there's a bootstrapping problem; if a good PKI existed, more cool software would be built.</li>
</ul>

<p>
  So, simplicity first. In version 1.0 of Keybase, you will see the simplest kinds of things: key posting, key accessing, identity proof lookups, etc.
</p>

<p>
  We want everyone in the world to have a key pair, and we want it to feel as simple as a username.
</p>

