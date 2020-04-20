# Proof Verification Language

## Overview

The proof verification language (PVL) is a restricted json-based language for describing how clients should validate keybase proofs.

The problem this solves is that if a proof service (for example reddit) quickly changes its presentation, keybase clients should adapt quickly and continue verifying proofs.

The active PVL instructions can be updated by the keybase server quicker than we can update clients. Especially mobile clients.

Clients get the latest PVL from the server if a proof service changes its format. A change in PVL can change how the client fetches and validates the proof data.

## Security

Clients fetch PVL instructions from the keybase server and use it when they validate proofs. The keybase server logs the hash of the PVL it serves in an auditable Merkle tree. Clients always check fetched PVL against the merkle tree to guarantee they only execute auditable PVL.

Compromising the keybase server and sending attacker-controlled PVL to the client should never cause the client to execute arbitrary code. PVL will stay limited enough to not do any damage.

Compromising the keybase server and sending bogus PVL could cause clients to accept validations which are not correct. For example, if Eve controlled the keybase server, she could successfully claim Alice's twitter account by posting Eve's own signature of a claim of Alice's username and pushing a change of the PVL for twitter to clients so that they fetch from the wrong user's feed. This is a problem, but is offset by auditing.

If the keybase server ever sends bad PVL to a client (and it is accepted by the client) there will be an audit trail. An independent auditor will be able to find out what malicious PVL was sent. To reiterate, the current PVL will be hashed into a merkle tree and clients will always validate new PVL against the merkle tree.

## Updating active PVL
### Server
The server serves a PVL blob for each version of the PVL spec that we support. So there might at some point be a different blob for `pvl_version` 2 and 3 and none for version 1. Each client can only run one version of PVL. All PVL blobs are hashed into the merkle tree so they can be validated.

If the server does not serve a PVL blob for some (old) `pvl_version` then that causes clients at that version to throw out their existing PVL blob and they will be unable to validate proofs. This means if we find a security bug in proof validation, but can't fix it in that version of the PVL spec, then we can disable those clients immediately.

### (A) Client wants to validate a proof and has no local PVL

1. A client begins its life with no active PVL blob. The first time it wants to validate a proof, it must fetch a current PVL blob for its `pvl_version` from the server along with the chain tying the blob to the merkle tree.
2. If there is no PVL blob for its `pvl_version` being served, it informs the user that the client is out of date and aborts the proof check.
3. If the PVL is invalid or it doesn't validate against merkle tree, it discards the PVL and aborts. The client is free to try again later.
4. The client stores the validated blob in its local db for later use.
5. It then executes the PVL to check proofs.

### (B) Existing client wants to validate a proof, and PVL has not changed (common case)

1. The client finds out from the server the hash of the active PVL blob for its `pvl_version`. In this case it is the same as its current version.
2. The client executes its stored PVL to check proofs.

### (C) Existing client wants to validate a proof, and PVL has changed

1. The client finds out from the server the hash of the active PVL blob for its `pvl_version`. In this case it is different or doesn't exist.
2. The client throws out its existing PVL and does as described in A.

## Tools
To see the current pvl chunk and tooling for updating it, see https://github.com/keybase/client/tree/master/pvl-tools

## Structure

This section describes the structure of a PVL chunk.

The examples in this document are all written in CoffeeScript (CSON). But the format that will be signed and sent to clients is JSON. If you would like to see a pretty-printed json version of something in this document, run this and quickly paste the cson version:

```sh
cson2json | underscore print
```

