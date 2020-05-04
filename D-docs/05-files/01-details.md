# Understanding the Keybase Filesystem

(For a gentler introduction to KBFS, see our [launch announcement](https://keybase.io/docs/kbfs).)

### Overview

The Keybase filesystem (KBFS) is a distributed filesystem with
end-to-end encryption and a global namespace.  The KBFS code is
[open source](https://github.com/keybase/client/tree/master/go/kbfs).

“Distributed” means you can access it from any device.

“Filesystem” means that there is no sync model -- files stream in and
out on demand. Among other things, that means that by default files on
KBFS don’t permanently take up space on your devices.  (KBFS does use
the local disk for temporary and transient data; see the "Local disk
usage policy" section below for more details.  You may also opt-in to
permanent local disk storage for some folders or files; see the
"Syncing data for offline access" section below for more details.)

“End-to-end encryption” means that all data stored in KBFS have
guaranteed integrity and authentication, and also confidentiality when
desired, and that only the people intended to read or write a piece of
data can do so. In particular, we (Keybase) cannot change, read, or
even know the names of your private files.

“Global namespace” means that each file on KBFS has a single unique
path, regardless of the device from which you access it.

### The Keybase namespace

A Keybase path has the form
`/keybase/public/canonical_top_level_folder_name/subpath` or
`/keybase/private/canonical_top_level_folder_name/subpath`. Files and
folders under `/keybase/public` are signed, and files and folders under
`/keybase/private` are encrypted in addition to being signed.

A top-level folder (TLF) is a subdirectory of either `/keybase/public`
or `/keybase/private`. A canonical name for a public folder is in the
form `writer1,writer2,...`, and a canonical name for a private folder
is either `writer1,writer2,...` or
`writer1,writer2,...#reader1,reader2,...`, where each writer or reader
is a keybase username, and the list of writers and readers are
alphabetized separately. The writers for a TLF can both read and write
to that TLF, whereas readers can only read.

The canonical name for a TLF encodes which keybase users can read or
write to it. For a public folder, it is guaranteed that only the
writers for that folder have written to it. This is verified by the
keybase client, which checks the signatures of the updates to that
folder against the writers’ public keys.

For a private folder, it is guaranteed that only the writers for that
folder have written to it, and only the writers and readers for that
folder can read it. This is also verified by the keybase client.

For further details on the crypto design of KBFS, see
https://keybase.io/docs/kbfs-crypto.

You can also access keybase files through paths with non-canonical TLF
names. The simplest example of a non-canonical TLF name is one where
the order of the writers or reader is not alphabetical, but more
useful examples involve using assertions instead of usernames. See
https://keybase.io/docs/command_line for assertion syntax.

Example assertions:

 - `akalin` trivially resolves to the Keybase user `akalin`.
 - `fakalin@twitter` resolves to the Keybase user who has proven
   ownership of the `fakalin` account at Twitter.
 - `fakalin@twitter+akalin@github` resolves to the Keybase user who has
   proven ownership of the `fakalin` account at Twitter as well as the
   `akalin` account at GitHub.

At the filesystem level, each non-canonical TLF name resolves as a
symlink to the canonical TLF name.

### Security Model

At a high level, end-user devices are trusted and Keybase/KBFS/other
servers are untrusted. On desktops, we run all KBFS processes as the
current user and use OS-level secret stores, but we don’t attempt to
protect against other processes owned by the same user or root.

The KBFS client doesn’t trust any data coming from Keybase or KBFS
servers, and verifies any received data against the relevant users’
public keys. For the nitty-gritty details, see the
[KBFS crypto doc](https://keybase.io/docs/kbfs-crypto). In particular,
the KBFS servers cannot see into the contents or structure of your
(non-public) files.

That having been said, the KBFS servers know what users can access
which data, and will only serve data to an authorized reader of a TLF
with a valid session. Furthermore, they will only serve historical
(archived) data to writers of a TLF, even public ones.

Each TLF is backed by an "implicit" Keybase team, and the private keys
required to access the TLF are managed by this team; see the [Keybase
team docs](https://keybase.io/docs/teams/index) for more details.
When you provision a new device to your account, it automatically
gains access to these keys, and thus the TLF data.  When you revoke a
device, a new key is created for the TLF and used to encrypt all
future data written to the TLF, to ensure that the device cannot read
the new data.  Old data is not re-encrypted (though our servers won’t
serve it to revoked devices).

### Filesystem semantics

There are no guarantees as to the relative ordering of operations in
two different TLFs.

A TLF is best thought of as a linear sequence of changes. If only a
single device is operating on a TLF, then each change it makes appends
to this sequence, which is called the “master branch”. However, if
there are multiple devices, then a change from another device may be
added to the master branch before one from the current device. In that
case, a separate branch exclusive to the local device is forked
off. In this state (called “staged”), operations on the local device
aren’t normally visible to any other devices, although they’re still
persisted locally (or, with journaling turned off, on KBFS servers) in
case of process or device restarts. Then a background process
periodically attempts to merge this branch into the master branch,
resolving conflicts as necessary. When this succeeds, the changes from
the local device are visible to everyone else (but see the section on
conflict resolution below).

Within a single device, KBFS then behaves more or less like a normal
(i.e., POSIX-compliant) filesystem, except for the exceptions listed
below. However, it’s difficult to make general statements about the
relative ordering and visibility of operations in a TLF between two
different devices. But in general, once an application does an fsync
that is sent to the KBFS servers successfully from a device, all the
previously-written data will eventually be visible to a second
device. Note that a file write is a purely local operation---writes to
a file on a device will be invisible to a second device until the next
sync or close, and after the sync they will eventually be visible to a
second device.  There is also a background process that frequently
syncs file data, in case the application does not sync or close the
files.

By default, KBFS requires network connectivity, and no offline reads
are possible unless the data being read happens to be cached in
memory.  In theory offline writes are possible, and will be queued up
on your local disk until network access is available.  However,
writing often involves reading first, especially for updating the
directory that contains the file, so in practice the lack of offline
reads could hinder offline writes.  (See the "Syncing data for offline
access" section below for more options for offline access.)

#### Durability

For performance reasons, when KBFS receives a write call (either a
file write or a directory modification), KBFS buffers the write in
memory and responds successfully, before the new data is persisted on
disk or on the servers.  This is POSIX-compliant, but due to the
latencies involved, KBFS holds data in memory for longer than most
mounted file systems.  By default, it holds data for up to 1 second
(or until 100 operations, or 25 MB of file data, have been buffered).

Any `fsync` call causes all buffered data to be flushed immediately
and synchronously to either the local disk or the KBFS server,
depending on the journal configuration (see below).  KBFS doesn't
currently have any optimizations for syncing individual files -- it's
all or nothing.

Applications may inspect the currently-buffered data in the special
`.kbfs_status` file that can be read within your TLF (e.g., `cat
/keybase/private/me,you/.kbfs_status` or `keybase fs read
/keybase/private/me,you/.kbfs_status`).  In that file, there is a list
of "DirtyPaths", indicating which files and directories have data that
is held only in memory.

#### Journaled writes

By default, KBFS uses a persistent _journal_ on your local disk to
store any changes you make to a TLF temporarily, until they can be
saved on our servers.  This makes the writes faster, decouples your
network latency from your file system latency, and provides KBFS
opportunities for rolling several changes together and saving you
bandwidth.  This applies both to file writes and directory updates.
Note that all data in this journal are encrypted before being written
to disk.

The use of a journal means that a sync or close of a file does NOT
ensure the data has made it to our KBFS servers and will soon be
visible to other devices.  Data in the journal are flushed to the
servers in the background.  Your Keybase app icon will change to
include an up arrow while data is uploading from the journal.  You can
check the status of the changes that the journal is uploading (and an
estimated time for when the uploads will finish) using the `keybase fs
uploads` CLI command.  Furthermore, in the `.kbfs_status` file (see
above), you can also see which local directory is being used for the
journal; see the "Local disk usage policy" section below for more
details.

If you want stronger semantics, or if you want to avoid using any disk
space for KBFS data even temporarily, you can disable journaling
altogether, or on a per-TLF basis.  For example, on Linux and macOS
you can do the following:

* Persistently turn off all journaling for TLFs accessed in the
  future: `echo 1 > /keybase/.kbfs_disable_auto_journals`.  This
  doesn't affect TLFs that might already be using journaling; you'll
  have to disable each of those manually.)
* Turn off journaling for one TLF: `echo 1 >
  /keybase/private/me,you/.kbfs_disable_journal`.  This only works if
  the journal is empty.

In comparison to sync-based systems like Dropbox, the use of a journal
gives stronger ordering guarantees between file system operations on
the same device, since KBFS strictly uploads data in the order it was
written.  If you know there will only be one device at a time writing
to a particular TLF, this means it's fairly safe to run something like
`git` in a KBFS folder, even if other devices can be reading from it
at the same time, since you're not at risk of repo corruption if the
read happens at the wrong time or the device stalls or fails.  (Of
course, Keybase also offers [encrypted git
repositories](https://keybase.io/blog/encrypted-git-for-everyone)
directly as a service, which are also based on KBFS but offer the
usual git safety guarantees even when multiple devices are committing
at the same time.)

#### Conflict resolution

Our conflict resolution strategy is similar to Dropbox's, but because
we have stronger filesystem semantics than they do, we're able to do
things in a slightly different way that more closely match the
behavior of a local FS when two users are updating it concurrently
(only relevant for corner cases). Here is roughly what the resolutions
look like:

  - When both devices do make non-conflicting changes to the same
    directory, those will get merged trivially.
  - When both devices write to the same file, the "loser" file will
    get copied to a new name, marked with the name of the user who did
    the write, and the time at which the resolution happened. So if
    both users with to file `a/b.txt`, but user "bob" loses the race,
    after resolution you should see `a/b.txt` and `a/b.conflicted (bob’s
    macbook copy 2015-11-24).txt`, where “bob” is the name of the user
    who wrote the file, and “macbook” is the public name of the device
    on which bob wrote the file.  KBFS does not currently attempt to
    merge the contents of the two copies, for any type of file.
  - When both devices create a file with the same name, the same
    resolution as above will happen.
  - When both devices create a directory with the same name, they will
    be intelligently merged (dealing with children conflicts
    recursively).
  - If one device creates a directory, and another creates a file,
    using the same name, the file is always renamed with the
    `.conflicted...` suffix mentioned above, in order to preserve the
    directory structure as best as possible.
  - Unlike Dropbox, if "alice" creates a file `a/foo`, but "bob" does
    `mv a b`, the resolution should only have the file `b/foo`. That
    is, the updates to a directory follow that directory across
    renames. This is the same way it works in the terminal, if you're
    in a directory and someone moves that directory out from under
    you.
  - If the devices cause a rename cycle, it's resolved with
    symlinks. So for example, "alice" does `mv b/ a/` and bob does `mv a/
    b/`. If alice wins the initial race, the resolution will look like
	`a/b/a`, where the second `a` is a symlink pointing to `../`.
  - One weirdness is when alice does `mv a/ b/` and bob concurrently
    does `mkdir b`. Ideally, we would merge those two directories, but
    implementing that is very tricky and expensive, so right now the
    code treats it as a conflict.

#### Folders stuck in conflict mode

In rare cases where KBFS has a bug in its conflict resolution process,
or resource pressures on the device prevent conflict resolution from
completing, a device might get permanently stuck with its local
branched view of a folder, and other devices won't ever see that data.
If this is the case, the `.kbfs_status` file in the TLF (see above)
will show `IN_CONFLICT_AND_STUCK` for its `ConflictStatus`.  If you
notice one of your TLFs in this state, please use `keybase log send`
to bring it to our attention as soon as possible.

You can revert the stuck TLF to the "master" view by using the
`keybase fs clear-conflicts` command.  This moves the local view aside
under a new, read-only path name such as `/keybase/team/mycompany
(local conflicted copy 2019-09-25)`, while making the "master" view
accessible under the normal path.  Data can then be manually copied
from the stuck view into the normal view.  Once any required data has
been restored, the conflict view can be removed (and the corresponding
local disk space reclaimed) with the `keybase fs
finish-resolving-conflicts` command.

#### Deviations from POSIX

Permissions are determined entirely by the TLF name, and so there are
no POSIX-style permissions.

Hard links are not supported. Symbolic links are supported, but will
only be globally meaningful if they refer to other KBFS paths.

`O_EXCL` and `O_APPEND` are not supported, although they may work if
the file is operated on only from a single device. In particular,
nothing that does file locking (like git) should be used from multiple
devices yet, and appending to a single shared file (e.g., a log file)
from multiple devices should be avoided. We may support either or both
of these in the future.

KBFS does not support atime, since that turns a read into a write and
would require all readers to also be writers. Also, it'd be slow.

Typical POSIX attributes like file owner, group, and permissions don't
make much sense in KBFS. KBFS sets the owner of all files and directories to
the UID of the local user that is running the KBFS process. Read and write
permissions are set based on whether the user has read or write access to the
TLF. For example:

  - Non-executable files in writable private TLF: `0600` (`-rw-------`)
  - Executable files in writable private TLF: `0700` (`-rwx------`)
  - Private subdirectories: `0700` (`drwx------`)
  - Public subdirectories that user has write access to: `0700` (`drwx------`)
  - Read-only public subdirectories: `0500` (`-dr-x------`)

Note that permissions and ownership of a TLF itself may be incorrect until one
has accessed the TLF.

Any requests to change the owner or group (e.g., via `chown`) or to
set permissions (excluding the executable bit) will appear to succeed,
but the change will not be saved or propagated to other clients.
Ideally we would fail these calls, but too many applications (such as
`mv` or `unzip`) fail miserably when those calls fail.  In addition,
any attribute change request that doesn't result in a real change to
the underlying KBFS metadata (including setting the executable bit
when it is already set, for example) does not update the corresponding
ctime for the directory entry.  This is a violation of POSIX, but it's
an important optimization for some common workloads (e.g., `rsync`).

#### Symbolic links can lead outside a TLF

The Keybase client allows symbolic links that lead outside a TLF. This
is by design, and we envision a variety of great use cases:

  - a subfolder of *your* public folder, where you link to friends'
    public folders you endorse
  - storing private links to all your favorite private folders
  - a link entirely outside KBFS to another global filesystem you
    endorse. For example, to something in [IPFS](https://ipfs.io/).

You should therefore take care to consider the possibility of blindly
following a symbolic link - without noticing - by someone you don't
trust. As an example, if you ran a webserver and naively served
content in someone's `/keybase/public/` folder - with your server
configured to follow symbolic links - a user could trick you into
serving your own secret files back out.

### Storage, Quotas and History

The KBFS servers store your data in opaque blobs called _blocks_.
Both files and directories within a TLF are stored as blocks, and the
servers can't tell which block belongs to which file or directory
within the TLF.  The data in these blocks are encrypted, and their
size is increased (i.e., _padded_) to avoid leaking information to
our servers.

Each user has a quota, expressed in a number of bytes.  Whenever you
write to a file or change a TLF’s structure, only the blocks that you
change count against your quota.  The complete size of each block
(including encryption and padding) is what counts towards your quota.
Note that due to KBFS internal data structures, changing a file or
directory also changes all of the directories on the path back to the
root of the TLF.  So, for example, if you edit a file at
`/keybase/private/you/a/b/c/foo`, you've ended up changing at least
five blocks: the TLF root directory block for `/keybase/private/you`,
the subdirectory blocks for `a`, `a/b`, and `a/b/c`, and the file
block for `a/b/c/foo`.

You can check your quota usage using `keybase fs quota`, or `df` on
Linux and macOS.  Note that `du` also works (though it might be very
slow) - however, `du` only counts the plaintext size of the files, and
includes data written by any user, not just you.

Blocks that are deprecated due to a new change (e.g., if you overwrite
a previous version of a file, or add a new directory entry) are marked
for cleanup, and a background process on each client cleans up these
old blocks after about two weeks, though this could be delayed if all
clients currently accessing that folder go offline.  These deprecated
blocks don't count towards your quota.

#### Time travel

You can view, and recover data from, old versions of your TLF within
the two-week window before old, archived data is cleaned up.

Every time you change something in a KBFS TLF (at the root level or in
any subdirectory), you create a new version, or _revision_, of that
TLF.  Each revision is assigned a monotonically increasing _revision
number_.  You can see the current revision number in the `Revision`
field of the `.kbfs_status` file for the TLF (see below).  You can
also find the revision number of the newest version of the folder to
have been cleaned up (and thus is NOT accessible anymore) in the
`LastGCRevision` field of that same file.  When viewing old versions
of the TLF, you choose one of those revisions to browse.  They are
read-only, but you can copy data from them into the current copy of
the TLF.

There are multiple ways to view old data.  Within the `keybase fs`
suite of commands, you can access old data with the `ls`, `stat`, and
`read` commands, and for the source paths of the `cp` command, using
the following flags:

* `-time`: This specifies a date and time for when the data was
  available to all devices from the KBFS servers.  It can take many
  different formats, such as:
  * "Sun Jul 29 11:46:18 PDT 2018"
  * "July 29, 2018 11:46:18 PM PST"
  * "July 29, 2018"
  * "2018-07-18 13:13:43 +0800"

  Note that if no timezone is given, it uses UTC (and not the local
  timezone), in order to provide consistent behavior when copy/pasting
  commands between users/devices that may be in different timezones.
  Dates in formats where the month and day are ambiguous (such as
  "4/3/18" or "04-03-2018" are treated as if the month comes first,
  and then the day, as in typical US date formats.
* `-reltime`: This specifies a relative time in the past, using unit
  suffixes, such as "5m" for five minutes ago or "5h3m2s" for five
  hours, three minutes and two seconds ago.  Valid time units are
  "ns", "us" (or "µs"), "ms", "s", "m", "h".  Of course, this would
  not be copy/paste-able as the relative revisions could change
  according to the current time.
* `-rev`: This specifies the exact revision number of the TLF you're
  browsing, and is probably most useful for Keybase developers.

For example, to view the TLF as it was five minutes ago (and the
current date is July 29th 2018 at 11:51:00 am in San Francisco):

```
$ keybase fs ls -reltime 5m /keybase/private/you
- or -
$ keybase fs ls -time "Sun Jul 29 11:46:00 PDT 2018" /keybase/private/you
```

You can also browse old versions of the TLF directly inside the KBFS
mount, using these special directories at the root of the TLF:

* `.kbfs_archived_time=<t>`: As with the `-time` flag above, you can
  substitute any time for `<t>`.  This actually just acts as a symlink
  to the corresponding revision for that time (see below).
* `.kbfs_archived_rev=<r>`: As with the `-rev` flag above, you can
  specify an exact revision here as `<r>`.
* `.kbfs_archived_reltime=<r>`: Unlike this above two version, this
  isn't a directory.  It's a file, whose contents contains the
  directory name of the revision directory corresponding to the
  relative time.  This is to avoid copy/paste issues across time.

For the same examples above, you can do this in the mount directory instead:

```
$ ls "/keybase/private/you/.kbfs_archived_time=Sun Jul 29 11:46:00 PDT 2018/
- or -
$ cd /keybase/private/you
$ ls `cat .kbfs_archived_reltime=5m`

```

If you're interested in browsing the revisions of a specific file or
directory, you can list them using the `keybase fs stat` command.  The
`-show-archived` flag shows you the stat info for five previous
revisions of the file, scattered throughout the archive history.  For
example:

```
$ keybase fs stat --show-archived /keybase/private/you/tmp/foo
/private/you/foo
69403)	2018-08-01 11:22:50 PDT	FILE	444	foo	you
69393)	2018-08-01 11:22:29 PDT	FILE	404	foo	you
69387)	2018-08-01 11:22:20 PDT	FILE	380	foo	you
69369)	2018-08-01 11:21:53 PDT	FILE	308	foo	you
69295)	2018-08-01 11:20:00 PDT	FILE	12	foo	you
```

The first number in each row is the revision number.  You can pass
that to other commands, such as `keybase fs read` or `keybase fs
recover`, to access that exact revision of the file.

Another option is the `-show-last-archived` flag, which shows exactly
the last five revisions of the file.  You can use this to iterate all
of the revisions, if desired.  For example:

```
$ keybase fs stat --show-last-archived /keybase/private/you/foo
/private/you/foo
69403)	2018-08-01 11:22:50 PDT	FILE	444	foo	you
69402)	2018-08-01 11:22:48 PDT	FILE	440	foo	you
69401)	2018-08-01 11:22:47 PDT	FILE	436	foo	you
69400)	2018-08-01 11:22:45 PDT	FILE	432	foo	you
69399)	2018-08-01 11:22:44 PDT	FILE	428	foo	you
$ ./keybase fs stat --show-last-archived -rev 69399 /keybase/private/you/foo
/private/you/foo
69399)	2018-08-01 11:22:44 PDT	FILE	428	foo	you
69398)	2018-08-01 11:22:42 PDT	FILE	424	foo	you
69397)	2018-08-01 11:22:41 PDT	FILE	420	foo	you
69396)	2018-08-01 11:22:39 PDT	FILE	416	foo	you
69395)	2018-08-01 11:22:38 PDT	FILE	412	foo	you
```

`keybase fs recover` provides a simple helper command to recover the
specific revision of a file or directory back into the TLF.  It takes
the same `-time`, `-reltime` and `-rev` flags as the above commands,
and just forcibly overwrites the current data in the folder with the
data from the specified revision.  It recovers directories
recursively.  It does not delete new files that weren't in the old
versions of the directories.

A neat property of KBFS recovery is that you can restore a
_consistent_ view of the TLF.  That is, all the versions of the files
within a specific revision all existed exactly that way, at the same
time.  So it's guaranteed that if you wrote file `a`, and then wrote
file `b`, that in the future when you browse a revision of the TLF and
see that version of `b`, you'll also the see the same version of `a`
that existed at the time you wrote `b`.  This can be important for
recovering certain types of applications that write to multiple files,
such as databases and repositories.

An important caveat, though, as mentioned above, is that using
`keybase fs recover` on a directory (including the root of the TLF
itself) could leave behind new files that didn't exist at the time
from which you are recovering.  If exact recovery is needed for a full
directory, one option is to recover via the file system's special
`.kbfs_archived` directories, using `rsync --delete`.

Currently the limit for recovering data is about two weeks in the
past, though we might improve this in the future.

#### Local disk usage policy

As mentioned above, KBFS streams data into and out of your device on
demand, and doesn't store data permanently on your disk by default.
However, for performance reasons, KBFS does use your local disk in two
different ways, limiting the amount of space it uses based on the
amount of disk space *currently available* on the disk partition
storing your local home directory.  (This only applies to desktop
devices at the moment, since KBFS is not yet available on mobile
devices.)  All data stored to disk is first encrypted.

  - *Temporary local writes*: After files are written to KBFS, but
before they are uploaded to the servers, they will temporarily use
disk space on your device -- see the "Journaled writes" section above.
We limit this usage to 85% of your available disk space, up to a
maximum of 170 GB.  These files will be deleted as soon as they sync
successfully to the KBFS servers.
  - *On-disk transient cache*: KBFS also stores data in a transient
cache on disk to improve performance.  This is limited to 10% of your
available disk space, up to a maximum of 20 GB.  If other applications
start using more of your disk space, data will be evicted from this
cache automatically to maintain the overall usage percentage.

If you want to adjust these limits, see the "Running on a
resource-constrained system" section below.  There is currently no way
to adjust the locations of the directories.

In addition, the KBFS process writes log files to your Keybase log
directory.  The KBFS logs are limited to about 400 MB total.

#### Syncing data for offline access

KBFS does not store TLF data permanently on your local device by
default.  This is because KBFS gives you access to a very large amount
of data (e.g., every Keybase user's public files!), and so syncing all
that data before accessing it is infeasible.  This comes at the cost
of not being able to access the data while offline, however.

KBFS now offers a way for you to opt-in to "syncing" the data in
specific TLFs, or in specific subdirectories or files within a TLF, to
your local device, so that the most up-to-date version of the data
possible will be accessible quickly, even when offline.  This process
works by storing the encrypted blocks in a local database (similar to
the "transient cache" above), and making the data available through
the normal KBFS mount point.  It does not "sync" the data in decrypted
form to/from a folder on your local file system the way Dropbox and
others do.  The synced files are not available when KBFS is not
running.

Right now this feature is only supported on non-mobile devices, and
the only way to enable this feature is via the command line.  To
enable syncing, use the `keybase fs sync enable` command as follows:

```
# Sync an entire TLF
$ keybase fs sync enable /keybase/private/me

# Sync just a subdirectory of a TLF
$ keybase fs sync enable /keybase/private/me,you/tax_docs

# Sync just a particular file
$ keybase fs sync enable /keybase/team/mycompany/passwords.txt
```

There is also a `disable` subcommand to turn off the syncing (the data
is deleted slowly in the background), and a `show` command for showing
sync configuration and progress (including an estimated time when the
sync will finish) for the all synced TLFs, or for a particular TLF.

Note that, unlike for the transient cache described above, KBFS will
use as much local storage as necessary to store this data.  Therefore
if you try to sync more data than you have in available disk space,
you will fill up your disk.

GUI and mobile support for file syncing will be coming soon.

### Favorites

Each Keybase user has their own list of "favorites" that appear under
`/keybase/private` and `/keybase/public`.  Whenever you access a new
directory (e.g., you run `ls /keybase/public/malgorithms@twitter`), it
will be added to your favorites list under its canonical name (e.g.,
`/keybase/public/chris`).

You can remove entries from your favorites list using `rmdir` for the
canonical TLF name (e.g., `rmdir /keybase/public/chris`), or choosing
to ignore the folder in the Keybase GUI application.

### Mountpoints

On macOS and Linux, the official Keybase packages support multiple
local users of a computer all using KBFS at the same time (presumably
signed into different Keybase accounts, but that's not a requirement).
We do that by mounting KBFS onto your file system for each user in a
unique location.

- *macOS*: For a user with local macOS account name `user`, KBFS is
mounted at `/Volumes/Keybase (user)`.
- *Linux*: If the user (with Linux account name `user`) has
`$XDG_RUNTIME_DIR` set in their environment, KBFS is mounted at
`$XDG_RUNTIME_DIR/keybase/kbfs`.  Otherwise, we mount it at
`/home/user/.config/keybase/kbfs`.

Notably, we don't create a `~/keybase` directory, like other file
storage applications do, because KBFS is a real mountpoint and gives
you access to team and public directories, and so it slows down
programs that crawl your home directory like backup software, `du`, or
`find`.  (A Linux user without `$XDG_RUNTIME_DIR` set will still have
this issue, unfortunately.)

You can figure out your current mountpoint with `keybase status | grep
mount`.

#### Root redirector

So, how does the magic `/keybase` path work, if it's not the KBFS
mountpoint?  We mount what we call a _root redirector_ there, which
shows different symlinks to the per-user mounts, depending on which
user is asking.  This allows our users to send and post global paths
to KBFS files that will work for all Linux and macOS users (and
Windows users, via the `keybase fs` command set), all while supporting
multiple local users.

Note that on fresh Keybase installs on macOS 10.15 or later, the
operating system does not allow the creation of new mount points at
the root level of the file system.  In that case, the root redirector
is mounted at `/Volumes/Keybase` instead.

We recognize that not everyone would want to run the root redirector.
In particular it runs with root permissions on your computer (via a
root-suid binary on Linux, and via a root helper process on macOS),
and it also makes a directory at the root of your local file system,
either of which might be unwelcome.  So if you'd rather access KBFS
directly via the per-user mountpoints, you can turn off the root
redirector by creating a root-level Keybase config file at
`/etc/keybase/config.json` with the following contents:

```
{
  "disable-root-redirector": true
}
```

Then on Linux, do:
```
sudo killall keybase-redirector
sudo chmod a-s /usr/bin/keybase-redirector
```

On macOS, you can do this:
```
keybase uninstall -c redirector
```

After that the redirector should stay off permanently, even across upgrades.

#### Custom mountpoints

If you don't like the default mountpoint location, you can override it
with `keybase config set mountdir </a/better/location>`, and then
restart Keybase.

The root redirector mountpoint cannot currently be changed.

#### Windows

Currently only one Windows user may use Keybase, and KBFS, at a time.
We mount to the `K:\` drive if possible, picking another available
drive letter if needed.  You can customize the drive letter with
`keybase config set mountdir X:`.

### Running on a resource-constrained system

On desktops and laptops, KBFS makes liberal use of memory in order to
cache recently-read data for performance.  It also uses CPU and
networking resources to _pre-fetch_ data you are likely to access in
the near future, such as recently-edited files or subsequent data
blocks to data that was just requested.  These optimization tradeoffs
might not be desired on systems that don't have any extra RAM or CPU
to spare.  Starting with Keybase 4.6.0, we allow users to configure
their desktops and laptops to run the same way mobile devices do,
which disables these optimizations.  To do so, run the following
command:

```
keybase config set kbfs.mode constrained
```

and then restart KBFS.  The default behavior can be restored with:

```
keybase config set kbfs.mode --clear
```

followed by a restart.

A few other configuration options can be set via `keybase config set`
as well:

* `kbfs.block_cache.mem_max_bytes` (integer, must be set using the
  `-i` flag): The maximum number of bytes that the in-memory data
  cache can hold at once.  The default for this number is 512 MB or
  1/8 of the total RAM on the device, whichever is smaller.  Making
  this number smaller can help reduce KBFS's memory footprint.
* `kbfs.block_cache.disk_max_fraction` (float, must be set using the
  `-f` flag): The fraction of the available bytes of the local disk
  that can be used for the on-disk _transient_ cache.  If the usage
  goes above this fraction, blocks will be evicted from the cache
  until it fits within the fraction again.  The default value for this
  fraction is 0.10 (10%, as discussed above).
* `kbfs.block_cache.sync_max_fraction` (float, must be set using the
  `-f` flag): The fraction of the available bytes of the local disk
  that can be used for synced-for-offline-access data.  Data is never
  evicted from this cache; if its size exceeds the configured fraction
  of the disk, then background syncs will fail until more space
  becomes available.  The default fraction for his fraction is 1.00
  (100%).

KBFS must be restarted for any of these options to take effect.

### Debugging

For most users, `keybase log send` should suffice. This packages up
some log files and sends them to Keybase admins.  Log files may
contain metadata (sizes, etc.) about your files, though file and
directory names are obfuscated and cannot be inferred from the logs.

For the more curious, on macOS, the easiest way to access the KBFS logs
is via [Console.app](https://en.wikipedia.org/wiki/Console_(OS_X\)). On
the left under FILES, it should be under `~/Library/Logs` as
`keybase.kbfs.log`. `keybase.service.log` may also be useful. You can
then either copy and paste a portion of the displayed lines, or drag
and drop the “keybase.kbfs.log” to attach the entire file, or
right-click and select “Reveal in Finder” to find the actual file.

There are a number of special invisible KBFS files that either have
debugging info or turns on and off KBFS settings. They all start with
`.kbfs_`, and KBFS won’t let you create files with that prefix.

Since these files aren’t listed by default, you’ll need to use the
terminal to access these.

From any folder, the following files are accessible:

  - `.kbfs_error`: contains a list of the last few errors and their
    stack traces.
  - `.kbfs_metrics`: contains a list of some metrics (mostly
    RPC-related).
  - `.kbfs_profiles/`: contains files representing Golang
    [profiles](https://golang.org/pkg/runtime/pprof/#Profile).

From within a TLF the following additional files are also accessible:

  - `.kbfs_status`: lists some status info about the current TLF.
  - `.kbfs_update_history`: shows a JSON-formatted list of all the
    revisions for this TLF, including what operations were done when,
    and by which authorized TLF writer.  This fetches all revisions
    from the server, and may be very slow for TLFs with long
    histories.  It contains a lot of internal debugging information
    and may be hard to read by someone who's not a KBFS developer;
    making a friendlier version is future work.
  - `.kbfs_fileinfo_XXX` (where XXX is the name of a file or directory
    in that TLF subdirectory): shows some debugging information about
    the given file, including who last claimed to have written it
    (this is shown without explicit cryptographic verification --
    verification is done at the TLF-level, not at the individual file
    level).
