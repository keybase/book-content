{% set section_title = "Keybase Sites" %}
{% set nav_title = "Sites" %}

## Make a simple website
One of the lesser known perks of [Keybase Files](/files) is that you can easily build and host a simple website in your public folder. 

### Try it out
To see how it works, create a document and title it `index.md`. You can type anything but it’s kind of a tradition to try new things out on the internet with this:

```
# Hello, world!
```

Drop this index file into your public folder and you’ll immediately see it on your home page at `https://{username}.keybase.pub/`. 

The formatting (`#`) used in this example is [Markdown](https://daringfireball.net/projects/markdown/basics). You can use [HTML](https://www.w3schools.com/html/), too. But instead of `index.md`, name a file with HTML `index.html`.

### Organize your pages
To add and organize pages on your website, you just need to create and organize folders in your public folder. 

Only files titled `index.md` or `index.html` (they’re called index files, go figure) will show up on your website. So, to add multiple pages, you need to add multiple folders, each with an index file. 

For example, let’s say that from your home page, you want to link to another page called foo. To do this, create a folder called foo inside your public folder. Add an index file with whatever content you want in it (just remember, this is all public!). This new page will appear at `https://{username}.keybase.pub/foo`.

Here are some more examples:
TK illo
{# insert an illo for this info: 
* `/keybase/public/{username}/index.md` → `https://{username}.keybase.pub/`
* `/keybase/public/{username}/foo/index.md` → `https://{username}.keybase.pub/foo`
* `/keybase/public/{username}/foo/bar/index.md` → `https://{username}.keybase.pub/foo/bar` #}

To edit a page, all you need to do is open the file, make your edits, and save it. Your changes will automatically update on your website.

### Learn more

If you’re so inclined, you can see a couple examples and search for others’ websites at [Keybase.pub](https://keybase.pub/).

And you can learn more in our docs on TK.

{# For reference:
* [https://keybase.io/docs/kbp](https://keybase.io/docs/kbp)
* [https://keybase.io/docs/kbp/kbp_config]()https://keybase.io/docs/kbp/kbp_config
* [https://keybase.io/docs/kbp/kbp_hosting](https://keybase.io/docs/kbp/kbp_hosting)
* [https://keybase.io/docs/kbfs/keybase.pub](https://keybase.io/docs/kbfs/keybase.pub)
* [https://shiflett.keybase.pub/](https://shiflett.keybase.pub/)
* [https://keybase.pub/shiflett/](https://keybase.pub/shiflett/) #}

{# It would also (obvi) be fun to build a KBP site that tells you how to build a site. #}
