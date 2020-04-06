# Keybase client-side architecture

The Keybase client is a command-line application written in
[Go](https://golang.org/). Today it runs on macOS, Linux and Windows.
The code lives in the
[keybase/client](https://github.com/keybase/client) GitHub repository.

## Client and Service split

The Keybase binary can act as both a command-line tool and a long-running
"service" — each time you run a command, both the tool ("client") and the
service are involved. The service stays active after each command, whereas a
separate client process is created and terminated for each command. If there's
work to be done in response to a command (going out on to the network, running
PGP, etc), it's done by the service.

On Linux, the service is started in the background when you run a client
command for the first time, and subsequent client commands check
`$XDG_RUNTIME_DIR/keybased.sock` for an active service and use it if one
is listening there — this is called "autofork" mode.

On macOS, the service is started by `launchd` at boot.

For debugging, you might find it helpful to use `--standalone` mode, which
just runs everything in one process.

For our forthcoming KBFS project, the `kbfsfuse` binary will act as a client
that talks to the regular Keybase service over the long-running socket.

For iOS and Android, apps can't spawn extra threads, so we'll be using
standalone mode there. We can't even have an iOS/Android process and
a separate Go process, so we'll need to embed a Go runtime into the single
app process and pass messages to it.

For macOS and Electron desktop GUI clients, we'll use separate processes just
as we do with the command-line clients.

## Secrets

The service caches the user's passphrase to avoid asking the user for it every
time a command is run (so if you use `--standalone` you'll have to enter it
every time).

The secrets being cached are:

- `libkb.PassphraseStream`: an [scrypt](https://en.wikipedia.org/wiki/Scrypt)
  of the user's Keybase passphrase, cached in the service as
  `libkb.PassphraseStreamCache`.
- A login session salt cached as `libkb.LoginSession.Salt()`.

## Interacting with GPG

We try to run crypto operations internally, using Go's `openpgp` module, but
there are some situations (such as importing local keys) that require shelling
out to GPG — you can run `keybase help gpg` to learn more.

## RPC protocol

The client and service communicate by using an RPC protocol called
[framed-msgpack-rpc](https://github.com/maxtaco/go-framed-msgpack-rpc) (which
is a version of [msgpack-rpc](https://github.com/msgpack-rpc/msgpack-rpc) with
message framing added). This is a duplex protocol — the client opens an RPC
connection to the service and makes function calls, and the service can do the
same back to the client.

Passing the argument `--local-rpc-debug-unsafe=csv`
allows you to see the content of these RPC transactions. (It's "unsafe"
because private data is emitted to the logs.)

## Protocol bindings

We use a language-independent protocol description format to define all of the
available commands and their arguments and return values. The protocol format
is called [AVDL](http://avro.apache.org/docs/1.7.5/idl.html) and lives in
[`client/protocol/avdl/*`](https://github.com/keybase/client/tree/master/protocol/avdl).

We automatically generate per-language bindings (objc, JS, Golang) from this
protocol. For example, the generated Golang bindings are written to
[`client/go/protocol/keybase_v1.go`](https://github.com/keybase/client/blob/master/go/protocol/keybase_v1.go)
and imported into client code as `keybase1`.

The reason to use a language-independent protocol is that we're expecting to
have command-line, GUI, and mobile clients using different programming
languages and want to be able to update bindings in one place.

Calling a generated function looks like this in Golang:

```go
type CmdTrack struct {
        user    string
        options keybase1.TrackOptions
}

func (v *CmdTrack) Run() error {
        cli, err := GetTrackClient()
        if err != nil {
                return err
        }

        protocols := []rpc2.Protocol{
                NewIdentifyTrackUIProtocol(),
                NewSecretUIProtocol(),
        }
        if err = RegisterProtocols(protocols); err != nil {
                return err
        }

        return cli.Track(keybase1.TrackArg{
                UserAssertion: v.user,
                Options:       v.options,
        })
}
```

Here `GetTrackClient()` returns the `keybase1.TrackClient` generated function;
`protocols` describes which RPC endpoints the client and service want to use
during the request; `keybase1.TrackArg` is the binding-generated struct of
arguments to `Track`; the return value of `Track` is of the built-in Golang
type `error`. So `cli.Track` will run on the service, returning its result
back to the client.

### Adding a new function to the protocol

If we wanted to add a new function to the `TrackClient`, we'd add its
definition to [`client/protocol/avdl/track.avdl`](https://github.com/keybase/client/blob/master/protocol/avdl/track.avdl),
and then run `make` in [`client/protocol`](https://github.com/keybase/client/tree/master/protocol/)
with Java installed. (If we wanted to add a new protocol in a new AVDL file,
we'd add it to the build-stamp section of [`client/protocol/Makefile`](https://github.com/keybase/client/blob/master/protocol/Makefile)
too.)

## General file structure

- `client/cmd_*` - client-side handling of commands, e.g. `client/cmd_track.go`
- `libkb/` - service-side lower-level library functions, e.g. `libkb/track.go`
- `engine/*` - service-side higher-level library functions, e.g.
  `engine/track*.go`. Most calls to the service are just wrappers around
  engines that do most of the work. This is also where most of the testing
  occurs.

## Messaging

Since the service is doing the real work, it's going to be coming up with
messages to show the user. Messages are sent to the client over the
`NewLogUIProtocol`, itself described in `keybase1.LogUiProtocol`.

Logs (usually created with `G.Log.*()`) are automatically forwarded (again, via
RPC) from the service to the client so that they can be seen in one place.
You can turn on debugging logs with `keybase -d <command>`.

## Tips for working with the code

### Building

On OSX, the supported way to build from source is with `brew`:

```sh
brew install go  # avoid building Go from source
brew --build-from-source keybase/beta/kbstage
```

On Linux you can build directly from the `client` repo:

```sh
git clone https://github.com/keybase/client
cd client/packaging
./clean_build_kbstage.sh
```

{## Commented until the public repo is available.

### Installing our git precommit hook

```sh
cd .git/hooks
ln -s ../../git-hooks/pre-commit
```

-->
##}
