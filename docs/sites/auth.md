#{partial './kbp_header.toffee'}

{# yername = me?.basics?.username or 'yourname' #}
{# botname = 'kbpbot' #}

<div id="introducing-kbp">

<md>

## Access Control with .kbp_config

`.kbp_config` is an optional `json`-encoded configuration file. By default,
Keybase Pages enables reading and listing for the entire site. If you prefer to
turn off directory listing, or want a simple ACL control using [HTTP Basic
Authentication](https://tools.ietf.org/html/rfc2617), you can create such a
file at the root of your site. For example if your site is configured to
`"kbp=/keybase/private/alice,kbpbot/my-site"`, `.kbp_config` should be at
`/keybase/private/alice,kbpbot/my-site/.kbp_config`.

To make editing the config file easy, we have a command-line tool that can
completely replace editing .kbp_config by hand.

Install it with `go get`:

```
go get -u github.com/keybase/client/go/kbfs/kbpagesconfig
```

`kbpagesconfig` operates on (creates if needed) `.kbp_config` in the current
directory, so typically you can `cd` into the site root and use it:

```bash
$ cd /keybase/private/#{yername},#{botname}/my-site
$ kbpagesconfig ...
```

Or override the directory using `-d` flag:

```bash
$ kbpagesconfig -d /keybase/private/#{yername},#{botname}/my-site ...
```

Watch [this asciinema
recording](https://asciinema.org/a/AOPxXIhC4vNCj04T1fzaydzZg) or continue
reading for some examples!


### How Keybase Pages uses .kbp_config

If `.kbp_config` exists, Keybase Pages servers assume a predefined structure
composed of mainly two parts, a user map for `users` and (bcrypt'ed) password
pairs, and an `acls` map that defines permissions on each specified path. When
a Keybase Pages server (`kbpagesd`) receives an incoming request for the site,
it roughly goes through the following steps: 

1. Try to authenticate the request using HTTP Basic Authentication, and map the
request to either anonymous, or a pre-defined user.

2. Look for the ACL in the config that most accurately matches the requested
path. So for example if the only entry is `/`, it matches everything. If
`/foo` is also defined, then that's used for `/foo` and everything under it,
and `/` is used for everything else.

3. Use the ACL to decide whether the mapped user has sufficient permission on
the requested resource. For a directory without `index.html`, the `list`
permission is required. Otherwise, the `read` permission is required.

4. If needed, respond with HTTP status code 401, and a `WWW-Authenticate`
header to request for Basic Authentication. Otherwise return the resource.


The ACL object for each path has two fields:

1. `anonymous_permissions`, which defines the permission(s) that all visitors
have on the give path. This applies to anonymous traffic that's not
authenticated, as well as requests that have HTTP Basic Authentication headers.

2. `whitelist_additional_permissions`, which defines additional permissions
that authenticated users can get on the given path, in addition to what's in
`anonymous_permissions`.

Putting them together, `.kbp_config` has the following format in `json` form:

```json
{
  "version": "v1",
  "users": {
    <username>: <bcrypt_password>,
    ...
  },
  "acls": {
    <path>: {
      "whitelist_additional_permissions": {
        <username>: <"read"|"list"|"read,list">,
      },
      "anonymous_permissions": <"read"|"list"|"read,list">
    },
    ...
  }
}
```

### Examples

#### Default Config

If the `.kbp_config` is missing for a site, Keybase Pages uses a default config
that allows `read` and `list` permissions on the entire site, a.k.a.:

```json
{
  "version": "v1",
  "users": {},
  "acls": {
    "/": {
      "whitelist_additional_permissions": null,
      "anonymous_permissions": "read,list"
    }
  }
}
```

#### `/friends` and `/no-listing`

Here is a more complete example with the `users` map populated and referenced
in `acls`, where only `alice` is allowed to access `/friends`, and directory
listing is disabled on `/no-listing`:

Using `kbpconfig`:

```bash
$ kbpagesconfig user add alice  # adds user "alice"; this'll prompt for a password
$ kbpagesconfig acl set default "" /friends  # removes default (anonymous) permissions on /friends and its sub-directories
$ kbpagesconfig acl set additional alice "read,list" /friends  # gives "alice" read and list permissions
$ kbpagesconfig acl set default "read" /no-listing # overrides the default (anonymous) permission for /no-listing to `read`, i.e. removing `list`.
```

In `json`:

```json
{
  "version": "v1",
  "users": {
    "alice": "$2a$10$Z3eJqq2H3nQUvvBNkUEvLuWo9nHivPvSjlXLcQI6rZvUNebJ7rEBG"
  },
  "acls": {
    "/": {
      "whitelist_additional_permissions": null,
      "anonymous_permissions": "read,list"
    },
    "/friends": {
      "whitelist_additional_permissions": {
        "alice": "read,list"
      },
      "anonymous_permissions": ""
    },
    "/no-listing": {
      "whitelist_additional_permissions": null,
      "anonymous_permissions": "read"
    }
  }
}
```

</md>

</div>
#{partial './kbp_footer.toffee'}


