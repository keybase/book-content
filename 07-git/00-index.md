{% set section_title = "Git" %}

## Create super private Git repos
Keybase supports free, encrypted, authenticated, and private [Git](https://git-scm.com/) repositories.

You can put any kind of content in these repositories, but they’re especially useful for personal private repos, or for secret content shared among teams. 

This isn’t the same as [GitHub](https://git-scm.com/), [GitLab](https://about.gitlab.com/), or other source code management hosting tools. But the repositories you create (or share with teams) can be viewed in the Keybase app. These repositories are *real* Git repositories. They’re 100% fully private, encrypted, and verified. You can be certain they’re safe, not only from prying eyes, but also from malicious people who might try to change your code. (How dare they?!)

### Make a Git respository
Navigate to Git in the app and hit the `New Repository` button. You can make it your own personal repository or share it with a team.

Once you’ve created (or selected an existing) repository, there is a `Clone:` field that shows you the address you’ll use to access this repository. It will look something like this:

```
keybase://team/Mary_Poppins_Bag/secrets
```

On the command line, or in your Git UI tool of choice ([GitHub Desktop](https://desktop.github.com/) works, for example),  use this address to clone the repository. From there, you can use it as you would any other Git repository:

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

All of this can also be managed from the command line interface. Let’s say you want to manage a private `config` repository:

```
sean@sarcasm tmp % keybase git create config
Repo created! You can clone it with:
  git clone keybase://private/scoates/dotfiles
Or add it as a remote to an existing repo with:
  git remote add origin keybase://private/scoates/dotfiles
```


### Your data’s encrypted and verified
Under the hood, Git supports [remote helpers](https://git-scm.com/docs/git-remote-helpers). This allows Git itself to interface with datastores other than the local filesystem. Keybase has created an [open source remote helper](https://github.com/keybase/client/tree/master/go/kbfs/kbfsgit/) that facilitates this interaction, keeping the data in your repository within your control via your local Keybase app.

This means that your data is encrypted and not even the Keybase team can see what’s in there (nor its name, the filenames, your other configuration—nothing). This also means that every time you or a member of your team `push`es data to or `pull`s (or `clone`s) data from one of these repositories, all writes are verified by your private keys, which never leave your device. You can be sure that your team members did indeed push the changes that the Git history log says they did.

### Automatically avoid overwrites 
Using Git repositories in Keybase (or via the command line) is better than just hosting your local Git repositories in Keybase [Files](/files). With first-class Git repositories, Keybase knows to lock your repository when necessary. This prevents two people (or two devices controlled by the same person) from overwriting each others’ changes and causing conflicts. 
