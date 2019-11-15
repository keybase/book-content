# Git

Keybase has first-class support for free, encrypted, authenticated, and private [Git](https://git-scm.com/) repositories.

These repositories can be used to hold any kind of content, but are especially useful for personal private repositories, or for shared secret or private content within teams.

This offering isn't the same as [GitHub](https://git-scm.com/), [GitLab](https://about.gitlab.com/), or other source code management hosting tools—there's no associated web site, bug tracker, project management, pull requests, etc., but the repositories you create (or share with teams) can be viewed in the Keybase app. These repositories are *real* Git repositories, and they're 100% fully private, encrypted, and verified, so you know they're safe; not only from prying eyes, but also from malicious actors who might try to change your code.

## How to use it

In the Keybase app, you can see repositories you have access to in the Git section. Repositories can be browsed by team, or you can look through your personal private repositories.

In this same section within the app, new repositories can be created with the `New Repository` button, where you'll choose whether the repository will become your own personal data, or shared with a specific team.

Once you've got a repository created (or selected), there is a `Clone:` field in the app that shows you the address you'll use to access this repository. It will look something like this:

```
keybase://team/fictional_company/secrets
```

On the command line, or in your Git UI tool of choice ([GitHub Desktop](https://desktop.github.com/) works, for example), you'll use this address to clone the repository. From there, you can use it just as you would any other Git repository:

```
sean@sarcasm tmp % git clone keybase://team/faculty_secrets/secrets
Cloning into 'secrets'...
Initializing Keybase... done.
Syncing with Keybase... done.
Counting: 77.01 KB... done.
Cryptographic cloning: (100.00%) 77.01/77.01 KB... done.
sean@sarcasm tmp %
```

You can also use the private Keybase repository alongside an existing repository by adding it as an additional remote:

```
sean@sarcasm secrets % git remote add private keybase://team/faculty_secrets/secrets
sean@sarcasm secrets % git pull private master
Initializing Keybase... done.
Syncing with Keybase... done.
From keybase://team/faculty_secrets/secrets
 * branch            master     -> FETCH_HEAD
 * [new branch]      master     -> private/master
Already up to date.
sean@sarcasm secrets %
```

All of this can also be managed from the command line interface. Let's say you want to manage a private `config` repository:

```
sean@sarcasm tmp % keybase git create config
Repo created! You can clone it with:
  git clone keybase://private/scoates/dotfiles
Or add it as a remote to an existing repo with:
  git remote add origin keybase://private/scoates/dotfiles
```


## How it works

Under the hood, Git has support for [remote helpers](https://git-scm.com/docs/git-remote-helpers). This mechanism allows Git itself to interface with datastores other than the local filesystem. The Keybase team has created an [open source remote helper](https://github.com/keybase/client/tree/master/go/kbfs/kbfsgit/) that facilitates this interaction, keeping the data you put into your repository within your control via your local Keybase app.

This means that your data is encrypted and not even the Keybase staff can see what's in there (nor its name, the filenames, your other configuration, etc.), but additionally it means that every time someone (either you, or another member of a shared repository team) `push`es data to or `pull`s (or `clone`s) data from one of these repositories, all writes are verified by your private keys, which never leave your device. You can be sure that your team members did indeed push the changes that the Git history log says they did.

Additionally, using the Git repositories functionality in the Keybase app (or via the command line), is different from just hosting your local Git repositories in the Keybase [filesystem](/files), because with first-class Git repositories, Keybase knows to lock your repository when necessary. This prevents two people (or two devices controlled by the same person) from overwriting each others' changes, and causing conflicts. 
