{% set section_title = "Custom domains" %}

### Add a custom domain
You can also use a custom domain with Keybase Sites.

You’ll need to share a private folder with a Keybase bot and add a couple DNS records on your domain name which tell Keybase how and where to host your content.

#### Share a folder with kbpbot
Let’s say you’d like to share some files on a host called `my-site.example.com` (assuming you own `example.com` and control the DNS). 

{# Does “share some files on a host called `my-site.example.com`” mean publish your website to that URL? #}

The first thing you need to do is to share a folder with `kbpbot`. In your private Keybase folder, create another folder titled `yourusername,kbpbot`. Only you and `kbpbot` can access, read, and edit files in this private folder. 

Within this folder, add another folder that will hold your site’s contents. Let’s call that `my-site`. So, you’ll now have a folder titled `/keybase/private/person,kbpbot/my-site`. Drop some HTML, CSS, images, and any other files you’d like to share on a public HTTPS host in here.

{# Does “share on a public HTTPS host” mean publish to that URL? #}

#### Set up DNS records
In order for your domain/hostname to point at the Keybase servers, you need to set up a `CNAME` record (you could also use an `ALIAS` record to forward an `A`/`AAAA` record) that points at the hostname `kbp.keybaseapi.com`. So, you’d have something like:

```
my-site.example.com. 300 IN CNAME kbp.keybaseapi.com.
```

In addition to the DNS record, `kbpbot` needs to know which shared folder you’d like to share on this hostname. You’ll need a `TXT` record for `_keybase_pages` as a subdomain of your hostname. In this case, that would be `_keybase_pages.my-site.example.com`.

The contents of this record are the prefix `kbp=` (more on Git below), and a full Keybase path to the folder you’d like to share, as created above. 

{# Can you make this text actionable: You’ll need a `TXT` record for `_keybase_pages` as a subdomain of your hostname. In this case, that would be `_keybase_pages.my-site.example.com`.

The contents of this record are the prefix `kbp=` (more on Git below), and a full Keybase path to the folder you’d like to share, as created above. #}

For this example setup, the record whould look like this:

```
_keybase_pages.my-site.example.com. 300 IN TXT "kbp=/keybase/private/person,kbpbot/my-site"
```

This record tells `kbpbot` to look in this folder to share your files.

#### Bask in sweet HTTPS security 
If your configuration went smoothly, the contents of your folder are now shared over a secure HTTPS connection. If you added a `/keybase/private/person,kbpbot/my-site/index.html`, that file will be made available at `https://my-site.example.com/` (and also `https://my-site.example.com/index.html`). If you shared an image at `/keybase/private/person,kbpbot/my-site/puppy/gettingbig.jpg`, that would be available at `https://my-site.example.com/puppy/gettingbig.jpg`, etc.

You might notice that we said *https*, not just *http*. Thanks to [Let’s Encrypt](https://letsencrypt.org/), `kbpbot` is able to transparently request and install a HTTPS TLS/SSL certificate on your hosted domain name, and for free.

### Use Git instead
You may prefer to publish your content through [Git](/git) instead of [Files](/files). You can do that.

Instead of creating a shared folder, as above, you can create a shared Keybase Git repository and publish that.

First, you need to be on a team with `kbpbot`:
1.  In Teams, select `Create a team` and give it a name (we’ll call this one `gitwithkbpbot`, but it can be anything). 
2.  `Add members` and invite `kbpbot` (it can do its job with just `reader` permissions). Or add `kbpbot` to an existing team if you’d prefer.

Now you can create a Git repository to use for your new site:
3. In Git, select `New repository` and `New team repository`. Choose the team you share with `kbpbot`, and give the repository a name. Let’s call this one `git-site`.
4. Clone the repository and add some content to it. Push to `master`.

The DNS configuration for Git is a little different. The main `CNAME`/`ALIAS` record is the same (points at `kbp.keybaseapi.com`), but the `TXT` record needs to tell `kbpbot` about the Git repository instead of the filesystem location like before. It looks like this:

```
my-site.example.com. 300 IN TXT "kbp=git@keybase:team/gitwithkbpbot/git-site"
```

After the regular DNS propagation delays, the pushed contents of the `master` branch of your repository will be available at `https://my-site.exampke.com`. 

{# note: the old bits about private shared (no team) Git repositories seem to be deprecated; I can’t figure out how to do it if it’s still possible #}

### Access control
If you’d like to set up basic HTTP authentication with your shared sites, you can do this by creating a `.kbp_config` file that is used to handle site-specific configuration. 

You can learn more about .kbp_config and HTTP auth [in the docs](https://keybase.io/docs/kbp/kbp_config).

