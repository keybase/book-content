# Introducing the Keybase Filesystem

Alpha releases of the Keybase app are starting to come with a cryptographically secure file mount. It is brand new. And very different.


![a terminal glimpse into /keybase/public/chris](https://keybase.io/images/getting-started/terminal1.png)

### Public, signed directories for everyone in the world

You can now write data in a very special place:

```
/keybase/public/yourname
```

Or, in Windows:

```
k:\\public\\yourname
```

*Every file you write in there is signed.* There's no manual signing process, no `tar`ing or `gzip`ing, no detached sigs. Instead, everything in this folder appears as plaintext files on everyone's computers. You can even open `/keybase/public/yourname<` in your Finder or Explorer and drag things in.

Here's my public folder:

```
/keybase/public/chris
```

![what a mac user sees if they type `open /keybase/public/chris`](https://keybase.io/images/getting-started/finder2.png)

Or maybe you know me another way. In that case you can *assert* I've bi-directionally connected an identity to my keys. These folder names also work:

```
/keybase/public/malgorithms@hackernews/
/keybase/public/malgorithms@twitter/
/keybase/public/malgorithms@reddit/
```

In my folder you'll find some techie things, such as my SSH public keys, my Signal app fingerprint, and some software I've manually verified and want to distribute safely to friends.

What you put in your folder is up to you: the world will rejoice knowing they're seeing *the exact same bits* you're seeing, without any risk of server-side or man-in-the-middle evil.

When you access a *stranger's* folder (say, [mine](https://keybase.io/chris)),

![/keybase/public/chris](https://keybase.io/images/getting-started/coyne-tracker.png)

The popup shows plaintext and plain usernames. Here's the ugly work it hid:

1. requesting that user's info from Keybase (keys + proofs)
1. playing back the user's signed announcements & revocations
1. actually scraping tweets, posts, profiles, etc.
1. verifying the assertion you made passes, cryptographically
1. if everything pans out, downloading blocks
1. making sure the blocks are signed, and
1. reconstructing the folder
1. presenting as plain files

Unlike Dropbox, Google Drive, and Box, there is no sync model. The files stream in on demand.

If you want some more info, go ahead and look at this text file, signed by me:

```bash
cat /keybase/public/chris/plan.txt
```

### Keybase.pub

As a proof-of-concept, https://keybase.pub is a website that serves static content straight out of `/keybase/public`. You can see my `plan.txt` file at https://keybase.pub/chris/plan.txt. The site is also a work-in-progress.

### But there's more!

Keybase mounts **end-to-end encrypted folders** in **`/keybase/private`**.

```
/keybase/private/{people}
```

This is your own encrypted folder, just for you:

```
/keybase/private/yourname
```

And here's a folder only you and I can read. You don't have to create this folder, it implicitly exists.

```
/keybase/private/yourname,chris
```

Again, maybe you know me on twitter, and prefer to assert that:

```
/keybase/private/yourname,malgorithms@twitter
```

These folders are encrypted using only your device-specific keys and mine.

*The Keybase servers do not have private keys that can read this data.* Nor can they inject any public keys into this process, to trick you into encrypting for extra parties. Your and my key additions and removals are signed by us into a public merkle tree, which in turn is hashed into the Bitcoin block chain to prevent a forking attack. Here's a screenshot of my 7 device keys and 9 public identities, and how they're all related.

![devices in pink and orange have decryption keys nodes in blue are assertions you might make](https://keybase.io/images/getting-started/cc-graph2.png)

src: https://keybase.io/chris/sigchain

As a reminder, Keybase is [open source Go](https://github.com/keybase/client/tree/master/go/kbfs). And here's [our crypto spec](/docs/kbfs-crypto) on the file mount, which we will gladly change and update as this project evolves. (Feedback desired!)

### Frictionless sharing

Soon, you'll be able to throw data into `/keybase/private/yourname,pal@twitter, *even if that Twitter user hasn't joined Keybase yet*. Your app will encrypt *just for you* and then awake and rekey in the background when that Twitter user joins and announces a key.

We decided to work on Keybase full time when we realized this key-identity solution could actually lower the friction on sharing.

In contrast, this screenshot was in Keybase's fundraising deck earlier this year:

![Email or phone number as a sharing identifier is very 2007](https://keybase.io/images/getting-started/dropbox_sharing.png)

Our goal: smack-dab in the middle of a public Reddit or HackerNews or Twitter conversation, you *should* be able to say "Hey, I threw those gifs/libraries/whatever in our encrypted keybase folder" without ever asking for more identifying info. If that person hasn't installed Keybase yet, your human work is still done. They can join and access the data within seconds, and your device will quietly handle the verification and rekeying, without ever trusting Keybase's servers.

### Back to you...

Anyway, if you have the new Keybase, go ahead, start a diary:

```bash
cd /keybase/private/yourname
echo 'The brain...it moved again.' > diary.txt
```

On a Mac, you could just open the folder in Finder:

```bash
open /keybase/private/yourname
```

And drag files on in.

## Questions and other details

### Paper keys

As discussed in our [blog post about device keys](https://keybase.io/blog/keybase-new-key-model), until our phone app is ready, you'll be asked to make a paper key. This is a full-powered private key. It can be used to provision and even rekey. Carry it in your wallet if you want to provision new Keybase installs. You can make extras with `keybase paperkey` and revoke lost ones with `keybase device [list|remove]`.


![you'll choose `option 2` unless you have two computers side-by-side `option 3` usually won't work (it will for the first computer you set up)](https://keybase.io/images/getting-started/provision.png)

### Metadata and Security

The Keybase servers can obviously read everything in `/keybase/public`.

As for `/keybase/private`, Keybase *can* tell

1. what top level folders you're working in (such as `/keybase/private/yourname,pal`),
1. *when* you're writing and reading data, and
1. approximately *how much* data.

The Keybase server *does not know* individual file names or subdirectory names. It could try to guess whether you're writing 100 small files or 1 large file, but it would be a timing-based guess. If you write a 1MB file in a private folder called `/keybase/private/yourname/pics_of_me/thong.jpg`, the Keybase server has no idea this is a folder called `pics_of_me`, or that there's a file called `thong.jpg`, or whether you look good. It doesn't know you're writing pictures, Excel docs, your DNA sequence, or MP3s.

### "Following" people adds to security

When you follow someone on Keybase, you sign a portable summary of their identity, as you saw and verified it. From then on, whenever you use their keybase username, *everything in your follower statement* must remain valid. This is far more secure than just asserting one identity.

![](https://keybase.io/images/tracking/maria_twitter.jpg)

So follow people.

### Risk of data loss

At the time of this document, there are very few people using this system. We're just getting started testing. Note that we could, hypothetically, lose your data at any time. Or push a bug that makes you throw away your private keys. Ugh, burn.

So as one of our first testers: *back up anything you put into Keybase's alpha*, and remember: we can't recover lost encrypted data.

Also, if you throw away all your devices, you will lose your private data. Your encrypted data is ONLY encrypted for your device & paper keys, not any PGP keys you have.

### Storage

We're giving everyone 250 gigabytes. Our quota model:

- only the writer's quota is affected when writing in shared dirs. Woo-hoo! So you never have to worry about hurting another's quota or disk space (again: friction). Keybase has to work this way, since it doesn't work on the sync model or require approval before encrypting and sharing with someone.

- history data does count towards your quota, and you'll soon have controls for how long to keep deleted blocks around.

There is no paid upgrade currently. The 250GB free accounts will stay free, but we'll likely offer paid storage for people who want to store more data.

### Performance

We've made no performance optimizations yet. There's a lot of low-hanging fruit.

### Iterative releases

Keybase is about to be a full-featured GUI app.

When the Keybase app offers to install an update, we encourage you to accept it. It'll be signed by us.

### Public folders of interest

* [/keybase/public/libevent](https://keybase.pub/libevent) – the popular callback notification library. [browse](https://keybase.pub/libevent) | [glossy site](https://libevent.keybase.pub)
* /keybase/public/chris - my example folder [browse](https://keybase.pub/chris) | [glossy site](https://chris.keybase.pub)



I'll add some people above if they're known authors of popular packages or well-known people. Email me if you've got anything interesting (chris@keybase.io).

### Bug reporting

If you encounter a bug of any kind, please run this:

```
keybase log send
```

That will (1) package up your logs for us and send them in, and (2) generate a pre-filled github issues page containing an id for your logs.

### Business Model?

We're a long way off from worrying about this, but we'll never run an ad-supported business again. And Keybase will never sell data. These are our constraints:

- no ads
- no selling data
- we want free, easy public keys for everyone in the world
- any hosted offerings we have (such as this filesystem) should be free for most
- "customers" will be organizations with many users and/or individuals who want disproportionate resources.

But, as stated above, there is currently no pay model, and we're not trying to make money. We're testing a product right now, and we'd like
to bring public keys to the masses.

### Links

* [download it!](https://keybase.io/download)
* [all other documentation](https://keybase.io/docs)
* [reporting issues via GitHub](https://github.com/keybase/client/issues)

