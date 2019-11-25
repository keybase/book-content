# Custom Domain

You can use a custom domain with Keybase Sites.

This is done by sharing a private folder with a special Keybase bot user, and adding a couple DNS records on your domain name, which instruct Keybase how and where to host your content.

You can also share a [Git](/git) repository through this service, but we'll cover a simple shared folder first.

Let's say you'd like to share some files on a host called `my-site.example.com` (assuming you own `example.com` and control the DNS). 

### Shared folder

The first thing you'll need to do is to share a folder with the keybase user named `kbpbot` (*Keybase Pages Bot*).

In the Keybase main app, visit the Files section, and under `private`, create a folder named `person,kbpbot` (this is `/keybase/private/person,kbpbot`). As we discussed in the [Files section](/files/sharing), this folder contains data that only you and `kbpbot` can read/write.

Within that folder, we need another folder that will hold our site's contents. Let's call that `my-site`. So, you'll now have a folder `/keybase/private/person,kbpbot/my-site`. Drop some HTML, CSS, images, and any other files you'd like to share on a public HTTPS host in here.

Sharing your data with `kbpbot` isn't enough, though. The next step is setting up DNS records.

### DNS

In order for your domain/hostname to point at the Keybase servers, you'll need to set up a `CNAME` record (you could also use an `ALIAS` record to forward an `A`/`AAAA` record) that points at the hostname `kbp.keybaseapi.com`. So, you'd have something like:

```
my-site.example.com. 300 IN CNAME kbp.keybaseapi.com.
```

In addition to the DNS record, `kbpbot` needs to know which shared folder you'd like to share on this hostname. We'll need a `TXT` record for `_keybase_pages` as a subdomain of your hostname. For us, that would be `_keybase_pages.my-site.example.com`.

The contents of this record are the prefix `kbp=` (more on Git below), and a full Keybase path to the folder you'd like to share, as we created above. 

The record should look like this for our example setup:

```
_keybase_pages.my-site.example.com. 300 IN TXT "kbp=/keybase/private/person,kbpbot/my-site"
```

This record tells `kbpbot` to look in this folder to share your files.

### HTTPS

If your configuration went smoothly, the contents of your Keybase folder are now shared over a secure HTTPS connection. If you added a `/keybase/private/person,kbpbot/my-site/index.html`, that file will be made available at `https://my-site.example.com/` (and also `https://my-site.example.com/index.html`). If you shared an image at `/keybase/private/person,kbpbot/my-site/puppy/gettingbig.jpg`, that would be available at `https://my-site.example.com/puppy/gettingbig.jpg`, etc.

You might notice that we said *https*, not just *http*. Thanks to [Let's Encrypt](https://letsencrypt.org/), `kbpbot` is able to transparently request and install a HTTPS TLS/SSL certificate on your hosted domain name, and for free!

### Git

You may prefer the workflow of publishing your content through [Git](/git) instead of regular [files](/files). We've got you covered.

Instead of creating a shared folder, above, you can create a shared Keybase Git repository.

{# TODO: I can't quite figure out how to create a private git repository and share it with kbpbot in the main app. #}