You will need [cson2json](https://www.npmjs.com/package/cson) and [underscore-cli](https://www.npmjs.com/package/underscore-cli)

### Top

At the top level PVL is a map from proof service names to a service entry describing how to validate a proof.

```coffeescript
pvl_version: 1 # The version of the pvl spec this is written for
revision: 1    # What revision of the scripts validation scripts we're on
services:
  coinbase: [...]
  dns: [...]
  github: [...]
  reddit: [...]
  rooter: [...]
  twitter: [...]
  web: [...]
```

### Service Entry

Each service entry is a list of scripts. Each script is a list of instructions. Each script is tried one by one in a short-circuiting OR. If any script succeeds, the proof is ok. If all scripts fail, the proof is invalid. This is done so that if we catch a service in the middle of a split-test or deployment, we can write one script for each type of response.

When a client runs a script, the script has limited access to the RemoteProofChainLink and the hint from the keybase server. From the server gets `hint_url` which is a URL where the proof data is.

Each script describes how to first validate the hint URL and then fetch and validate the proof.

Here is an example of a service entry with 1 script:

```coffeescript
generic_web_site: [[
  # URL validation. Must be HTTP or HTTPS. Must be a known path from the proof domain.
  { assert_regex_match: {
    , pattern: "^%{protocol}://%{hostname}/(?:\\.well-known/keybase\\.txt|keybase\\.txt)$"
    , from: "hint_url"
    , error: ["BAD_API_URL", "Bad hint from server; didn't recognize API url: \"%{hint_url}\""]} },
  { fetch: {
    , kind: "string"
    , from: "hint_url"
    , into: "blob" } },
  # Verify and find the sig.
  { assert_find_base64: {
    , needle: "sig"
    , haystack: "blob"
    , error: ["TEXT_NOT_FOUND", "signature not found in body"] } },
]]
```

And here it is again in JSON:

```json
"generic_web_site": [[
  {"assert_regex_match": {
    "pattern": "^%{protocol}://%{hostname}/(?:\\.well-known/keybase\\.txt|keybase\\.txt)$",
    "from": "hint_url",
    "error": ["BAD_API_URL", "Bad hint from server; didn't recognize API url: \"%{hint_url}\""] } },
  {"fetch": {
    "kind": "string",
    "from": "hint_url",
    "into": "blob" } },
  {"assert_find_base64": {
    "needle": "sig",
    "haystack": "blob",
    "error": ["TEXT_NOT_FOUND", "signature not found in body"] } }
]]
```

### Registers
Instructions can read and write named registers. Each register stores a string value, can only be set once, and cannot be read before being set. Registers must be named according to `[a-z0-9_]+`.

Some registers are pre-filled before the script is run. These special registers are described in the following table. A few of these special registers do not make sense in certain proof types, for example `username_service` does not make sense in DNS proofs. Such registers are banned in those situations and cannot be read or set.

When register values are substituted into regexes they are regex-escaped by the client. The proof sig is opened in order to derive the shorter sig IDs.

This is a complete list of the pre-set registers:

| Variable name      | Meaning                      | Example value                         | Comment                                                   |
|--------------------|------------------------------|---------------------------------------|-----------------------------------------------------------|
| `hint_url`         | hint url from keybase server | https://gist.github.com/github/etc.md |                                                           |
| `username_service` | username on the service      | cjbprime                              | Banned in web/dns proofs                                  |
| `username_keybase` | username on keybase          | cjb                                   |                                                           |
| `sig`              | full signature of the proof  | owG...HAA                             | b64 encoded proof sig                                     |
| `sig_id_medium`    | medium length sig id         | BYA...Q1I                             |                                                           |
| `sig_id_short`     | short sig id                 | 970...icQ                             |                                                           |
| `hostname`         | hostname for DNS or web      | printf.net                            | Banned except in web/dns proofs. Validated.               |
| `protocol`         | protocol for web proofs      | https                                 | Banned except in web proofs. Validated and canonicalized. |

There is a little bit of hidden storage too. When an HTML or JSON fetch occurs, the parsed response is stored where only the `selector_css` or `selector_json` instructions can access implicitly. The `assert_find_base64` uses the bytes version of the sig, and so can only be run on the sig variable.

### Script Instructions

Each script instruction is a json object; a map from instruction name to another map containing its arguments. Script instructions are run in order. A script cannot be empty. Each script must end in an assertion. At most one fetch instruction can exist in a script.

In the end a script can either succeed in which case the proof is valid or fail with an error in which case it is not. See the error reporting section below for more. A script succeeds if it makes it to the end.

#### assert_regex_match
This instruction asserts that the supplied regex `pattern` matches the value of the register named in `from`. The provided regex must be of the form `^body$` where body can include register substitutions. The `^$` are required because they are easy to forget. Searching for a substring can be done explicitly with `^.*stuff.*$`. Register substitutions are of the form `%{varname}`. Values must be regex escaped by the client. Additional options `case_insensitive`, `multiline`, and `negate` are optional and default to false.

```coffeescript
{ assert_regex_match: {
  , pattern: "^keybaseproofs$"
  , case_insensitive: true
  , from: "subreddit_from_url" } }
```

#### assert_find_base64
Assert that the register value named by `needle` can be found in the register value named by `haystack`. Uses custom base64 value finder functions like [`FindBase64Block`](https://github.com/keybase/client/blob/master/go/libkb/base64_finder.go#L116) in `base64_finder.go` that are especially resilient to whitespace. `sig` is the only valid variable to use.

```coffeescript
{ assert_find_base64: {
  , needle: "sig"
  , haystack: "selftext" } }
```

#### assert_compare
Assert that the two registers named by `a` and `b` contain values equivalent according to the comparison function `cmp`.

Possible comparisons are:
- `exact`: Exact string comparison
- `cicmp`: Case insensitive comparison
- `stripdots-then-cicmp`: Strip away `'.'` characters and then cicmp.

```coffeescript
{ assert_compare: {
  , cmp: "stripdots-then-cicmp"
  , a: "username_from_url"
  , b: "username_service" } }
```

#### whitespace_normalize

Normalize whitespace so that all runs of consecutive whitespace become one space. Trims whitespace off the front and end of the string. Reads from register `from` and into register `into`.

```coffeescript
{ whitespace_normalize: {
  , from: "header"
  , into: "header_nw" } }
```

#### regex_capture
Assert that the regex `pattern` matches the register `from`. Substitution and options are allowed as in `assert_regex_match`. The regex should have at least one capture group. If the regex matches then the capture group results are loaded into the registers specified by the `into` array. If there are not enough matches, the instruction fails.

```coffeescript
{ regex_capture: {
  , pattern: "^ *(?:@[a-zA-Z0-9_-]+\\s*)* *Verifying myself: I am ([A-Za-z0-9_]+) on Keybase\\.io\\. (\\S+) */.*$"
  , case_insensitive: true
  , from: "tweet_contents_nw"
  , into: ["username_from_tweet_contents", "sig_from_tweet_contents"] } }
```

#### replace_all
Replace all occurrences of the string `old` with the string `new` in the `from` register and put the result in the `into` register.

```coffeescript
{ replace_all: {
  , old: "-\\-\\"
  , new: "--"
  , from: "fcc1"
  , into: "fcc2" } },
```

#### parse_url
Take a url from register `from`, assert that it is a valid url, and parse it into pieces. The pieces `path`, `host`, and `scheme` can be optionally specified and those parts of the url will be loaded into the specified registers.

```coffeescript
{ parse_url: {
  , from: "username_link"
  , path: "link_path" } },
```

#### fetch
Fetch the URL contained in the register named by `from` as one of `html`, `json`, or `string`. There is no option for DNS because DNS is specially handled. For HTML and JSON, the response is parsed and tucked away in special storage where the selector instructions can read it. In the case of a string fetch, an `into` register must be specified which will contain the response.

At most one fetch instruction can exist in a script.

```coffeescript
{ fetch: {
  , kind: "string"
  , from: "hint_url"
  , into: "profile" } },
```

#### parse_html
Parse the contents of the register `from` as html. The resulting DOM is stored in the special storage where the selector instructions can read it. It overwrites the original page load.

```coffeescript
{ parse_html: {
  , from: "ihavehtml" } },
```

#### selector_json
Traverse a json document and select an element. If the value is not a string, it will be serialized according to json. The `selectors` list is a list of keys or indices. So the example below is the same as in javascript `root_object[0]["data"]["children"][0]["data"]["author"]`. If the selector cannot be followed, the script fails the proof.

A `selector_json` instruction can only appear in a script with a json-typed fetch. This will be detected as part of validating a PVL chunk.

If an index is negative, it looks for that element from the end python-style. If an index is the special `{all: true}` object then the rest of the selector is run on all elements of the array or values of the object and the result strings are concatenated with a separating space.

```coffeescript
{ selector_json: {
  , selectors: [0, "data", "children", 0, "data", "author"]
  , into: "author" } }
```

#### selector_css
Select an html element from a document and extract the text or attribute as a string. Selection is always from the root of the fetch result. Provide a list of CSS selector strings or indices. Each selector/index is followed in order. If the selection contains no elements, the script fails the proof.

The `attr` string field specifies what attribute to extract from the element.
The `data` bool field specifies whether to get the data (including comments) of the first node in each selection element.
If the `attr` field is not present and `data` is false (the defaults) then the text content of the selection is extracted.

If an index is negative it looks for that element from the end.

If a selector entry is the special value `{contents: true}` then that is equivalent to calling `.contents()` in jquery.

An optional `multi` key may be provided and if its value is true, then if the selection at the end contains multiple elements, the result strings are concatenated with a separating space. By default, if the selector matches multiple elements, the script fails.

```coffeescript
{ selector_css: {
  , selectors: [ "div.permalink-tweet-container div.permalink-tweet", 0 ]
  , attr: "data-screen-name"
  , into: "screen_name" } }
```

#### fill
Fill a register `into` with a string `with`. The `with` can contain register substitutions like `assert_regex_match` but they will not be regex-escaped in this step.

```coffeescript
{ fill: {
  , with: "https://coinbase.com/%{username_service}/public-key"
  , into: "our_url" } },
```

## Error Reporting

There are several types of failures (see `prove_common.avdl`):

- Retryable soft errors (100): for example HTTP 500.
- Medium errors (200): for example HTTP 400.
- Hard errors (300): for example bad signature.
- PVL is invalid (which is in the 300's)

If a PVL chunk is invalid and a script cannot be read for a proof type, the checker will report `INVALID_PVL`.

For errors that occur while validating a proof, the PVL interpreter will report default errors, which individual instructions can override.

If a failure occurs while running the `fetch` instruction, the interpreter will do the right thing.

For customized reporting, an additional `error` field is supported for every instruction. The `error` field must contain a pair of error name and description string which will be reported to the user.

```coffeescript
error: ["CONTENT_FAILURE", "Bad author; wanted \"%{username_service}\", got \"%{author_from_tweet}\""]
```

## DNS
DNS is a little special. And will also not change its protocol faster than we can update an app. So here's how it works.

The DNS script can not contain any fetch instructions.

The `hostname` TXT records are fetched. Each DNS script is run against each txt record with the `txt` register set to the record value. If the script succeeds on *any*, then the proof succeeds. If that doesn't work, the process is repeated for `_keybase.proof.domain`.

Here is the DNS service entry, which is expected not to change:

```coffeescript
dns: [[
  { assert_regex_match: {
    , pattern: "^keybase-site-verification=%{sig_id_medium}$"
    , from: "txt"
    , error: ["NOT_FOUND", "matching DNS entry not found"] } },
]]
```

## Limitations
PVL cannot run scripts which fetch from more than one URL.

There are no branches or loops, the same instructions execute in the same order every time a script is run.

## Examples
### Full PVL
This example aims to capture our current (11/18/2016 5e09b59) proof validation rules.

```coffeescript
pvl_version: 1
revision: 1
services:
  coinbase: [[
    # make the url (we don't need the hint)
    { fill: {
      , with: "https://coinbase.com/%{username_service}/public-key"
      , into: "our_url" } },
    # fetch
    { fetch: {
      , kind: "html"
      , from: "our_url" } },
    # find the sig
    { selector_css: {
      , selectors: ["pre.statement", 0]
      , into: "haystack"
      , error: ["FAILED_PARSE", "Couldn't find a div $(pre.statement)"] } },
    { assert_find_base64: {
      , needle: "sig"
      , haystack: "haystack" }
      , error: ["TEXT_NOT_FOUND", "signature not found in body"] },
  ]]
  dns: [[
    # DNS has no hint. And it checks every txt record on two domains. And errors are handled specially.
    # So everything is kind of different.
    # Check this regex on each txt entry. If any match, the check succeeds.
    { assert_regex_match: {
      , pattern: "^keybase-site-verification=%{sig_id_medium}$"
      , from: "txt"
      , error: ["NOT_FOUND", "matching DNS entry not found"] } },
  ]]
  facebook: [[
    # Check that the claimed username has no slashes or funny business that
    # might trick us into checking a different url.
    # Facebook usernames don't actually allow any special characters, but it's
    # still possible for a malicious user to *claim* they have some slashes
    # and a question mark in their name, in the hopes that that will trick us
    # into hitting a totally unrelated URL. Guard against that happening by
    # checking for special characters in the claimed name.
    { assert_regex_match: {
      , pattern: "^[a-zA-Z0-9\\.]+$"
      , from: "username_service"
      , error: ["BAD_USERNAME", "Invalid characters in username '%{username_service}'"] } },

    # Check the provided url and extract the username and path.
    # Accept either mobile or desktop urls. The fetched url will be rewritten later.
    # We want to be strict about the structure of the url.
    # No query parameters, no unexpected characters in the post ID.
    { regex_capture: {
      , pattern: "^https://(m|www)\\.facebook\\.com/([^/]*)/posts/([0-9]+)$"
      , from: "hint_url"
      , into: ["unused1", "username_from_url", "post_id"]
      , error: ["BAD_API_URL", "Bad hint from server; URL should start with 'https://m.facebook.com/%{username_service}/posts/', got '%{hint_url}'"] } },

    # Check that the claimed username matches the url.
    # Checking for the correct username is essential here. We rely on this
    # check to prove that the user in question actually wrote the post. (Note
    # that the m-site does *not* enforce this part of the URL. Only the
    # desktop site does.)
    { assert_compare: {
      , cmp: "stripdots-then-cicmp"
      , a: "username_from_url"
      , b: "username_service"
      , error: ["BAD_API_URL", "Bad hint from server; username in URL should match '%{username_service}', received '%{username_from_url}'"] } },

    # Create the desktop url using the validated username and (not validated) post id.
    { fill: {
      , with: "https://www.facebook.com/%{username_from_url}/posts/%{post_id}"
      , into: "our_url" } },
    { fetch: {
      , kind: "html"
      , from: "our_url" } },

    # Get the contents of the first (only) comment inside the first <code>
    # block. Believe it or not, this comment contains the post markup below.
    { selector_css: {
      , selectors: ["code", 0, {contents: true}, 0]
      , into: "first_code_comment"
      , data: true
      , error: ["FAILED_PARSE", "Could not find proof markup comment in Facebook's response"] } },

    # Facebook escapes "--" as "-\-\" and "\" as "\\" when inserting text into
    # comments. Unescape these.
    { replace_all: {
      , old: "-\\-\\"
      , new: "--"
      , from: "first_code_comment"
      , into: "fcc2" } },
    { replace_all: {
      , old: "\\\\"
      , new: "\\"
      , from: "fcc2"
      , into: "fcc3" } },

    # Load the de-escaped comment as html
    { parse_html: {
      , from: "fcc3"
      , error: ["FAILED_PARSE", "Failed to parse proof markup comment in Facebook post: %{fcc3}"] } },

    # This query operates on the newly extractaparsed comment, not the original page load
    # This is the selector for the post attachment links, which contains the
    # proof text. It's the "<a> tags inside the div that's the immediate
    # *sibling* of the 'userContet' div". The second of these three <a> tags
    # contains the proof text, the others are blank. But we just check their concatenation.
    { selector_css: {
      , selectors: ["div.userContent+div a"]
      , multi: true
      , into: "link_text"
      , error: ["FAILED_PARSE", "Could not find link text in Facebook's response"] } },
    { whitespace_normalize: {
      , from: "link_text"
      , into: "link_text_nw" } },

    # Check the link text for username and sig
    { regex_capture: {
      , pattern: "^Verifying myself: I am (\\S+) on Keybase.io. (\\S+)$"
      , from: "link_text_nw"
      , into: ["username_from_link", "sig_from_link"]
      , error: ["TEXT_NOT_FOUND", "Could not find Verifying myself: I am %{username_keybase} on Keybase.io. (%{sig_id_medium})"] } },
    # Check username in link text
    { assert_compare: {
      , cmp: "cicmp"
      , a: "username_from_link"
      , b: "username_keybase"
      , error: ["BAD_USERNAME", "Wrong keybase username in post '%{username_from_link}' should be '%{username_keybase}'"] } },
    # Check the sig id in the link text
    { assert_compare: {
      , cmp: "exact"
      , a: "sig_id_medium"
      , b: "sig_from_link"
      , error: ["BAD_SIGNATURE", "Could not find sig; '%{sig_from_link}' != '%{sig_id_medium}'"] } },
  ]]
  github: [[
    # validate url and extract username
    { regex_capture: {
      , pattern: "^https://gist\\.github(?:usercontent)?\\.com/([^/]*)/.*$"
      , from: "hint_url"
      , into: ["username_from_url"]
      , error: ["BAD_API_URL", "Bad hint from server; URL should start with either https://gist.github.com OR https://gist.githubusercontent.com"] } },
    { assert_compare: {
      , cmp: "cicmp"
      , a: "username_from_url"
      , b: "username_service"
      , error: ["BAD_API_URL", "Bad hint from server; URL should contain username matching %{username_service}; got %{username_from_url}"] } },
    { fetch: {
      , kind: "string"
      , from: "hint_url"
      , into: "haystack" } },
    # find the sig
    { assert_find_base64: {
      , needle: "sig"
      , haystack: "haystack" }
      , error: ["TEXT_NOT_FOUND", "signature not found in body"] },
  ]]
  hackernews: [[
    # validate url and extract username
    { regex_capture: {
      , pattern: "^https://hacker-news\\.firebaseio\\.com/v0/user/([^/]+)/about.json$"
      , from: "hint_url"
      , into: ["username_from_url"]
      , error: ["BAD_API_URL", "Bad hint from server; URL should match https://hacker-news.firebaseio.com/v0/user/%{username_service}/about.json"] } },
    { assert_compare: {
      , cmp: "cicmp"
      , a: "username_from_url"
      , b: "username_service"
      , error: ["BAD_API_URL", "Bad hint from server; URL should contain username matching %{username_service}; got %{username_from_url}"] } },
    { fetch: {
      , kind: "string"
      , from: "hint_url"
      , into: "profile" } },
    { assert_regex_match: {
      , pattern: "^.*%{sig_id_medium}.*$"
      , from: "profile"
      , error: ["TEXT_NOT_FOUND", "Posted text does not include signature '%{sig_id_medium}'"] } },
  ]]
  reddit: [[
    # validate the url
    { regex_capture: {
      , pattern: "^https://www.reddit.com/r/([^/]+)/(.*)$"
      , from: "hint_url"
      , into: ["subreddit_from_url", "path_remainder"]
      , error: ["BAD_API_URL", "URL should start with 'https://www.reddit.com/r/keybaseproofs'"] } },
    { assert_regex_match: {
      , pattern: "^keybaseproofs$"
      , case_insensitive: true
      , from: "subreddit_from_url"
      , error: ["BAD_API_URL", "URL contained wrong subreddit '%{subreddit_from_url}' !+ 'keybaseproofs'"] } },
    { fetch: {
      , from: "hint_url"
      , kind: "json" } },
    # check that the first thing is a Listing
    { selector_json: {
      , selectors: [0, "kind"]
      , into: "kind"
      , error: ["CONTENT_MISSING", "Could not find 'kind' in json"] } },
    { assert_regex_match: {
      , pattern: "^Listing$"
      , from: "kind"
      , error: ["CONTENT_FAILURE", "Wanted a post of type 'Listing', but got %{kind}"] } },
    # check that the inner thing is a t3
    { selector_json: {
      , selectors: [0, "data", "children", 0, "kind"]
      , into: "inner_kind"
      , error: ["CONTENT_MISSING", "Could not find inner 'kind' in json"] } },
    { assert_regex_match: {
      , pattern: "^t3$"
      , from: "inner_kind"
      , error: ["CONTENT_FAILURE", "Wanted a child of type 't3' but got %{inner_kind}"] } },
    # check the subreddit
    { selector_json: {
      , selectors: [0, "data", "children", 0, "data", "subreddit"]
      , into: "subreddit_from_json"
      , error: ["CONTENT_MISSING", "Could not find 'subreddit' in json"] } },
    { assert_regex_match: {
      , pattern: "^keybaseproofs$"
      , case_insensitive: true
      , from: "subreddit_from_json"
      , error: ["CONTENT_FAILURE", "Wrong subreddit %{subreddit_from_json}"] } },
    # check the author
    { selector_json: {
      , selectors: [0, "data", "children", 0, "data", "author"]
      , into: "author"
      , error: ["CONTENT_MISSING", "Could not find author in json"] } },
    { assert_compare: {
      , cmp: "cicmp"
      , a: "author"
      , b: "username_service"
      , error: ["BAD_USERNAME", "Bad post author; wanted '%{username_service} but got '%{author}'"] } },
    # check the title
    { selector_json: {
      , selectors: [0, "data", "children", 0, "data", "title"]
      , into: "title"
      , error: ["CONTENT_MISSING", "Could not find title in json"] } },
    { assert_regex_match: {
      , pattern: "^.*%{sig_id_medium}.*$"
      , from: "title"
      , error: ["TITLE_NOT_FOUND", "Missing signature ID (%{sig_id_medium})) in post title '%{title}'"] } },
    # check the selftext
    { selector_json: {
      , selectors: [0, "data", "children", 0, "data", "selftext"]
      , into: "selftext"
      , error: ["CONTENT_MISSING", "Could not find selftext in json"] } },
    { assert_find_base64: {
      , needle: "sig"
      , haystack: "selftext"
      , error: ["TEXT_NOT_FOUND", "signature not found in body"] } },
  ]]
  rooter: [[
    # URL validation.
    { assert_regex_match: {
      , pattern: "^https?://[\\w:_\\-\\.]+/_/api/1\\.0/rooter/%{username_service}/.*$"
      , case_insensitive: true
      , from: "hint_url" } },
    # rooter is special cased by the interpreter to hit the api server
    { fetch: {
      , from: "hint_url"
      , kind: "json" } },
    { selector_json: {
      , selectors: ["status", "name"]
      , into: "name" } },
    { assert_regex_match: {
      , pattern: "^ok$"
      , case_insensitive: true
      , from: "name" } },
    { selector_json: {
      , selectors: ["toot", "post"]
      , into: "post" } },
    { assert_regex_match: {
      , pattern: "^.*%{sig_id_medium}.*$"
      , from: "post" } },
  ]]
  twitter: [[
    # Twitter verification is a HTML fetch and two checks.
    # One that the correct user posted the tweet according to data-screen-name.
    # And another that the proof hash is in the tweet text.

    # validate url and extract username
    { regex_capture: {
      , pattern: "^https://twitter\\.com/([^/]+)/.*$"
      , from: "hint_url"
      , into: ["username_from_url"]
      , error: ["BAD_API_URL", "Bad hint from server; URL should start with 'https://twitter.com/%{username_service}/'"] } },
    { assert_compare: {
      , cmp: "cicmp"
      , a: "username_from_url"
      , b: "username_service"
      , error: ["BAD_API_URL", "Bad hint from server; URL should contain username matching %{username_service}; got %{username_from_url}"] } },
    # url validation passed
    { fetch: {
      , from: "hint_url"
      , kind: "html" } },
    # Check the author.
    { selector_css: {
      , selectors: [ "div.permalink-tweet-container div.permalink-tweet", 0 ]
      , attr: "data-screen-name"
      , into: "data_screen_name"
      , error: ["FAILED_PARSE", "Couldn't find a div $(div.permalink-tweet-container div.permalink-tweet).eq(0)"] } },
    { assert_compare: {
      , cmp: "cicmp"
      , a: "data_screen_name"
      , b: "username_service"
      , error: ["BAD_USERNAME", "Bad post authored: wanted ${username_service} but got %{data_screen_name}"] } },
    # Check the username in the tweet. Case insensitive.
    { selector_css: {
      , selectors: ["div.permalink-tweet-container div.permalink-tweet", 0, "p.tweet-text", 0]
      , into: "tweet_contents"
      , error: ["CONTENT_MISSING", "Missing <div class='tweet-text'> container for tweet"] } },
    { whitespace_normalize: {
      , from: "tweet_contents"
      , into: "tweet_contents_nw" } },
    # Strip mentions off the front. Get username and sig.
    { regex_capture: {
      , pattern: "^ *(?:@[a-zA-Z0-9_-]+\\s*)* *Verifying myself: I am ([A-Za-z0-9_]+) on Keybase\\.io\\. (\\S+) */.*$"
      , from: "tweet_contents_nw"
      , into: ["username_from_tweet_contents", "sig_from_tweet_contents"]
      , error: ["DELETED", "Could not find 'Verifying myself: I am %{username_keybase} on Keybase.io. %{sig_id_short}'"] } },
    # Check username in tweet body
    { assert_compare: {
      , cmp: "cicmp"
      , a: "username_from_tweet_contents"
      , b: "username_keybase"
      , error: ["BAD_USERNAME", "Wrong username in tweet '%{username_from_tweet_contents}' should be '%{username_keybase}'"] } },
    # Check the sig id in the tweet.
    { assert_regex_match: {
      , pattern: "^%{sig_id_short}$"
      , from: "sig_from_tweet_contents"
      , error: ["TEXT_NOT_FOUND", "Could not find sig '%{sig_from_tweet_contents}' != '%{sig_id_short}'"] } },
  ]]
  generic_web_site: [[
    # URL validation. Must be HTTP or HTTPS. Must be a known path from the proof domain.
    { assert_regex_match: {
      , pattern: "^%{protocol}://%{hostname}/(?:\\.well-known/keybase\\.txt|keybase\\.txt)$"
      , from: "hint_url"
      , error: ["BAD_API_URL", "Bad hint from server; didn't recognize API url: \"%{hint_url}\""]} },
    { fetch: {
      , kind: "string"
      , from: "hint_url"
      , into: "blob" } },
    # Verify and find the sig.
    { assert_find_base64: {
      , needle: "sig"
      , haystack: "blob"
      , error: ["TEXT_NOT_FOUND", "signature not found in body"] } },
  ]]
```
