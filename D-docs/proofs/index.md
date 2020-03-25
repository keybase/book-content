<div class="proof-integration-guide">

# Getting your service on Keybase
### a.k.a. Keybase&rsquo;s brand new _Proof Integration Guide_

The most basic idea behind Keybase is that it&rsquo;s a protocol and directory for
connecting people&rsquo;s identities and keys together. For example, it is
cryptographically proven that Keybase user **[tammy](/tammy)** is all of these
identities:


</md><center><div style="max-width:360px;margin:20px 0 40px 0">
    <img src="/images/paramproofs/tammy.png" class="img img-responsive">
    <small><br>Thanks to tammy for letting us use her happy profile as an example in the app store</small>
</div></center><md>

If you know **[@tammycamp](https://twitter.com/tammycamp)** on Twitter, Keybase
can provide you her keys and proof that they are in fact her keys. And, going
in the other direction, you can start with something she signed, and know for
certain it was signed by Twitter user **@tammycamp**.

Today we are opening up a set of steps that _your app or website_ can follow to
get cryptographic connections to Keybase. In other words, your service can join
Reddit, Twitter, Github, and Facebook on Keybase profiles. Also, Keybase
profiles will appear on the profiles of your service, allowing users to know
how to reach each other securely.

This short guide is a walkthrough of the endpoints you&rsquo;ll need to implement to
make it happen. It&rsquo;s not much work.

<div class="wrap">
<h3>Looking for a Mastodon instance?</h3>

<p>Mastodon has built-in support for Keybase proofs starting with version 2.8.0. If you don't see the instance you're looking for in the Keybase app, contact ****[@mlsteele](https://keybase.io/mlsteele)**** or email miles@keyba.se to have it added to the list.</p>
</div>

## Getting started

As you read this guide, you&rsquo;ll go through:
- [Proof creation](#2-2-proof-creation); this is when the user signs a
statement in Keybase, claiming to be a member of your service
- [Proof checking](#2-3-proof-checking); the proof signature can be requested
from your service, and cryptographically checked by anyone
- [Linking](#3-linking-user-profiles); you and Keybase will link to each other,
but only upon a successful proof

In this guide, let’s call your service the Identity Service, though we both
know it’s so much more. Integrating with Keybase as an identity service
involves implementing some product features, a couple API endpoints, and then
talking to us. You’ll also send us a config file (described below) which we’ll
use to finish out the integration.

To help with your integration we have a [Python reference
implementation](https://github.com/keybase/django-keybase-proofs) if you prefer
to consume the material that way and a [verification
script](/docs/proof_integration_guide/verification_script) for testing things
out. We also have a [Clojure reference
implementation](https://github.com/keybase/colorbase) using a [Clojure helper
library](https://github.com/keybase/clj-keybase-proofs).

Throughout this document our examples are written using
[httpie](https://httpie.org/) for simplicity.

---

## 1. Config

Let’s start with the config file, which has all the information Keybase needs
to know about the Identity Service.  It presents a high-level view of the
integration. All of the fields are required unless noted as optional, and all
endpoints must be HTTPS.


{## NOTE: python gives the comments better coloring; comments not allowed in JSON ##}
{## NOTE: JSON version of this file is in ./example-config.json, if an update
is made here that file should change as well. ##}
```python
{
  # Please version bump when updating config
  "version": 1,
  "domain": "beeactivists.com",
  "display_name": "Bee Activists",

  # A regex for validating usernames on Bee Activists in the re2 format
  # https://github.com/google/re2/wiki/Syntax (inline flags, like for case-insensitivity, are not supported).
  # Keybase will treat these case-insensitively and will only display usernames
  # in lowercase.
  "username": {
    "re": "^[a-zA-Z0-9_]{2,20}$",
    "min": 2,
    "max": 20
  },

  "brand_color": "#FFB800",

  # Your brand logo will appear in various places around the Keybase app.
  # Assets will be rehosted by Keybase, so do let us know about updates.
  "logo": {
    # A full-black monochrome SVG. Should look good at 16px square. Expand all texts and strokes to shapes.
    "svg_black": "https://beeactivists.com/small-black-logo.svg",
    # A full color SVG. Should look good at 32px square. Expand all texts and strokes to shapes.
    "svg_full": "https://beeactivists.com/full-color.logo.svg",
    # A full-white monochrome SVG. Should look good at 16px square. Expand all texts and strokes to shapes.
    "svg_white": "https://beeactivists.com/small-white-logo.svg"
  },

  "description": "Next gen social network using big data & AI in the cloud 🤖☁️.",

  # See the Protocol section for an explanation of these urls. All URLs must be
  # on the given `domain` or a subdomain and accessible via HTTPS.
  "prefill_url": "https://beeactivists.com/new-profile-proof?kb_username=%{kb_username}&username=%{username}&token=%{sig_hash}&kb_ua=%{kb_ua}",

  # Link to a profile page, for when users click from inside Keybase
  "profile_url": "https://beeactivists.com/profile/%{username}",

  # Endpoint for checking a user's proofs
  "check_url": "https://api.beeactivists.com/keybase-proofs.json?username=%{username}",
  # Paths are explained below
  "check_path": ["signatures"], # Path to signature list
  "avatar_path": ["avatar"], # Optional path to avatar url

  # A contact for Keybase in case of issues.
  "contact": ["admin@beeactivists.com", "sassybedazzle@keybase"]
}
```

</md><center><div style="max-width:640;margin:20px 0 40px 0">
    <img src="/images/paramproofs/logo-assets@2x.png" class="img img-responsive">
</div></center><md>

### 1.1 Config Validation

Before sending us the config you should validate that it is correct using the
following endpoint. You can pass the config directly in a `config` param or
host the config file and pass `config_url`:

```sh
$ http POST "https://keybase.io/_/api/1.0/validate_proof_config.json" config=@config.json
{
    "status": {
        "code": 100,
        "desc": "missing or invalid inputs {\"domain\":\"field is required\"}",
        "fields": {
            "config": "missing or invalid inputs {\"domain\":\"field is required\"}"
        },
        "name": "INPUT_ERROR"
    }
}
...
$ http GET "https://keybase.io/_/api/1.0/validate_proof_config.json" config_url="https://keybase.io/.well-known/example-proof-config.json"
{
    "status": {
        "code": 0,
        "name": "OK"
    }
}
```

To send us the config, you can send us the public URL for your config file or
attach it directly in a Keybase chat message to
****[@mlsteele](https://keybase.io/mlsteele)**** or email miles@keyba.se. In
our example the file is hosted at
https://keybase.io/.well-known/example-proof-config.json.

---

## 2. Protocol

Before getting into the nitty-gritty of the protocol, here is the overall flow of
requests between the Keybase clients, Keybase server, and the Identity Service.

### 2.1 Flow Overview

For this example we&rsquo;ll use the values in the config file defined above with an
example user: `josavesbees` on the BeeActivists service and `joans` on Keybase.

1. Joan clicks on a link like (
[keybase://profile/new-proof/beeactivists.com/josavesbees](keybase://profile/new-proof/mastodon.social/josavesbees)
) in BeeActivitists (or navigates to the new-proof flow manually in Keybase and searches
for beeactivists.com) to get into the start of the flow.

2. Joan is now in Keybase looking at a statement asserting ownership of
the `josavesbees` account at BeeActivists. After clicking `Authorize`, the Keybase
client creates a proof statement and stores it in `joans`&rsquo;s public [signature
chain](/docs/sigchain), and then forwards control to a URL in BeeActivists to finish the
assertions.

The above two steps can also be accomplished directly from the Keybase CLI
```sh
$ keybase prove beeactivists.com josavesbees
Please click on the following link to post to BeeActivists:
https://beeactivists.com/new-profile-proof?kb_username=joans&username=josavesbees&token=90b0ef50119e69063d3a96625195a5ea895071debbb50a111ddde2eba9d4ecf40f&kb_ua=darwin:3.0.0
```

3. Joan is now inside beeactivists.com at the link generated by Keybase.
They are either already logged in as josavesbees, or must login.
Then they are presented their Keybase username and reminded their BeeActivists username.
If the 2 usernames are what they wish to connect, they just click
&ldquo;Yes, authorize&rdquo; to finish the connection.

4. *Before actually saving this data*, BeeActivists makes a request to
Keybase to verify that the `sig_hash` is valid for this combination of
`kb_username`, `username`, and `token`. If valid, BeeActivists persists the
signature (e.g., in a relational database).

5. The signature should now be served in machine readable form
via the `check_url` endpoint from the config. It should also be seen in
human-readable form (with a link to the Keybase website) via the `profile_url`
field.

Now let&rsquo;s drill into the back-and-forth communication for each request.

### 2.2. Proof Creation

This process needs to start from Keybase so we can prepare the proof for the
Identity Service to host. To make this experience better for your users, you can
direct a user to exactly the right spot to get started in Keybase with a deeplink:
e.g. `keybase://profile/new-proof/beeactivists.com/josavesbees`

1. From Keybase, the user creates a proof and clicks a link that opens a web
browser into the Identity Service. Inside the link, Keybase embeds the hash of
the proof signature and the user’s Keybase username. The user needs to be
logged into the Identity Service at this time, so please redirect to a login
form and back if necessary.
1. The user reviews that both their `BeeActivists` username and their Keybase
usernames are correct, then authorizes the cryptographic connection.
</md>
  <center>
    <div style="width:415px;margin:20px 0 20px 0">
      <img src="/images/paramproofs/beeactivist-authorize@2x.jpg" class="img img-responsive">
      <small><br>The user has to authorize the cryptographic connection between the two identities.</small>
    </div>
  </center>
  <center>
    <div style="width:415px;margin:20px 0 20px 0">
      <img src="/images/paramproofs/beeactivist-login@2x.jpg" class="img img-responsive">
      <small><br>If josavesbees isn&rsquo;t logged in on beesactivists, they should be redirected to a login screen.</small>
    </div>
  </center>
  <md>
3. The Identity Service validates the signature with Keybase and saves this
data so it can be served during the [Proof Checking](#2-3-proof-checking) flow
described below.

Keybase creates the link via the `prefill_url` in the config, and here&rsquo;s
everything you need to know:
1. This proof should be stored forever unless it is updated or deleted by the user.
1. We allow a user of the Identity Service to claim multiple Keybase accounts
although a Keybase user may only prove one profile at at time on a given
service.
1. The creation endpoint must be accessible via HTTPS on the domain or a
subdomain of the Identity Service.
1. The `prefill_url` must have four fields for Keybase to fill in, the Keybase
username, the Identity service&rsquo;s username, signature hash ( a ~66 character hex
string), and a user agent field.  The user agent is used to redirect the client
appropriately after successful proof creation but doesn&rsquo;t need be stored.  We
recommend something simple like
`https://beeactivists.com/new-profile-proof?kb_username=%{kb_username}&username=%{username}&token=%{sig_hash}&kb_ua=%{kb_ua}`.

Here’s an example of some code that might work to create a new proof. Most of
this would normally happen in a browser, but we’ll show it in Python for extreme explicitness. This user is
`josavesbees` on BeeActivists and `joans` on Keybase.

```python
import requests

# Creating a logged-in session, because it should not be possible to prove
# ownership of an account on Bee Activists without being logged into that
# account.
session = requests.session()
login_url = "https://beeactivists.com/auth/sign_in"
result = session.get(login_url)
data = {
    "user[email]": "josavesbees@email.com",
    "user[password]": "hunter2",
}
resp = session.post(login_url, data=data, headers=dict(referrer=login_url))

# Keybase will make this GET request inside a browser for the user.
# This should put them on a page with a form that's got `joans`
# and `90b0ef50119e69063d3a96625195a5ea895071debbb50a111ddde2eba9d4ecf40f`
# filled into two fields.
prefill_url = "https://beeactivists.com/new-profile-proof?kb_username=joans&username=josavesbees&token=90b0ef50119e69063d3a96625195a5ea895071debbb50a111ddde2eba9d4ecf40f&kb_ua=darwin:3.0.0"
resp = session.get(prefill_url)

# The user in the browser will look at the values prefilled and hit submit.
# The submit endpoint can be different if you'd like, but for now, I'm just
# going to use the same url (POST with data this time instead of GET).
# Note the `kb_ua` parameter is not stored but is echoed back as a redirection
# parameter after successful creation.
data = {
    "kb_username": "joans",
    "token": "90b0ef50119e69063d3a96625195a5ea895071debbb50a111ddde2eba9d4ecf40f",
    "kb_ua": "darwin:3.0.0",
}
resp = session.post("https://beeactivists.com/new-profile-proof", data=data)
```

When validating the new proof, the identity service should call the
`sig/proof_valid` endpoint as mentioned.

```
$ http GET https://keybase.io/_/api/1.0/sig/proof_valid.json?domain=beeactivists.com&kb_username=joans&username=josavesbees&sig_hash=90b0ef50119e69063d3a96625195a5ea895071debbb50a111ddde2eba9d4ecf40f
{ "proof_valid" : true }
```

If a user tries to post a proof and the Keybase API responds that `proof_valid=false`,
the Identity Service should reject this proof. When calling
`keybase.io/_/api/1.0/sig/proof_valid.json?...` Keybase verifies
the signature preventing:
1. A user from posting an invalid signature
1. A valid signature for a different service
1. A user from claiming the wrong account on either service


#### 2.2.1 Creation Redirect

If the proof is valid, once the data is persisted by the Identity Service, the
user should be redirected back to Keybase via the following URL:
```
https://keybase.io/_/proof_creation_success?domain=beeactivists.com&kb_username=joans&username=josavesbees&sig_hash=90b0ef50119e69063d3a96625195a5ea895071debbb50a111ddde2eba9d4ecf40f&kb_ua=darwin:3.0.0`
```

Keybase will then redirect the user back into the app or the appropriate web page.


---

### 2.3. Proof Checking

Keybase needs to check the proof periodically on the Identity Service to ensure
that the user has not removed it. Similarly, the Identity Service may want to
know if the user has revoked the proof on Keybase. For this reason, there is a
protocol for both services to request the current state from one another. Keybase
will always check the Identity Services&rsquo; proofs, but it is optional for
Identity Services to check Keybase&rsquo;s proofs.

#### 2.3.1 Keybase Will Regularly Check Proofs On The Identity Service

The proof-checking endpoint on the Identity Service should return JSON that
includes a list of the Keybase usernames (and signature hashes) that the Identity
Service user has claimed. This is exactly the same information that was created above.

The `check_url` in the config can be any HTTPS endpoint on the Identity Service
domain with a spot to fill in the Identity Service username. It&rsquo;ll be easier if
this is a new endpoint, but we&rsquo;ll look at examples of both cases.

##### A New Endpoint Just for Keybase Proof Checking (the Happy Path)

Here&rsquo;s a check for `josavesbees` of Bee Activists, who has two verified
Keybase accounts.

The `check_url` in the config:
```http
https://api.beeactivists.com/keybase-proofs.json?username=%{username}
```
The response from the endpoint:

```sh
$ http GET https://api.beeactivists.com/keybase-proofs.json?username=josavesbees
{
  "signatures": [
    {
      "kb_username": "joans",
      "sig_hash": "90b0ef50119e69063d3a96625195a5ea895071debbb50a111ddde2eba9d4ecf40f"
    },
    {
      "kb_username": "joans_school",
      "sig_hash": "a2934c38dd76f01934e29d533b72ab787688f5392902225788c44af0e95c1c370f"
    }
  ]
}
```
And the `check_path`:
```
["signatures"]
```

---

##### An Existing Endpoint With Keybase Proofs Added Somewhere (Still Happy, Just a Little More Work)

Here&rsquo;s the same check with a shared endpoint.

The `check_url` in the config:
```http
https://beeactivists.com/api/u/%{username}/attestations.json
```
The response from the endpoint:

```sh
$ http GET https://beeactivists.com/api/u/josavesbees/attestations.json
{
  "attestations": [
    {
      "verified": {
        "something": "that keybase doesnt care about"
      }
    },
    {
      "verified": {
        "another thing": "that keybase doesnt care about"
      }
    },
    {
      "verified": {
        "kb123": [
          {
            "kb_username": "joans",
            "sig_hash": "90b0ef50119e69063d3a96625195a5ea895071debbb50a111ddde2eba9d4ecf40f"
          },
          {
            "kb_username": "joans_school",
            "sig_hash": "a2934c38dd76f01934e29d533b72ab787688f5392902225788c44af0e95c1c370f"
          }
        ]
      }
    },
    {
      "verified": {
        "final thing": "that keybase doesnt care about"
      }
    }
  ],
  "avatar": "https://s3.amazonaws.com/keybase_processed_uploads/0e67d0f8c3b09def87fda7d6b504a505_360_360.jpg"
}
```
And the `check_path`:
```
["attestations", 2, "verified", "kb123"]
```

##### Details

The endpoint and JSON path shouldn&rsquo;t change without notice, because there might
be older Keybase clients in the wild checking for it. It will also be used by
Keybase to determine whether or not the Identity Service is up, and whether or
not the Keybase user exists in the Identity Service. If the endpoint must be
changed, you can update your config and contact us to propagate the change.

Keybase clients and servers will always send the header `Accept:
application/json`.

If a username does not exist, then the endpoint must return a 404 status code.
This endpoint is used during the proof creation process (2.2) to determine
whether the user exists.

```sh
$ http GET https://api.beeactivists.com/keybase-proofs.json?username=doesntexist
-> status 404
```

If a user exists but has no Keybase proof claims, then the `check_url` endpoint
must return a 200 response with an empty list.

```sh
$ http GET https://api.beeactivists.com/keybase-proofs.json?username=grinch
{
  "signatures": [],
  "avatar": "https://s3.amazonaws.com/keybase_processed_uploads/0e67d0f8c3b09def87fda7d6b504a505_360_360.jpg"
}
```

Keybase clients check all of the proofs of all of the users they interact with
at most once-per-day.  So you can expect load correlated with the number of
proofs and related activity on Keybase.

##### Avatars

The `check_proof` endpoint may return the user&rsquo;s avatar. The avatar is shown to
the user while they enter a username in the app. Responding with an avatar is
encouraged, but optional.

```sh
$ http GET https://api.beeactivists.com/keybase-proofs.json?username=josavesbees
{
  "signatures": [],
  "avatar": "https://s3.amazonaws.com/keybase_processed_uploads/0e67d0f8c3b09def87fda7d6b504a505_360_360.jpg"
}
```
And the `avatar_path`:
```
["avatar"]
```

#### 2.3.2 The Identity Service May Optionally Check Proofs On Keybase After Creation

We have exposed an endpoint that looks very similar to the `proof_valid` endpoint
above, except this one additionally verifies that the proof is live on the
Identity Service. This should only be called after the proof has been created
successfully on the Identity Service and is served at the proof checking
endpoint.

```
$ http GET https://keybase.io/_/api/1.0/sig/proof_live.json?domain=beeactivists.com&kb_username=joans&username=josavesbees&sig_hash=90b0ef50119e69063d3a96625195a5ea895071debbb50a111ddde2eba9d4ecf40f
{ "proof_live" : true, "proof_valid" : true }
```

When calling `keybase.io/_/api/1.0/sig/proof_live.json?...` Keybase checks
that the signature for this user is valid on Keybase and accessible on BeeActivists.
More info about accessibility and linking at
[linking user profile section](#3-linking-user-profiles).

BeeActivists, to create a better experience for its users, may want to persist
and periodically update 2 fields per proof that track whether or not Keybase
thinks the proof is valid and live. This would enable BeeActivists to, for example,
hide the link on the user profile page to Keybase if it&rsquo;s not currently live.

In particular, for the best user experience, the Identity Service should keep
the proof hidden on the user&rsquo;s profile page until it is live.

When a user creates a proof, after the user is redirected to the
`proof_creation_success` endpoint on Keybase, the Identity Service can poll for
the liveness of the proof asynchronously and update a record in the database
when the check succeeds, causing the proof to be shown on the user&rsquo;s
profile page.

Additionally, whenever a user visits their own profile after the fact, the
Identity Service can check the liveness of the user&rsquo;s Keybase proofs and
update the database records, so the user sees the latest data.

If the Identity Service does not want to run these checks, a [proof
badge](#3-linking-user-profiles) is recommended so users on the Identity
Service can see when a proof is no longer live.

### 2.4 Proof Deletion

A proof can be deleted in two ways:
1. The user deletes the proof from Identity Service. This causes the periodic
check by Keybase clients and server to fail, and the proof will show as failing
on that user&rsquo;s Keybase profile. There will also be indications of the
failure to other users tracking them. It is not required, but helpful if the
Identity Service makes a request to the `proof_live` endpoint after deleting
the proof from the database so Keybase immediately knows that the proof is
deleted.
1. The user revokes a signature through Keybase (rendering it invalid). Keybase
clients will ignore the revoked proof and, if the Identity Service is
periodically checking proof liveness on Keybase, it will also be able to hide
them. If the Identity Service is [displaying badges](#3-linking-user-profiles),
then the proof will be marked as &ldquo;Revoked.&rdquo;


## 3. Linking User Profiles

In addition to the proof creation and checking flows, one other step is
part of the integration: a link on the Identity Service to the corresponding
verified Keybase profile. Keybase will also link to the user&rsquo;s profile on the
Identity Service on their Keybase profile.

The URL format to link to Keybase profiles via a specific signature is:
`https://keybase.io/%{kb_username}/sigs/%{sig_hash}`.

For our running example this could look like:

```html
<a href="https://keybase.io/joans/sigs/90b0ef50119e69063d3a96625195a5ea895071debbb50a111ddde2eba9d4ecf40f">
    @joans on keybase
</a>
```

Additionally, you can optionally include a badge: a small SVG image provided by
the Keybase server that displays the proof&rsquo;s status. With the badge, if the
user deletes the proof on Keybase but not on the the Identity Service, visitors
can tell that the proof is no longer valid at a glance.

The endpoint for a proof&rsquo;s badge is:
`https://keybase.io/%{kb_username}/proof_badge/%{sig_hash}?domain=beeactivists.com&username=josavesbees`.
In addition to the plaintext link above, you can add:

```html
<a href="https://keybase.io/joans/sigs/90b0ef50119e69063d3a96625195a5ea895071debbb50a111ddde2eba9d4ecf40f">
    <img alt="Keybase proof status" src="https://keybase.io/joans/proof_badge/90b0ef50119e69063d3a96625195a5ea895071debbb50a111ddde2eba9d4ecf40f?domain=beeactivists.com&username=josavesbees">
</a>
```
A successful proof has a badge like this:
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="110" height="20"><title>Keybase proof status: ok</title><linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="a"><rect width="110" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#a)"><path fill="#555" d="M0 0h55v20H0z"/><path fill="#97CA00" d="M55 0h55v20H55z"/><path fill="url(#b)" d="M0 0h110v20H0z"/></g><g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110"> <text x="285" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="450">keybase</text><text x="285" y="140" transform="scale(.1)" textLength="450">keybase</text><text x="815" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="450">proof ok</text><text x="815" y="140" transform="scale(.1)" textLength="450">proof ok</text></g> </svg>
<br>

If you don&rsquo;t want to use the badge or you want to hide failing proofs instead
of showing a failing badge, you can use the `sig/proof_live` endpoint detailed in
the [Proof Checking](#2-3-proof-checking) section.

## 4. Steps to Rollout
1. Implement the [proof-creation flow](#2-2-proof-creation)
1. Implement the [proof-checking flow](#2-3-proof-checking)
1. [Add a link](#3-linking-user-profiles) on your users&rsquo; profile screens if
they&rsquo;ve claimed a Keybase account, and if Keybase agrees that the signature is
valid.
1. [Verify your config](#1-1-config-validation) with the validation endpoint
1. Send the config file or public URL as a chat message to
**[@mlsteele](https://keybase.io/mlsteele)** or email miles@keyba.se and we&rsquo;ll
flip the rest of the switches on our end.

## 5. Resources
1. [Python reference implementation](https://github.com/keybase/django-keybase-proofs)
and drop-in Django library
1. [Clojure reference implementation](https://github.com/keybase/colorbase), [Clojure helper library](https://github.com/keybase/clj-keybase-proofs)
1. [Verification script](/docs/proof_integration_guide/verification_script)
1. [Keybase Logo](https://github.com/keybase/client/tree/master/media/logos/PNGs)

## 6. Getting in touch
If you’re ready to turn on the integration, have questions about the process or
feedback for making integrations easier, send a message to
**[@mlsteele](https://keybase.io/mlsteele)** on Keybase.

</div>
