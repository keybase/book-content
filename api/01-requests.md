### URL format

All Keybase URLs look like this:

```
https://keybase.io/_/api/1.0/<command>.json
```


### POST requests

You must include a `csrf_token` with all POST requests (except signup). You can send this token either in your post data (as "csrf_token") or in your http headers (as "X-CSRF-Token"). In turn, all requests <i>reply</i> with a csrf token. For example, this is how you'd perform a login. It requires two API calls:

<ol>
  <li>GET /salt - request a salt for the given user's username (and get a csrf token)</li>
  <li>calculate a password hash in the client (a function of password &amp; salt)</li>
  <li>POST /login - including the hash and csrf_token</li>
</ol>

### Cookies

API requests which require a logged in user must provide a session cookie for the user.

