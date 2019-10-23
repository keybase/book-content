#{partial './header.toffee'}
<div class="guide-box">

<md>

# Linux User Guide
Welcome to the Keybase Linux User Guide!

This guide is intended for everyone from Linux beginners to experts to
distribution package maintainers. It covers some topics that are unique
to Keybase on Linux. If you have any [feedback or
questions](#feedback-and-questions), let us know!

1. [Quickstart](#quickstart)
2. [Example Commands](#example-commands)
3. [Nightly Builds](#nightly-builds)
4. [Autostart](#autostart)
5. [run_keybase](#run_keybase)
6. [systemd and running headless Keybase](#systemd-and-running-headless-keybase)
7. [Example: Daily KBFS backup on a systemd timer](#example-daily-kbfs-backup-on-a-systemd-timer)
8. [Configuring KBFS](#configuring-kbfs)
9. [Installing Keybase without Root Privileges](#installing-keybase-without-root-privileges)
10. [For Package Maintainers](#for-package-maintainers)
11. [Feedback and Questions](#feedback-and-questions)

## Quickstart
Keybase officially supports only Ubuntu, Debian, Fedora, CentOS, and Arch, but
there are other packages for other systems as well.

Note that the packages maintained by us are the quickest to get the latest
features and security updates, the community packages may have packaging issues
beyond our control, and the instructions below may not work out of the box.

No matter how you install, you should get updates automatically by running
your package manager's update command.

<table class="padded-table">
    <tr>
        <th>Distribution</th>
        <th>URL</th>
        <th>Maintainer</th>
    </tr>
    <tr>
        <td>Source code</td>
        <td>[github.com/keybase/client](https://github.com/keybase/client)</td>
        <td>Keybase</td>
    </tr>
    <tr>
        <td>Ubuntu, Debian, etc.</td>
        <td>[Keybase Install Page](/docs/the_app/install_linux#ubuntu-debian-and-friends)</td>
        <td>Keybase</td>
    </tr>
    <tr>
        <td>Fedora, CentOS, etc.</td>
        <td>[Keybase Install Page](/docs/the_app/install_linux#fedora-red-hat)</td>
        <td>Keybase</td>
    </tr>
    <tr>
        <td>Arch AUR</td>
        <td>`keybase-bin` [(link)](https://aur.archlinux.org/packages/keybase-bin/), [Keybase Install Page](/docs/the_app/install_linux#arch-linux)</td>
        <td>Keybase</td>
    </tr>
    <tr>
        <td>Arch Community</td>
        <td>
            `keybase` [(link)](https://www.archlinux.org/packages/community/x86_64/keybase/),
            `kbfs` [(link)](https://www.archlinux.org/packages/community/x86_64/kbfs/),
            `keybase-gui` [(link)](https://www.archlinux.org/packages/community/x86_64/keybase-gui/)
        </td>
        <td>Community</td>
    </tr>
    <tr>
        <td>Slackware</td>
        <td>
            `kbfs` [(link)](https://www.slackbuilds.org/repository/14.2/system/kbfs/)
            (provides keybase and gui as well)
        </td>
        <td>Community</td>
    </tr>
    <tr>
        <td>FreeBSD</td>
        <td>
            `keybase` [(link)](https://www.freshports.org/security/keybase/),
            `kbfs` [(link)](https://www.freshports.org/security/kbfs/),
            `kbfsd` [(link)](https://www.freshports.org/security/kbfsd/),
        </td>
        <td>Community</td>
    </tr>
    <tr>
        <td>Nix</td>
        <td>
            `keybase` [(link)](https://github.com/NixOS/nixpkgs/blob/release-19.03/pkgs/tools/security/keybase/default.nix) [(options)](https://nixos.org/nixos/options.html#services.keybase),
            `kbfs` [(link)](https://github.com/NixOS/nixpkgs/blob/release-19.03/pkgs/tools/security/kbfs/default.nix) [(options)](https://nixos.org/nixos/options.html#services.kbfs),
            `keybase-gui` [(link)](https://github.com/NixOS/nixpkgs/blob/release-19.03/pkgs/tools/security/keybase/gui.nix),
        </td>
        <td>Community</td>
    </tr>
    <tr>
        <td>Gentoo</td>
        <td>
            `keybase` [(link)](https://packages.gentoo.org/packages/app-crypt/keybase),
            `kbfs` [(link)](https://packages.gentoo.org/packages/app-crypt/kbfs)
        </td>
        <td>Community</td>
    </tr>
</table>

If you installed Keybase via an official package, you should have the script
`run_keybase` available, which starts up Keybase, KBFS, and the GUI.

```bash
run_keybase
...
success!
```

Now that Keybase is running, you'll be able to create an account or log into
the GUI. Once logged in, you can make proofs, chat with friends, browse your
KBFS files all in the GUI.

## Example Commands
The following aren't specific to Linux, but demonstrate many of Keybase's
features.

```bash
keybase signup # create an account
keybase id # print your username and proofs
keybase prove twitter # prove your twitter identity
keybase prove -l # list available proof types
keybase id {some-keybase-username} # check proofs of another user
keybase chat send {some-keybase-username} -m "Hey! I'm on Keybase now!" # send an encrypted message

# see if this github user is on Keybase
keybase id {some-github-username}@github

# send a (encrypted) message to a twitter user, *even if they aren't on Keybase
# yet* (they'll get the message when they join)
keybase chat send {some-reddit-username}@reddit -m "Hey! I'm on Keybase now!"

# encrypt a file or message for another keybase user to send over an unsecure
# chat channel
keybase encrypt {some-keybase-username} -m "hello, world"
BEGIN KEYBASE SALTPACK ENCRYPTED MESSAGE. kigG6zVjgVFCFLm GxarUYJUY9RGEoH ... e6lZF0EDl3VFSI4 jE0rHiCLJGYpSwk l1ohzskP1Myn9lz . END KEYBASE SALTPACK ENCRYPTED MESSAGE.

# Start a "one shot" temporary device with a paperkey, useful, e.g.,
# for logging onto Keybase in a Docker container
keybase oneshot --help

keybase help # see all available commands
```

With KBFS running, you'll be able to add files to the magic `/keybase`
directory. Everything in this directory is encrypted *on your machine* and
synced with all your [devices](https://keybase.io/download). No one else,
including Keybase, has access to your files unless you choose to make them
public or share them with other users. More information is available
at [Understanding KBFS](https://keybase.io/docs/kbfs/understanding_kbfs).

```bash
# Add a public file for anyone on Keybase to view
echo "hello, world" > /keybase/public/{your-username}/hello.txt

# Add a private file encrypted only for yourself
cp ~/documents/taxes.pdf /keybase/private/{your-username}/taxes.pdf

# Add a private file encrypted only for yourself and the owner of some website,
# *even if they haven't joined keybase yet* (they'll get it when they join and
# prove that they own that website)
cp ~/documents/proposal.pdf /keybase/private/{your-username},example.com@https/proposal.pdf

# Add a file shared privately between a group of people
cp ~/documents/resume.pdf /keybase/private/{your-username},{some-keybase-username}/resume.pdf

# Add a file shared privately to a Keybase team
mkdir /keybase/team/{your-team-name}/devops/backups/
mv ~/backups/database.tar.gz /keybase/team/{your-team-name}/devops/backups/database.tar.gz

# Create an private encrypted git repository synced between your devices
# See also: https://keybase.io/blog/encrypted-git-for-everyone
keybase git create my-project

# Interact with KBFS without a mount
# Useful, e.g., in systems like ChromiumOS that may not provide FUSE
keybase fs ls /keybase/team/
```

If you're using a package that doesn't provide the keybase redirector, `/keybase`
may not exist. In that case, your folder is available at the location given by
`keybase config get -b mountdir` ([more on that later](#configuring-kbfs)).

If you're looking for people to talk to, head on over to our [Popular Teams
page](https://keybase.io/popular-teams) and request to join a public team from
within the GUI (or with `keybase team request-access`). `keybasefriends`, in
particular, is a great place to start for general discussion and questions
about Keybase. More information on teams is available
[here](https://keybase.io/blog/introducing-keybase-teams) and
[here](https://keybase.io/blog/new-team-features).

And that's it! There's plenty of more features to play around with in the app
and in the command line.

You don't need to go any farther than this if you just want to use Keybase, but
the below sections detail advanced topics for users who want to have more
knowledge and control over how Keybase runs on their system.

## Nightly Builds
We now offer `.deb`, `.rpm`, and Arch nightly builds!

Standard disclaimer: these are not official releases and may cause unexpected
crashes and instability. Use with caution.

<table class="padded-table">
    <tr>
        <th>Format</th>
        <th>64-bit</th>
        <th>32-bit</th>
    </tr>
    <tr>
        <td>Metadata</td>
        <td colspan=2>[update-linux-prod.json](https://prerelease.keybase.io/nightly/update-linux-prod.json)</td>
    </tr>
    <tr>
        <td>`.deb`</td>
        <td>[keybase_amd64.deb](https://prerelease.keybase.io/nightly/keybase_amd64.deb) ([sig](https://prerelease.keybase.io/nightly/keybase_amd64.deb.sig))</td>
        <td>[keybase_i386.deb](https://prerelease.keybase.io/nightly/keybase_i386.deb) ([sig](https://prerelease.keybase.io/nightly/keybase_i386.deb.sig))</td>
    </tr>
    <tr>
        <td>`.rpm`</td>
        <td>[keybase_amd64.rpm](https://prerelease.keybase.io/nightly/keybase_amd64.rpm) ([sig](https://prerelease.keybase.io/nightly/keybase_amd64.rpm.sig))</td>
        <td>[keybase_i386.rpm](https://prerelease.keybase.io/nightly/keybase_i386.rpm) ([sig](https://prerelease.keybase.io/nightly/keybase_i386.rpm.sig))</td>
    <tr>
        <td>Arch Linux AUR</td>
        <td colspan=2>[keybase-git](https://aur.archlinux.org/packages/keybase-git/); supports 64-bit, 32-bit, and ARM</td>
    </tr>
</table>

Note that we are not providing package repositories for `.deb` and `.rpm`
nightlies (yet): you'll need to manually `dpkg -i` or `rpm -i` to install and
update to the next nightly instead of using `apt-get` or `yum`. However, if
you're on Arch, you can update by just reinstalling `keybase-git`.

To enable experimental GUI features, create a debug file:
```bash
$ cat ~/.cache/keybase/keybase.app.debug # or in your $XDG_CACHE_HOME/keybase
{ "featureFlagsOverride": "admin" }
```
Of course, this won't give you any additional access permissions and some of
these features may be server-gated as well, so they may not work correctly or
at all.

If you find any bugs or issues with these nightly builds, please [report
them](#feedback-and-questions) and we'll do our best to get a fix out soon!
Specify `[NIGHTLY]` in the issue title as well.

## Autostart
If you're using a graphical desktop environment like KDE or Gnome, Keybase
installs a autostart desktop file into
`~/.config/autostart/keybase_autostart.desktop`. If you don't want this
behavior, you can disable it in your desktop environment settings, or run

```bash
keybase ctl autostart --disable
```

If you're on a headless system, you probably want to use the systemd units
instead. If you're using a window manager like i3wm, you can just have it
execute `run_keybase` on startup. If you want Keybase to start but don't want
the GUI to be maximized, change the command to `run_keybase -a`. You'll be able
to open the GUI from the icon in the system tray.

When using `systemctl` to start the GUI, you must import `KEYBASE_AUTOSTART=1`
into the environment for the gui to start but stay in the background. The unit
file unsets this variable right after so subsequent calls will start it
maximized, unless that variable has been set again:

```bash
systemctl --user set-environment KEYBASE_AUTOSTART=1
```

## `run_keybase`
`run_keybase` accepts some more options for controlling Keybase.
```bash
$ run_keybase -h
Starts the Keybase service, KBFS, and the GUI.
If services are already running, they will be restarted.

Options can also be controlled by setting related environment variables to 1
  -a  keep the GUI minimized in system tray after startup (env KEYBASE_AUTOSTART=1)
  -f  do not start KBFS (env KEYBASE_NO_KBFS=1)
  -g  do not start the gui (env KEYBASE_NO_GUI=1)
  -h  print this help text
  -k  shut down all Keybase services (env KEYBASE_KILL=1)
```

When `run_keybase` is executed, up to four background processes start:
`keybase`, `kbfsfuse`, `Keybase`, and `keybase-redirector`.

- `keybase` is the main service that powers all other Keybase operations, and
also provides the command line tool. You can use `keybase` by itself if you
prefer.

- `kbfsfuse` allows you to use KBFS and KBFS git, and depends on `keybase`.

- `Keybase` is the GUI app, and depends on `keybase` and `kbfsfuse`.

- `keybase-redirector` provides the magic `/keybase` KBFS directory, but isn't
required for using KBFS.

`run_keybase` tries to run its processes as systemd user manager services if
your system supports it (Arch, Ubuntu, Debian), but if can't, it falls back
to starting regular background processes.

You can see if you're running via systemd with
```bash
systemctl --user status keybase keybase.gui kbfs keybase-redirector
# (if you don't have that command, you aren't using systemd)
```

If you don't want to start a background process, you can try
```bash
keybase --standalone {rest-of-command}
```
but this mode is not supported for all Keybase features (e.g., chat), and will
likely be slower.

## systemd and running headless Keybase
If you're running Keybase on a server, you may want finer-grained control
over Keybase than `run_keybase` provides. In this case, you can to
configure the systemd units directly without using `run_keybase`.

Note that `keybase` *cannot* be run as root, and must be run as a user.
Accordingly, it runs under the system user manager of a particular user, not
the global system manager.

First, perform some basic environment setup required for the systemd units.
```bash
keybase ctl init
```
Among other things, this forwards a few environment variables to the systemd
units. If they ever change, you'll need to run this command (or `run_keybase`)
again to refresh them. Because systemd units do not automatically forward
the user environment, this *cannot* be run automatically in the `ExecStartPre`
directive. However, you could choose to have it run on login in a shell profile
or rc file. Specifically, this creates a file at
`~/.config/keybase/keybase.autogen.env` (or in your `$XDG_CONFIG_HOME`). Environment
variables can be overridden by writing to `keybase.env` in the same directory,
or by creating a systemctl drop-in configuration with `Environment` directives.

Optionally enable units to autostart on system boot. You can choose a
subset of these, but remember that KBFS depends on Keybase (and will
start it if it isn't already up).
```bash
systemctl --user enable keybase.service
systemctl --user enable kbfs.service
systemctl --user enable keybase-redirector.service
```

Optionally allow Keybase to keep running even if you're logged out. If you've
SSHed into a server, you can do this so Keybase and KBFS keep working after
your session ends.
```bash
loginctl enable-linger
```

Next, start up Keybase services.
```bash
systemctl --user start keybase.service
systemctl --user start kbfs.service
systemctl --user start keybase-redirector.service
```

Now, you should be able to use KBFS and use Keybase from the command line.
```bash
keybase id
```

If you ran into a issue, you can restart services with
```bash
systemctl --user restart keybase kbfs keybase-redirector
```

Note that the GUI also runs as a systemd unit.
```bash
systemctl --user start keybase.gui
```
For this to work, you must have your `$DISPLAY` configured in the
environmentfile, which should already be the case if you configured your
environmentfile as directed above or executed `run_keybase` in the session.
Of course, it won't work in a ssh session unless you've configured X forwarding.

If you ever need to edit the systemd units, run
```
systemctl --user edit {unit-name}
```
and you'll be able to individually override directives in a [drop-in
directory](https://www.freedesktop.org/software/systemd/man/systemd.unit.html).
If you run into issues after an upgrade, you may need to merge in changes
from the upstream unit file, so only do this as a last resort.

Finally, if you don't want `run_keybase` to use systemd, you can export
`KEYBASE_SYSTEMD=0` and it will fall back to starting background processes.
It does this automatically if it detects that the systemd user manager is not
supported on your system.

## Example: Daily KBFS backup on a systemd timer
Now that you know the basics, let's see how you could run Keybase on a server
making a daily backup to KBFS (again, encrypted and automatically synced to all
your other Keybase devices, or even a group of users or a team!).

Instead of a systemd timer, you could also choose to write a cronjob. Just make
sure it runs as your user cronjob and if not using systemd, execute `run_keybase`
first so Keybase services start up before you start your script.

Remember that your KBFS quota, given by `keybase fs quota`, is currently 250GB.

Follow the instructions in the previous section. Now, create a systemd unit that
does a backup once. It might look like this:
```bash
$ cat ~/.config/systemd/user/kbfs-backup.service
[Unit]
Requires=keybase.service kbfs.service keybase-redirector.service
Description=make a backup of my photos

[Service]
ExecStart=%h/scripts/run-kbfs-backup

$ cat ~/scripts/run-kbfs-backup
#!/bin/bash
set -euo pipefail

function date {
    date --utc +%Y%m%d_%H%M%SZ
}

keybase_username={your-keybase-username}
archive="backup-$(date).tar.gz"
tar -czvf "$HOME/$archive" "$HOME/photos"
mkdir -p "/keybase/private/$keybase_username/backups/"
mv "$HOME/$archive" "/keybase/private/$keybase_username/backups/$archive"

$ chmod +x ~/scripts/run-kbfs-backup
```

Of course, you can improve upon this simple example with tools like `rsync`.

Finally, create a timer file. It might look like this:

```bash
$ cat ~/.config/systemd/user/kbfs-backup.timer
[Unit]
Description=run kbfs-backup.service every weekday at noon

[Timer]
OnCalendar=Mon-Fri 12:00
Persistent=true

[Install]
WantedBy=timers.target

$ systemctl --user enable --now kbfs-backup.timer
```

You're done! You can inspect the logs of your timer and check for failures with
`journalctl --user`.

To run a backup once manually, just do

```bash
systemctl --user start kbfs-backup.timer
```

## Configuring KBFS
For more information about how KBFS works, you can read [Understanding
KBFS](https://keybase.io/docs/kbfs/understanding_kbfs).

On Linux, `kbfsfuse` mounts a FUSE fileystem to a directory the user running
Keybase owns. Then, `keybase-redirector` mounts at `/keybase`, and shows a
different version of `/keybase` depending on which user is asking for KBFS
data.

If `$XDG_RUNTIME_USER` is configured (usually by systemd),
this mountdir is at `$XDG_RUNTIME_USER/keybase/kbfs/`, or otherwise, at
`~/.config/keybase/kbfs`. Additionally, your package maintainer may
have preconfigured this to be somewhere else.

To see your current mountdir, run
```bash
keybase config get -b mountdir
```

You can change it by running
```bash
keybase config set mountdir ~/another-mount-dir
run_keybase # or restart systemd services
```
Make sure nothing is using KBFS before you restart services.
Also, be wary of setting the mountdir to somewhere within
your home directory, for fear of tools like `find` or `grep`
accidentally crawling KBFS.

Finally, you may want to disable the redirector. This is
an administrator command: it requires root privileges.

You can do this with
```bash
sudo keybase --use-root-config-file ctl redirector --disable
```
or turn it back on with
```bash
sudo keybase --use-root-config-file ctl redirector --enable
```

Again, make sure KBFS is not being used before you run these commands.
An enabled redirector is owned by root and has the setuid bit set. When
you disable it, that bit is unset, and users will be unable to access
`/keybase` or run the redirector. For convenience, users can include
something like
```bash
export keybase="$(keybase config get --direct --bare mountdir)"
```
in their shell profile or rc file so they can access their files at
`$keybase/private/<their-username>`, etc.

## Installing Keybase without Root Privileges
Keybase uses root privileges only for making the magic `/keybase` directory
available.

If you want to install Keybase without root privileges, you can, for example,
unpack the `.deb` file and run the binaries out of there. If you put the
binaries in your `$PATH`, you can even symlink the provided systemd unit files
to your `~/.config/systemd/user` directory and use the systemd user manager to
manage your custom Keybase install. Note that the KBFS mount will not be
accessible at `/keybase`, but at the user-writable mountdir (see <a
href="/docs/linux-user-guide#configuring-kbfs">Configuring KBFS</a>).

Alternatively, you can choose to build Keybase from source for full customization
over your install, as described in <a
href="/docs/linux-user-guide#for-package-maintainers">For Package
Maintainers</a>.

## For Package Maintainers
We're glad that you're interested in packaging Keybase! There are a lot of
moving parts involved, so packaging can get tricky.

Our scripts are available at https://github.com/keybase/client/tree/master/packaging/linux.

Of particular note are `post_install.sh`, and `run_keybase`. You don't have to
package these, but you should include the necessary configuration and
documentation so users are able to use Keybase.

Our code signing fingerprint is in the same directory at
`code_signing_fingerprint` and available on [our
website](https://keybase.io/docs/server_security/our_code_signing_key).

You can also extract the binaries we build ourselves from the `.deb` files in
[our release directory](prerelease.keybase.io/linux_binaries/deb/index.html)
instead of building from source. You may choose to package Keybase, KBFS,
and the GUI all together or in separate packages, but make sure the
dependencies are specified.

Let us know if you've created a package and want to be added to the list
at the top of this page. In particular, init scripts for SysVinit and OpenRC
may be of interest to other package maintainers.

## Feedback and Questions
We aim to make Keybase flexible for everyone to use from desktop users to
server admins.

If you believe you've found a security issue or a bug, see our
[bug reporting page](https://keybase.io/docs/bug_reporting). Please
do a `keybase log send` from the command line when filing a bug report
so developers can help you faster.

If you have a feature request, you can make a [GitHub
issue](https://github.com/keybase/client/issues/new) or join the keybasefriends
team on Keybase and post in the `#feature-requests` channel. Or if you just need
general help, post in the `#general` channel.
</md>
</div>

#{partial './footer.toffee'}
