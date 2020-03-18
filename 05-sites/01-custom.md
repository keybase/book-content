{% set section_title = "Custom domains" %}

## Custom domains
You can also use a custom domain with Keybase Sites. This lets your website appear at any domain you own instead of `https://{username}.keybase.pub/`.

### Using kbpbot
`kbpbot` is a Keybase bot designed to help you publish your site using a custom domain. 

For example, let’s say you’d like to publish your website at `myname.com`.

1. In your private Keybase folder, create a new folder with the name `yourusername,kbpbot`. Only you and `kbpbot` can access, read, and edit files in this folder.
2. Within this folder, add another folder that will hold your site’s contents. Let’s name it `my-site`. The complete folder name would be `/keybase/private/person,kbpbot/my-site`. 
3. Drop any other files you’d like to publicly share on your website in this folder. You can use Markdown, HTML, CSS, and image files.

### DNS records
In order for your domain/hostname to point at the Keybase servers, you need to set up a `CNAME` record (you could also use an `ALIAS` record to forward an `A`/`AAAA` record) that points at the hostname `kbp.keybaseapi.com`. So, you’d have something like:

```
my-site.example.com. 300 IN CNAME kbp.keybaseapi.com.
```

In addition to the DNS record, `kbpbot` needs to know which shared folder you’d like to share on this hostname. You’ll need a `TXT` record for `_keybase_pages` as a subdomain of your hostname. In this case, that would be `_keybase_pages.my-site.example.com`.

The contents of this record are the prefix `kbp=`, and a full Keybase path to the folder you’d like to share, as created above. For this example setup, the record would look like this:

```
_keybase_pages.my-site.example.com. 300 IN TXT "kbp=/keybase/private/person,kbpbot/my-site"
```

This record tells `kbpbot` to look in this folder to share your files.

### HTTPS security
Thanks to [Let’s Encrypt](https://letsencrypt.org/), `kbpbot` is able to transparently request and install a HTTPS TLS/SSL certificate on your hosted domain name, for free.

If your configuration went smoothly, the contents of your folder are now shared over a secure HTTPS connection. If you added a `/keybase/private/person,kbpbot/my-site/index.html`, that file will be made available at `https://my-site.example.com/` (and also `https://my-site.example.com/index.html`). If you shared an image at `/keybase/private/person,kbpbot/my-site/puppy/gettingbig.jpg`, that would be available at `https://my-site.example.com/puppy/gettingbig.jpg`, etc.
 
## Git publishing
You can also publish your website through [Git](/git) instead of [Files](/files). 

Instead of sharing a folder with kbpbot, as above, you can create a shared Keybase Git repository and publish that.

First, you need to be on a team with `kbpbot`:
1.  In Teams, select `Create a team` and give it a name (we’ll call this one `gitwithkbpbot`, but it can be anything).
2.  `Add members` and invite `kbpbot` as a Reader. Or add `kbpbot` to an existing team if you’d prefer.

Now you can create a Git repository to use for your new site:
3. In Git, select `New repository` and `New team repository`. Choose the team you share with `kbpbot`, and give the repository a name. Let’s call this one `git-site`.
4. Clone the repository and add some content to it. Push to `master`.

The DNS configuration for Git is a little different. The main `CNAME`/`ALIAS` record is the same (points at `kbp.keybaseapi.com`). But the `TXT` record needs to tell `kbpbot` about the Git repository instead of the filesystem location like before. It looks like this:

```
my-site.example.com. 300 IN TXT "kbp=git@keybase:team/gitwithkbpbot/git-site"
```

After the regular DNS propagation delays, the pushed contents of the `master` branch of your repository will be available at `https://my-site.exampke.com`.

{# note: the old bits about private shared (no team) Git repositories seem to be deprecated; I can’t figure out how to do it if it’s still possible #}

## HTTP authentication
To set up basic HTTP authentication with your shared sites, create a `.kbp_config` file to handle site-specific configuration.

You can learn more about .kbp_config and HTTP auth in the [Docs](https://keybase.io/docs/kbp/kbp_config).
