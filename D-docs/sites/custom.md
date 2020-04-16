{# yername = me?.basics?.username or 'yourname' #}
{# botname = 'kbpbot' #}
{# kbpdomain = 'kbp.keybaseapi.com' #}


<div id="introducing-kbp">

<md>

## Getting Started with Keybase Pages

Keybase Pages serves static sites from the Keybase Filesystem or Keybase Git,
under your own domain, with HTTPS certs issued by [Let's
Encrypt](https://letsencrypt.org/docs/faq/).

You can host a static site using Keybase Pages with two simple steps:

1. Put the site content into the Keybase Filesystem or Keybase Git, in a folder
(or repo) readable by our bot user #{botname}.

2. Configure 2 DNS records for your domain to 1) direct traffic for the
domain to the Keybase Pages servers, and 2) tell the Keybase Pages servers
where to look for the site content.

### Prepare or Update the Site

The simplest way to prepare a site is to copy a directory with static site
content into a folder in Keybase Filesystem. This can be simply your public
folder (`/keybase/public/#{yername}`), or a non-public folder that `#{botname}`
has read access to. For example, `/keybase/private/#{yername},#{botname}` or 
`/keybase/team/aclu.bots` (assuming #{botname} is a reader in `aclu.bots`).

If you prefer to deploy with git for easy atomic updates, you can also push
your static site into a git repo. For example,
`keybase://private/#{yername},#{botname}/my-site.git`.

For example, to create a hello-world site in a shared folder with `#{botname}`:

</md>
  <div class="well">
    <div class="form-group">
      <label for="populate-site-with">Populate your site with ... </label>
      <select class="form-control auto-focus"
        name="populate-site-with" id="populate-site-with">
        <option value="kbfs" selected>KBFS Path</option> 
        <option value="git">Git</option>
      </select>
    </div>
      <pre id='populate-site-output-kbfs'>
mkdir /keybase/private/#{yername},#{botname}/my-site
echo 'Hello, World!' > /keybase/private/#{yername},#{botname}/my-site/index.html</pre>
      <pre id='populate-site-output-git'>
mkdir my-site; cd my-site
echo 'Hello, World!' > index.html
git init . && git add . && git commit -m init
git remote add kbp keybase://private/#{yername},#{botname}/my-site.git
git push kbp master</pre>
    </div>
  </div>
<md>

### DNS Configuration

To delegate traffic handling to Keybase Pages, you'll need to configure your
domain to point to the Keybase Pages endpoint #{kbpdomain}. This is usually
done with a `CNAME` record. But if your DNS service supports `A`/`AAAA` `ALIAS`
records, you may use that as well.

A second record is needed to specify the site's root so that Keybase Pages
servers know where to serve the static site from. As described above, two types
of roots are supported: KBFS paths and Git repos hosted on Keybase. This is
done with a single TXT record on the `_keybase_pages.` subdomain under the
domain that the site is on. For example, if you have a static site on
`https://example.com`, you need this TXT record on `_keybase_pages.example.com`
(in addition to the CNAME record on `example.com`). The value of the TXT record
should be in one of the following formats:

1. KBFS Path: `"kbp=<kbfs_path>"`
2. Git Repo: `"kbp=git@keybase:<private|public|team>/<folder_name>/<repo_name>"`

You can generate the DNS records for your site using the following tool:

</md>
  <div class="well">
    <div class="form-group">
      <label for="user-domain-name">Domain Name:</label>
      <input class="form-control auto-focus" id="user-domain-name"
               autocapitalize="off" autocorrect="off" spellcheck="false"
               value="example.com" />
    </div>
    <pre id="dns-output">
    </pre>
  </div>
<md>

Note that we are using a 5-minute TTL here. After you are sure about your
configuration, you can change it into something larger e.g. 3600 (1 hour).

Every domain registrar has a different UI for DNS configuration, so it's easy
to get this wrong. To verify the DNS configuration you may use `dig` to query
the configured domain. You should see something like this:

</md>
  <pre id='dig-cname'>
  </pre>
  <pre id='dig-txt'>
  </pre>
<md>

Note that this may not show up immediately, since there's generally a few
minutes delay in DNS propagation for newly added records. If you are updating
an existing record, the existing record's TTL is the upper bound of the
propagation delay.

</md>
  <p>
    After the DNS propagation, your site should be up at <a id="site-url"></a> 🎉
  </p>
<md>

### Access Controls

By default, Keybase Pages enables reading and listing for the entire site. If
you prefer to turn off directory listing, or want a simple ACL control using
[HTTP Basic Authentication](https://tools.ietf.org/html/rfc2617), you can
provide an optional `.kbp_config` in your site root. See the [.kbp_config
doc](/docs/kbp/kbp_config) for more details.

</md>

<script type="text/javascript">
var kbp_getting_started_script = function() {
  var update_dns = function() {
    var domain = "", root = ""

    return function(data) {
      if (data.domain === domain && data.root === root) {
        return
      }

      domain = data.domain
      root = data.root

      $('#dns-output').text(
        domain + '                300 CNAME #{kbpdomain}\n' +
        '_keybase_pages.' + domain + ' 300 TXT   ' + data.root)

      $('#dig-cname').text('$ dig ' + domain + ' CNAME\n' +
        '...\n;; ANSWER SECTION:\n' + domain +
        ' <number> IN CNAME #{kbpdomain}.' + '\n...')
      $('#dig-txt').text('$ dig _keybase_pages.' + domain + ' TXT\n' + 
        '...\n;; ANSWER SECTION:\n_keybase_pages.'
        + domain + ' <number> IN TXT ' + root + '\n...')
    }
  }()

  var update_site_url = function() {
    var domain = ""

    return function(data) {
      if (data.domain === domain) {
        return
      }

      domain = data.domain

      var site_url = "https://" + domain + "/"
      $('#site-url').text(site_url)
      $('#site-url').attr("href", site_url)
    }
  }()

  var update_populate_site = function() {
    var root_type = ""

    return function(data) {
      if (root_type === data.root_type) {
        return
      }

      root_type = data.root_type

      if (root_type === 'kbfs') {
        $('#populate-site-output-git').hide()
        $('#populate-site-output-kbfs').show()
      } else if (root_type === 'git') {
        $('#populate-site-output-git').show()
        $('#populate-site-output-kbfs').hide()
      } else {
        $('#populate-site-output-git').hide()
        $('#populate-site-output-kbfs').hide()
      }
    }
  }()

  var get_data = function() {
    return {
      domain: $('#user-domain-name').val(),
      root_type: $('#populate-site-with').val(),
      root: function() {
        var root_type = $('#populate-site-with').val();
        if (root_type === 'kbfs') {
          return '"kbp=/keybase/private/#{yername},#{botname}/my-site"'
        } else if (root_type === 'git') {
          return '"kbp=git@keybase:private/#{yername},#{botname}/my-site"'
        } else {
          return "<invalid>"
        }
      }(),
    }
  }

  var update = function() {
    d = get_data();
    update_dns(d)
    update_site_url(d)
    update_populate_site(d)
  }

  $('#populate-site-with').change(update)
  $('#user-domain-name').on('input', update)

  update()
}()
kbp_getting_started_script()
</script>

</div>
