# Keybase Sites

One of the perks of the [Keybase filesystem](/files) is that you can easily host a website in your public folder. In this chapter, we’ll show you how, and we’ll also show you [how to configure a custom domain](/sites/custom).

## Quick start

Create a file called `index.md` in your public folder (`/keybase/public/{username}`) with the following content:

```
# Hello, world!
```

Once you save this file, your website is immediately available at `https://{username}.keybase.pub/`. Try it out!

The `#` is [Markdown](https://daringfireball.net/projects/markdown/basics), and you can use HTML, too. Instead of `index.md`, an HTML file needs to be named `index.html`.

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
