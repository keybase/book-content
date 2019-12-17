{% set section_title = "Keybase Sites" %}
{% set nav_title = "Sites" %}

One of the perks of [Keybase Files](/files) is that you can easily host a website in your public folder. 

## Quick start

Create a file called `index.md` with the following content:

```
# Hello, world!
```

Drop this file into your public folder and you’ll see it immediately available at `https://{username}.keybase.pub/`. Try it out.

The formatting (`#`) used in this example is [Markdown](https://daringfireball.net/projects/markdown/basics). You can use HTML, too. But instead of `index.md`, name an HTML file `index.html`.

## Organizing your website

Only index files (`index.md` or `index.html`) are rendered as web pages, so organizing your website is mostly an exercise in creating directories. Here are some examples:

* `/keybase/public/{username}/index.md` → `https://{username}.keybase.pub/`
* `/keybase/public/{username}/foo/index.md` → `https://{username}.keybase.pub/foo`
* `/keybase/public/{username}/foo/bar/index.md` → `https://{username}.keybase.pub/foo/bar`

## Questions

* Can we support custom 404 pages?

## Links

* [https://keybase.io/docs/kbp](https://keybase.io/docs/kbp)
* [https://keybase.io/docs/kbp/kbp_config](https://keybase.io/docs/kbp/kbp_config)
* [https://keybase.io/docs/kbp/kbp_hosting](https://keybase.io/docs/kbp/kbp_hosting)
* [https://keybase.io/docs/kbfs/keybase.pub](https://keybase.io/docs/kbfs/keybase.pub)
* [https://shiflett.keybase.pub/](https://shiflett.keybase.pub/)
* [https://keybase.pub/shiflett/](https://keybase.pub/shiflett/)
