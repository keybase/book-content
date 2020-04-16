{% set section_title = "kbpgp.js" %}

*kbpgp* is Keybase's implementation of PGP in JavaScript. It's easy to use, designed for concurrency, and stable in both Node.js and the browser. It's actively maintained and yours forever under a BSD license. This page begins a brief tutorial.

{# TODO: JavaScript mini app thing from https://keybase.io/kbpgp #}

### Getting it 

Zip file (for the browser) 

- [kbpgp-2.1.0-release.zip](https://keybase.io/kbpgp_public/releases/kbpgp-2.1.0-release.zip)

For Node.js with NPM

```
npm install kbpgp
```

Source from [GitHub](https://github.com/keybase/kbpgp)

```
git clone https://github.com/keybase/kbpgp.git
```

### Getting started

Browser

```
<script src="kbpgp-2.1.0.js"></script>
```

Node.js

```
var kbpgp = require('kbpgp');
```


## Key Manager

*Before you can perform any crypto, you need a KeyManager.*

A KeyManager contains a public key and possibly the secret key and subkeys for a given person. Once you have a KeyManager instance, you can perform actions with the keys inside. For a sign-and-encrypt action, you'll need two KeyManagers: one containing the private key (for the signer), and one containing the public key (for the recipient).

For example, assuming we have two KeyManager instances, `alice` and `chuck`, we might perform an encryption.

```javascript
var params = {
  encrypt_for: chuck,
  sign_with:   alice,
  msg:         "Hey Chuck - my bitcoin address is 1alice12345234..."
};

kbpgp.box(params, function(err, result_string, result_buffer) {
  console.log(err, result_string, result_buffer);
});
```

kbpgp's `box` function performs all the work. Note that it calls back with both a string and a Buffer representation. The Buffer is either a [Node.js Buffer](http://nodejs.org/api/buffer.html) or, a browser-friendly object with similar features. 

Pretty simple, right? So, how do you get a KeyManager? There are 2 ways:

- [Loading a key or key pair](#loading-a-key)
- [Generating a new key pair](#generating-a-pair)

### Loading a key

The following examples walk through the conversion of a PGP key string (in classic armored format) to a KeyManager.

#### Example 1 - a KeyManager from a public key

```javascript
var alice_pgp_key = "-----BEGIN PGP PUBLIC ... etc.";

kbpgp.KeyManager.import_from_armored_pgp({
  armored: alice_pgp_key
}, function(err, alice) {
  if (!err) {
    console.log("alice is loaded");
  }
});
```

#### Example 2 - a KeyManager from a private key

Now let's assume instead that we have alice's private key. Recall this includes her public key, so it's all we need. 

```javascript
var alice_pgp_key    = "-----BEGIN PGP PRIVATE ... etc.";
var alice_passphrase = "martian-dung-flinger";

kbpgp.KeyManager.import_from_armored_pgp({
  armored: alice_pgp_key
}, function(err, alice) {
  if (!err) {
    if (alice.is_pgp_locked()) {
      alice.unlock_pgp({
        passphrase: alice_passphrase
      }, function(err) {
        if (!err) {
          console.log("Loaded private key with passphrase");
        }
      });
    } else {
      console.log("Loaded private key w/o passphrase");
    }
  }
});
```

#### Example 3 - a KeyManager from a public key, then adding private key

The above example ([#2](example-2-a-keymanager-from-a-private-key)) can be performed in two steps. You can create a KeyManager instance with alice's public key, and then add her private key to it afterwards. This will generate an error if her private key does not match her public key.

```javascript
var alice_public_key = "-----BEGIN PGP PUBLIC ... etc.";
var alice_private_key = "-----BEGIN PGP PRIVATE ... etc.";
var alice_passphrase = "ovarian fred savage ";

kbpgp.KeyManager.import_from_armored_pgp({
  armored: alice_public_key
}, function(err, alice) {
  if (!err) {
    alice.merge_pgp_private({
      armored: alice_private_key
    }, function(err) {
      if (!err) {
        if (alice.is_pgp_locked()) {
          alice.unlock_pgp({
            passphrase: alice_passphrase
          }, function(err) {
            if (!err) {
              console.log("Loaded private key with passphrase");
            }
          });
        } else {
          console.log("Loaded private key w/o passphrase");
        }
      }
    });
  }
});
```


### Generating a pair

You can create a KeyManager and generate new keys in one swoop.

At the end of the below process, we'll have a KeyManager instance, alice, which can be used for any crypto action. 

#### Example 1 - RSA - with custom settings

To illustrate a common use case, we'll generate subkeys for both signing and encryption. And, by the way, when kbpgp performs actions with KeyManagers, it automatically picks the appropriate subkey(s). 

```javascript
var F = kbpgp["const"].openpgp;

var opts = {
  userid: "User McTester (Born 1979) <user@example.com>",
  primary: {
    nbits: 4096,
    flags: F.certify_keys | F.sign_data | F.auth | F.encrypt_comm | F.encrypt_storage,
    expire_in: 0  // never expire
  },
  subkeys: [
    {
      nbits: 2048,
      flags: F.sign_data,
      expire_in: 86400 * 365 * 8 // 8 years
    }, {
      nbits: 2048,
      flags: F.encrypt_comm | F.encrypt_storage,
      expire_in: 86400 * 365 * 8
    }
  ]
};

kbpgp.KeyManager.generate(opts, function(err, alice) {
  if (!err) {
    // sign alice's subkeys
    alice.sign({}, function(err) {
      console.log(alice);
      // export demo; dump the private with a passphrase
      alice.export_pgp_private ({
        passphrase: 'booyeah!'
      }, function(err, pgp_private) {
        console.log("private key: ", pgp_private);
      });
      alice.export_pgp_public({}, function(err, pgp_public) {
        console.log("public key: ", pgp_public);
      });
    });
  }
});
```

So easy!

#### Example 2 - RSA - with sensible defaults

The above parameters are reasonable. If you're happy with them, you can simply call the `KeyManager::generate_rsa` shortcut:

```javascript
kbpgp.KeyManager.generate_rsa({ userid : "Bo Jackson <user@example.com>" }, function(err, charlie) {
   charlie.sign({}, function(err) {
     console.log("done!");
   });
});   
```

### Example 3 - ECC Keypairs - custom

Kbpgp has support for Elliptic Curve PGP (see [RFC-6637](http://tools.ietf.org/html/rfc6637) for more details). You can provide the `ecc : true` option to the above generate call to make an ECC key pair rather than the standard PGP keypair. Keep in mind, though, that most GPG clients in the wild do not currently support ECC.

```javascript
var F = kbpgp["const"].openpgp;

var opts = {
  userid: "User McTester (Born 1979) <user@example.com>",
  ecc:    true,
  primary: {
    nbits: 384,
    flags: F.certify_keys | F.sign_data | F.auth | F.encrypt_comm | F.encrypt_storage,
    expire_in: 0  // never expire
  },
  subkeys: [
    {
      nbits: 256,
      flags: F.sign_data,
      expire_in: 86400 * 365 * 8 // 8 years
    }, {
      nbits: 256,
      flags: F.encrypt_comm | F.encrypt_storage,
      expire_in: 86400 * 365 * 8
    }
  ]
};

kbpgp.KeyManager.generate(opts, function(err, alice) {
  // as before...
});
```

#### Example 4 - ECC Keypairs - with sensible defaults

To use these default parameters, we also provide the shortcut:

```javascript
kbpgp.KeyManager.generate_ecc({ userid : "<user@example.com>" }, function(err, charlie) {
   charlie.sign({}, function(err) {
     console.log("done!");
   });
});
```

#### Monitoring

All kbpgp functions support passing an "ASync Package" (ASP) object, for monitoring. Your ASP can have a progress_hook function, which will get called with info about its progress. This is especially important with RSA key generation, as it can take a little while. If this is in any kind of client app, you'll want to (a) show some indicator that you're doing work, and (b) have a cancel button. 

```javascript
var my_asp = new kbpgp.ASP({
  progress_hook: function(o) {
    console.log("I was called with progress!", o);
  }
});

var opts = {
  asp: my_asp,
  userid: "user@example.com",
  primary: {
    nbits: 4096
  },
  subkeys: []
};

kbpgp.KeyManager.generate(opts, some_callback_function);
```

#### Canceling

If you pass an ASP object, as described above, you can use it to cancel your process.

```javaascript
kbpgp.KeyManager.generate(opts, some_callback_function);

// oh, heck, let's give up if it takes more than a second
setTimeout((function() {
  my_asp.canceler.cancel();
}), 1000);
```

In the above example, if the generation has not completed within one second, work will halt and `some_callback_function` will immediately get called with `err, null`.


### API

Given the `KeyManager` class (`kbpgp.KeyManager`), and an instance, `alice`, you can access the following functions.

#### First, options notes

1. When `opts` is expected as an argument, it is a dictionary. You may pass the empty dictionary, `{}`
1. In any kbpgp function, you may set `opts.asp` as an ASP object to monitor progress and optionally cancel it. See the examples for more info.

{# TODO: table #}

- `KeyManager.generate(opts, cb)` `KeyManager.generate_rsa(opts, cb)` `KeyManager.generate_ecc(opts, cb)`: calls back with `err, key_manager` ([see examples](#generating-a-pair))
- `KeyManager.import_from_armored_pgp(opts, cb)`: calls back with `err, key_manager`. If you're importing a private key, you'll want to check if it has a passphrase and unlock it. ([see examples](#loading-a-key))
- `alice.has_pgp_private()`: returns true if alice's `key_manager` contains a private key
- `alice.is_pgp_locked()`: returns true if alice's private key is passphrase-protected and locked
- `alice.unlock_pgp(opts, cb)`: unlocks alice's private key if it's locked; calls back with any error ([see examples](#loading-a-key)); `opts.passphrase`: a string with alice's private key passphrase
- `alice.check_pgp_public_eq(chuck)`: returns true if alice and another KeyManager instance (chuck) have identical primary and sub keys
- `alice.merge_pgp_private(opts, cb)`: if alice has been loaded without a private key, this function lets you merge her private key in, after the fact. Once merged, if it is password protected, you'll want to (a) recognize this with `alice.is_pgp_locked()` and then (b) unlock it with `alice.unlock_pgp_key()`; `
opts.armored`: a string with her private key, armored
- `alice.export_pgp_public(opts, cb)`: calls back with `err, str`. This generates the standard PGP armored format of alice's public key. ([see example](#generating-a-pair))
- `alice.export_pgp_private(opts, cb)`: calls back with `err, str`. This generates the standard PGP armored format of alice's key, protected with a passphrase. ([see example](#generating-a-pair)); `opts.passphrase`: a passphrase to protect they key

### Encrypting and/or signing

 The steps to encrypt, sign, or both are all the same in kbpgp. The only difference is what [KeyManagers](#key-manager) you'll need. To sign something, you'll need a KeyManager containing a private key. And to encrypt something, you'll need one containing the public key of the recipient. If your KeyManagers contain subkeys, kbpgp will automatically use the appropriate ones. 
 
#### Example 1 - encrypt only

Assumption: we have a KeyManager instance, `chuck`, for the recipient.
 
```javascript
var params = {
  msg:         "Chuck chucky, bo-bucky!",
  encrypt_for: chuck
};

kbpgp.box(params, function(err, result_string, result_buffer) {
  console.log(err, result_armored_string, result_raw_buffer);
});
```  

#### Example 2 - sign only

Along the same lines, it's easy to sign a cleartext message. Just provide a `sign_with` KeyManager but leave off the `encrypt_for`. 

```javascript
var params = {
  msg:        "Here is my manifesto",
  sign_with:  alice
};

kbpgp.box (params, function(err, result_string, result_buffer) {
  console.log(err, result_string, result_buffer);
});
```

#### Example 3 - sign+encrypt

Assumption: we also have a KeyManager instance, `alice`, for the sender.

```javascript
var params = {
  msg:         "Chuck chucky, bo-bucky! This is Alice here!",
  encrypt_for: chuck,
  sign_with:   alice
};

kbpgp.box (params, function(err, result_string, result_buffer) {
  console.log(err, result_string, result_buffer);
});
```

#### Example 4 - using input and output Buffers

kbpgp can take *Node.js Buffers* as input, instead of strings. The following reads a .png file and writes a new encrypted copy of it. For more info, check out the kbpgp [buffers](#files-and-buffers) documentation.

```javaascript
var kbpgp  = require('kbpgp');
var fs     = require('fs');
var buffer = fs.readFileSync('dirty_deeds.png');
var params = {
  msg:         buffer,
  encrypt_for: chuck,
  sign_with:   alice
};

kbpgp.box (params, function(err, result_string, result_buffer) {
  fs.writeFileSync('dirty_deeds.encrypted', result_buffer);
});
```

Buffers are available in the browser, too, for doing HTML5 things with files. `kbpgp.Buffer` provides a browser-implementation that matches Node.js's.

#### Example 5 - progress hooks and canceling

Most kbpgp function can take a `kbpgp.ASP` object, which is used to monitor progress and check for cancelation requests.

```javascript
var asp = new kbpgp.ASP({
  progress_hook: function(info) {
    console.log("progress...", info);
  }
});

var params = {
  msg:         "a secret not worth waiting for",
  encrypt_for: chuck,
  asp:         asp
};

kbpgp.box(params, function(err, result_string, result_buffer) {
  console.log("Done!", err, result_string, result_buffer);
});

// sometime before it's done
asp.canceler().cancel();
```

### Decrypting and verifying

Decrypting and verifying are slightly more complicated than encrypting or signing, because often, you don't know ahead of time which KeyManagers are required. For PGP messages that are signed and encrypted, you only know which verification key is needed after a successful decryption. Also, messages in PGP can be encrypted for multiple receivers, and any given receiver might only have access to one of many possible decryption keys.

In kbpgp, the `unbox` function handles the nitty-gritty of decryption and verification. You need to pass it a PGP message (encrypted, signed or both), and also a way to fetch keys midstream—a `kbpgp.KeyFetcher` object. You can use one of ours out-of-the-box or subclass your own (say, if you want to fetch keys from your server). 

#### Out-of-the-Box: The KeyRing

```javascript
var ring = new kbpgp.keyring.KeyRing();
var kms = [ alice, bob, charlie ];
for (var i in kms) {
  ring.add_key_manager(kms[i]);
}
```

#### Decryption and Verification Example

Decrypt and verify via the `unbox` function. Pass the message, the KeyFetcher (like `ring` above), an ASP if you intend to cancel or monitor progress, and a callback to fire when done: 

```javascript
var ring = new kbpgp.keyring.KeyRing;
var kms = [alice, bob, charlie];
var pgp_msg = "---- BEGIN PGP MESSAGE ----- ....";
var asp = /* as in Encryption ... */;
for (var i in kms) {
  ring.add_key_manager(kms[i]);
}
kbpgp.unbox({keyfetch: ring, armored: pgp_msg, asp }, function(err, literals) {
  if (err != null) {
    return console.log("Problem: " + err);
  } else {
    console.log("decrypted message");
    console.log(literals[0].toString());
    var ds = km = null;
    ds = literals[0].get_data_signer();
    if (ds) { km = ds.get_key_manager(); }
    if (km) {
      console.log("Signed by PGP fingerprint");
      console.log(km.get_pgp_fingerprint().toString('hex'));
    }
  }
});
```

`unbox` calls back with two arguments: an Error if something went wrong, and an array of `Literals` if not. `Literal` objects support the `toString(enc)` and `toBuffer()` methods. The former call takes an optional parameter which is an encoding; if none is supplied, kbpgp will use the encoding specified in the PGP message; you can specify `utf8`, `ascii`, `binary`, `base64` or `hex` if you want to override that encoding.

This example shows that `unbox` handles both decryption and verification. To check if parts of the message were signed, make a `get_data_signer` call on each `Literal` in the message. Note that the same KeyManager that you loaded into your KeyFetcher shows up here. So if you augment that KeyManager with custom fields, they will be available here. 

#### The KeyFetcher Interface

 In a more general decryption/verification scenario, you might need to fetch the appropriate decryption and/or verification keys from secondary or remote storage. In this situation, you shouldn't use the KeyRing described above, but should instead provide a custom KeyFetcher.

All usable KeyFetchers must implement one method: `fetch`. Given several PGP key IDs, and a flag specifying which operation is requested, the fetch method should call back with a `KeyManager`, if it could find one. 

`fetch(ids,ops,cb)` is called with three arguments: 

1. `ids`—An array of [Buffers](#files-and-buffers), each one containing a 64-bit ID of a PGP key. These keys might refer to subkeys, which are often employed in encrypting and signing messages.
2. `ops`—Which crypto options are required of this key; a bitwise OR of constants from `kbpgp.const.ops`, which are:
    - encrypt : `0x1`
    - decrypt : `0x2`
    - verify : `0x4`
    - sign : `0x8`
3. `cb`—A callback that when done, calls back with a triple: `(err,km,i)`
    - `err` is an Error explaining what went wrong, or null on success.
    - `km` is, in the case of success, a KeyManager that meets the given requirements
    - `i` is, in the case of success, an integer indicating which of the keys was found in the lookup. If `0` is returned here, then `ids[0]` is the 64-bit ID of a key inside `km`. 

### Files and buffers

*In most of the examples, we've been dealing with string plaintexts and ciphertexts. Of course, sometimes you want to read and write files and convert to interesting strings such as hex or base64.*

Recall when we were encrypting, we expected a string for the message: 

```javascript
var params = {
  msg: "Chuck chucky, bo-bucky!",
  encrypt_for: chuck // a KeyManager instance
};
```

In Node.js we can pass a [Node.js Buffer](http://nodejs.org/api/buffer.html) instead. This could come from a file. Keep in mind this file's buffer and output need to fit easily in memory. (For arbitrarily large files, streams will come soon in kbpgp's future.) 

```javascript
fs.readFile('foo.png', function(err, buff) {
  var params = {
    msg:         buff,
    encrypt_for: chuck
  };
});
```

In the browser, we have a similar Buffer available, `kbpgp.Buffer`. It behaves exactly the same as a Node.js buffer, thanks to [native-buffer-browserify](https://github.com/substack/native-buffer-browserify).

```javascript
// using a string as a Buffer, in the browser
var params = {
  msg:         kbpgp.Buffer.from("Chuck chucky, bo-bucky!"),
  encrypt_for: chuck
};
```

#### Outputting buffers

kbpgp's `burn` function calls back with both a result_string (armored, when encrypting or signing), and a result_buffer (just raw binary data). The latter is either a Node.js Buffer, as discussed above, or, in the browser, a `kbpgp.Buffer`.

```javascript
kbpgp.burn(params, function(err, result_string, result_buffer) {
  console.log(result_buffer.toString('hex'));
  console.log(result_buffer.toString('base64'));
  // etc...
  // ...these work in both the browser and Node.js
});
```

#### In the browser, with HTML5

If you want to support file processing in the browser, you can use an HTML5 `FileReader` and convert a file's contents to a Buffer, right in the client side. Depending on the browser, you'll have memory constraints.

```javascript
var f = some_html_5_file_object;
var r = new FileReader();   // modern browsers have this
r.readAsBinaryString(f);
r.onloadend = function(file) {
  var buffer = kbpgp.Buffer.from(r.result);
  // ... now process it using kbpgp
};
```

### FAQ

#### There's something missing from this documentation—how do I ______?

The kbpgp website is brand new, and we're just getting started with the docs. Let us know in the [GitHub issues](https://github.com/keybase/kbpgp/issues).

#### What do you mean, "designed for concurrency"? 

Crypto is CPU intensive. The worst offender is RSA key pair generation, when we hunt for big-assed prime numbers. This plus JavaScript's single-threadedness equals a nightmare. Consider this fun thing:

```javascript
weird_sum = function() {
  var x = 0;
  for (var i = 0; i < 10000000; i++) {
    x -= Math.cos(Math.PI)
  }
  return x;
};
console.log(weird_sum());
```

The above function could take a few seconds in a browser, during which it would be unresponsive - no other JavaScript could run, no buttons or links could be clicked, nothing. It would pause your great life experience. In Node.js, your whole process would lock, and you'd go download Go.

One solution in the browser is to farm this process off to a web worker. This often works, although web workers are new and somewhat buggy (at the time of this writing, it's not hard to crash Chrome's), and they have very high overhead. On the Node side, you could run a separate process just for performing math operations, and send RPCs to it. (Aside: this is a good idea anyway.)

Regardless of where you run it, a heavy math operation can be written with single-thread concurrency in mind. You just have to (1) do work in batches, (2) defer to the event loop periodically via `setTimeout` or `process.nextTick`, and (3) call back with an answer, instead of returning one. A simple example:

```javascript
var _batch = function(a, batch_size, stop_at, cb) {
  var b, i, sum, _i;
  b = Math.min(stop_at, a + batch_size);
  sum = 0;
  for (i = _i = a; a <= b ? _i < b : _i > b; i = a <= b ? ++_i : --_i) {
    sum -= Math.cos(Math.PI);
  }
  if ((a = b) === stop_at) {
    cb(sum);
  } else {
    setTimeout(function() {
      _batch(a, batch_size, stop_at, function(sub_sum) {
        cb(sum + sub_sum);
      });
    }, 0);
  }
};

var weird_sum = function(cb) {
  _batch(0, 100000, 10000000, cb);
};

weird_sum(function(sum) {
  console.log(sum);
});
```

Writing code like this - where you call back with an answer - is contagious. If foo calls bar, and bar calls back with an answer, foo can't return that answer. It also must call back.

All of kbpgp is written this way, although a bit prettier than the example above. Further, kbpgp supports abortions and progress hook functions, unlike the examples above. In summary, you can run kbpgp on the same thread as other code, without any problems.

#### Why do you use CoffeeScript? Or rather, IcedCoffeeScript?

We think CoffeeScript is a great improvement over JavaScript, because it amounts to more concise, easier to read code. As for [IcedCoffeeScript](http://maxtaco.github.io/coffee-script/), we wrote it! Well, specifically Max forked CoffeeScript. IcedCoffeeScript is the same as CoffeeScript but has two additions (`await` and `defer`) that make async programming much nicer. Note the complete lack of a worker function in our above example, converted to Iced:

```coffeescript
weird_sum = (cb) ->
  x = 0
  for i in [0...10000000]
    x -= Math.cos Math.PI
    if not (x % 10000)
      await setTimeout defer(), 0
  cb x
```

Of course, kbpgp is compiled to JavaScript as part of our build process, so you do not need to use CoffeeScript to use it.

#### Why don't you just use OpenPGP.js or Google's End-to-End for Keybase? 

At the time of this writing, Google's End-to-End demands elliptic curve key generation -- and that is not compatible with the most popular PGP implementations. kbpgp can generate and handle both RSA and EC keys, so it's designed to work with the GPG and other PGP implementations.

As for OpenPGP.js, in late 2013, we looked at OpenPGP.js. Unfortunately, at the time we saw some things we disliked. This has been discussed elsewhere, and Google's team has also commented on it. We have not reviewed OpenPGP.js in its current state. 

### In the wild!

These are community projects are using kbpgp. Let us know if you do something cool (email `chris@keybase.io`), and we'll add you. The Keybase team & KBPGP contributors have not audited and are **not responsible** for the projects below. 

- [OnlyKey WebCrypt](https://apps.crp.to/encrypt?type=e), a serverless web app that integrates with [OnlyKey](https://crp.to/p/) and Keybase to provide PGP encryption everywhere on-the-go.
- [Top Secret](https://playtopsecret.com/demo.html), a game inspired by the Snowden leaks. ([Kickstarter](https://www.kickstarter.com/projects/1928653683/top-secret-a-game-about-the-snowden-leaks))
- [pgpkeygen.com](https://pgpkeygen.com/), an online PGP keygen using kbpgp.
- [fnContact.com/pgpkeys](https://fncontact.com/pgpkeys), an online PGP keygen using kbpgp.
- [PGP generator](https://thechiefmeat.github.io/pgp/), a site for PGP in the browser

----

We're just getting started with this tutorial and examples. Hit us up [on GitHub](https://github.com/keybase/kbpgp) if anything is missing.
