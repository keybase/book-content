**Note**: As of March 1, 2023, [the Keybase.pub service was discontinued](https://www.reddit.com/r/Keybase/comments/10xeqbw/keybasepub_shutting_down_on_short_notice/). This page is just archived
for historic purposes.
* * *
  ## Keybase.pub

  [Keybase.pub](https://keybase.pub) serves anything it can find in `/keybase/public`. Poetry. Cat pics. Midi files. Hot, hot recipes.

  For example, here we see `/keybase/public/chris/photos/` served at https://keybase.pub/chris/photos :

  ~~<img src="/images/getting-started/kpub-screenshot.jpg" class="img img-responsive">~~

  #### Raw vs. wrapped

  - https://keybase.pub/#{yername} serves a *wrapped* site that lets people poke through your files.
  - https://#{yername}.keybase.pub serves *raw* files
  - https://#{yername}.keybase.pub will also serve an index.html or render an index.md if you request a directory.

  ## Security

  If you download something off of Keybase.pub, you're trusting (a) Keybase over https, and (b) that someone hasn't hacked into Keybase.pub. So it's a great site to explore, but if you're downloading something crucial such as a copy of the latest `libssl` or `bitcoind` or `GPG Tools Suite.dmg` from a friend, you should really just look in `/keybase/public` on your own computer. That will verify all the crypto and guarantee you're seeing the same signed bits they are. And it's easier.

  ### Inspiration

  The Keybase.pub website is made by the Keybase team, but it's really a proof of concept. The site isn't privileged. It's kind of dumb - just nginx rewriting some URL's and a basic Node.js website that serves static assets and prints user info.  Keybase.pub demonstrates how easy it is to build things on top of the Keybase filesystem. Other ideas we've heard...feel free to implement:

  - a service, **"somehost"** that spins up *real websites* per user, based on code in /keybase/private/user,somehost/
  - a bitcoin wallet that shares coins inside of private folders
  - an "in the event of my death" app that splits a secret among a bunch of friends.
  - a signed blogging platform
  - your idea here
  - your other idea here
  - your third and final idea
