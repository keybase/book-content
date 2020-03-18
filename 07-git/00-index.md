{% set section_title = "Git" %}
{% set section_subtitle = "Create and share private repositories. " %}

# Keybase for Git
Keybase supports free, encrypted, authenticated, and private [Git](https://git-scm.com/) repositories.

You can put any kind of content in these repositories, but they’re especially useful for personal private repos or for secret content shared among teams.

These repositories are *real* Git repositories but you can view them in the Keybase app. They’re 100% private, encrypted, and verified. You can be certain they’re safe, not only from prying eyes, but also from malicious people who might try to change your code. (How dare they?!)

#### All of your data is automatically encrypted and verified.
Under the hood, Git supports [remote helpers](https://git-scm.com/docs/git-remote-helpers). This allows Git itself to interface with datastores other than the local filesystem. Keybase has created an [open source remote helper](https://github.com/keybase/client/tree/master/go/kbfs/kbfsgit/) that facilitates this interaction, keeping the data in your repository within your control via your local Keybase app.

This means that your data is encrypted—not even Keybase can see what’s in there (nor its name, the filenames, your other configuration—nothing). This also means that every time you or a member of your team pushes or pulls (or clones) data to or from one of these repositories, all writes are verified by your private keys, which never leave your device. You can be sure that your team members did indeed push the changes that the Git history log says they did.

#### No overwriting or conflicts.
Using Git repositories in Keybase (or via the command line) is better than just hosting your local Git repositories in Keybase [Files](/files). With first-class Git repositories, Keybase knows to lock your repository when necessary. This prevents two people (or two devices controlled by the same person) from overwriting each others’ changes and causing conflicts.

## Making a repository
Navigate to Git and select `New Repository`. You can make it your own personal repository or share it with a team.

Once you’ve created a repository (or selected an existing one), there is a `Clone:` field that shows you the address you’ll use to access this repository. It will look something like this:

```
keybase://team/Mary_Poppins_Bag/secrets
```

On the command line, or in your Git UI tool of choice ([GitHub Desktop](https://desktop.github.com/) works, for example),  use this address to clone the repository. From there, you can use it as you would any other Git repository:

```
git clone keybase://team/faculty_secrets/secrets
Cloning into 'secrets'...
Initializing Keybase... done.
Syncing with Keybase... done.
Counting: 77.01 KB... done.
Cryptographic cloning: (100.00%) 77.01/77.01 KB... done.
```

You can also use the private Keybase repository alongside an existing repository by adding it as an additional remote:

```
git remote add private keybase://team/faculty_secrets/secrets
git pull private master
Initializing Keybase... done.
Syncing with Keybase... done.
From keybase://team/faculty_secrets/secrets
 * branch            master     -> FETCH_HEAD
 * [new branch]      master     -> private/master
Already up to date.
```

All of this can also be managed from the command line interface. Let’s say you want to manage a private `config` repository:

```
keybase git create config
Repo created! You can clone it with:
  git clone keybase://private/scoates/dotfiles
Or add it as a remote to an existing repo with:
  git remote add origin keybase://private/scoates/dotfiles
```

