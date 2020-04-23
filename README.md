# 📝 Keybase Book Content

👋 Hey there! Welcome to the [Keybase](https://keybase.io) [Book](https://book.keybase.io) content repo.

This repository is a work in progress, and it’s our intention for the Keybase Book to be a community project. The target audience is smart people who _aren’t necessarily programmers or security folks._

We’ll encourage PR’s from the whole community. Help us make this book better.

Note this is brand new and there may be some errors, especially since initial contributions came from outside the Keybase staff.

## Contributing

We’ll accept a PR from anyone, if it clarifies a section. Note that one of the top goals of this project is to make the early chapters of the book readable by non-programmer types. Please don’t be overly pedantic; if a cryptographic explanation is good enough, let’s not complicate it to cover some technical case most people don’t care about.

## If you’re a Keybase staff member

If you’re making substantial changes, please build the site locally and make sure it all looks good.

## Creating a Highlighted Content Section

To create a callout section, like a `TL;DR` or `Tip`, etc, use the following markup within the Markdown files:

```html
<div class="compose-highlight" data-text="tl;dr">
  Keep your most important documents, photos, and videos safe and secure with Files.
</div>
```

The `data-text` prop on the container will render as the title of the callout section.
