    ## Keybase is now writing to the Bitcoin blockchain


    Every public announcement you make on Keybase is now verifiably signed by Keybase and hashed into the Bitcoin blockchain. To be specific, all of these:

    * announcing your Keybase username
    * adding a public key
    * identity proofs (twitter, github, your website, etc.)
    * public bitcoin address announcements
    * public follower statements
    * revocations!

    ### Quick background

    Earlier, in [the server security overview](/docs/server_security) we described Keybase's approach
    to server security: (1) each user has his or her own signature chain that grows
    monotonically with each announcement; (2) the server maintains a global Merkle Tree that
    covers all signature chains; and (3) the server signs and publishes the root of the Merkle
    Tree with every new user signature.  This configuration strongly discourages the server
    from *lying by omission*, since clients have the tools to catch the server in the act.

    There was one point we glossed over.  A sophisticated adversary Eve could
    commandeer our server and *fork* it, showing Alice and Bob different versions
    of server state. Eve could get away with her attack as long as she never
    tries to merge Alice and Bob's views back together, and as long as they don't
    communicate out-of-band. (See [Mazières and Shasha](http://cs.brown.edu/courses/cs296-2/papers/sundr.pdf)
    for a formal treatment of fork-consistency).

    ### Enter the Bitcoin Blockchain

    Thanks to Bitcoin, we are now unforkable.

    Since 16 June 2014, Keybase has been regularly pushing its Merkle Root into the
    Bitcoin blockchain, signed by the key [1HUCBSJeHnkhzrVKVjaVmWg2QtZS1mdfaz](https://blockchain.info/address/1HUCBSJeHnkhzrVKVjaVmWg2QtZS1mdfaz).  Now, Alice and Bob can consult the blockchain
    to find a recent root of the Keybase Merkle tree.  Unless Eve can fork the Bitcoin blockchain, Alice and Bob will see the same value, and can catch
    Eve if she tries to fork Keybase.

    Another way to think of this property is to turn it on its head.  Whenever Alice uploads
    a signed announcement to the Keybase servers, she influences Keybase's Merkle Tree, which in turn influences
    the Bitcoin blockchain, which in turn Bob can observe.  When Bob observes changes in the Bitcoin
    blockchain, he can work backwards to see Alice's change.  There's little Eve can do to
    get in the way without being detected.


    ### You Mean My Signatures affect the Bitcoin Blockchain?

    Yes.  Here's how to verify it. We're providing sample code for both Python and [IcedCoffeeScript](http://maxtaco.github.io/coffee-script/) - these should work right in your REPL, so go ahead, fire up python or iced,
    and start playing.

    First, find the most recent Keybase insertion into the Bitcoin blockchain; it is always the most recent
    expenditure by [1HUCBSJeHnkhzrVKVjaVmWg2QtZS1mdfaz](https://blockchain.info/address/1HUCBSJeHnkhzrVKVjaVmWg2QtZS1mdfaz):

  </md>

  {#
    print partial '../../components/code_snippet.toffee', samples: [
      {
        lang: 'Python'
        code: """
          from   urllib2 import urlopen
          import json
          from_addr = "1HUCBSJeHnkhzrVKVjaVmWg2QtZS1mdfaz"
          uri       = "https://blockchain.info/address/%s?format=json" % (from_addr)
          to_addr   = json.load(urlopen(uri))['txs'][0]['out'][0]['addr']
        """
      }
      {
        lang: 'IcedCoffeeScript'
        code: """
          request = require 'request'
          addr    = "1HUCBSJeHnkhzrVKVjaVmWg2QtZS1mdfaz"
          uri     = "https://blockchain.info/address/#{P}{addr}?format=json"
          await request {uri : uri, json : true }, defer err, res, json
          to_addr = json.txs[0].out[0].addr
        """
      }
    ]
  #}

  <md>
    You'll get something new, but on Monday 14 Jul 2014 at 11:33 EST, the output was:

    ```
    168bJepnpoZkoW5AWE7TxNhvuNPmsNmyvS
    ```

    The Keybase servers sent a small amount of bitcoin to that address, intending
    never to recover it, and instead, to use 160 bits of the address to capture
    the hash value of its Merkle root.   Use standard Bitcoin math to convert
    this address into a hex-encoded hash value:
  </md>

  {#

    print partial '../../components/code_snippet.toffee', samples: [
      {
        lang: 'Python'
        code: """
          from pycoin.encoding import bitcoin_address_to_hash160_sec, hash160
          from binascii import hexlify
          to_addr_hash = hexlify(bitcoin_address_to_hash160_sec(to_addr))
          print to_addr_hash
        """
      }
      {
        lang: 'IcedCoffeeScript'
        code: """
          btcjs = require 'keybase-bitcoinjs-lib' # regular 'bitcoinjs-lib' works too
          to_addr_hash = btcjs.Address.fromBase58Check(to_addr).hash.toString('hex')
          console.log to_addr_hash
        """
      }
    ]
  #}

  <md>
    Which outputs: `38482d2daf98ee6c04b2e2fd32981de6e78a3b60`

    Now do a lookup on Keybase to find the matching root block for that hash:
  </md>

  {#

    print partial '../../components/code_snippet.toffee', samples: [
      {
        lang: 'Python'
        code: """
          kb        = "https://keybase.io/_/api/1.0"
          uri       = "%s/merkle/root.json?hash160=%s" % (kb, to_addr_hash)
          root_desc = json.load(urlopen(uri))
          print root_desc
        """
      }
      {
        lang: 'IcedCoffeeScript'
        code: """
          kb  = "https://keybase.io/_/api/1.0"
          uri = "#{P}{kb}/merkle/root.json?hash160=#{P}{to_addr_hash}"
          await request { uri : uri, json : true }, defer err, res, root_desc
          console.log root_desc
        """
      }
    ]
  #}

  <md>
    You can examine this JSON output to find a lot of goodies, but really what we
    care about is the `sig` field, which contains a signature of the hash of the
    root block, and the hash of this signature should match the value we found in
    the Bitcoin blockchain:
  </md>


  {#
    print partial '../../components/code_snippet.toffee', samples: [
      {
        lang: 'Python'
        code: '''
          import re
          from base64 import b64decode
          keybase_kid = '010159baae6c7d43c66adf8fb7bb2b8b4cbe408c062cfc369e693ccb18f85631dbcd0a'
          sig = b64decode(re.compile(r"\\n\\n((\\S|\\n)*?)\\n=").search(root_desc['sigs'][keybase_kid]['sig']).group(1))
          assert (to_addr_hash == hexlify(hash160(sig)))
        '''
      }
      {
        lang: 'IcedCoffeeScript'
        code: """
          assert = require 'assert'
          keybase_kid = '010159baae6c7d43c66adf8fb7bb2b8b4cbe408c062cfc369e693ccb18f85631dbcd0a'
          sig = Buffer.from root_desc.sigs[keybase_kid].sig.match(/\\n\\n([\\na-zA-Z0-9\\/\\+=]*?)\\n=/)[1], 'base64'
          assert.equal hash, btcjs.crypto.hash160(sig).toString('hex')
        """
      }
    ]
  #}

  <md>
    Aha, a match!  What was all that regex goo, you might
    ask.  The signature field itself is a standard PGP signature, with the familiar `---- BEGIN PGP ----`
    framing, comment fields, and checksum.  The regex strips away the skin and leaves just the meat.

    We are currently using the [PGP Key](/docs/api/1.0/kid) [010159baae6c7d...](/docs/server_security/our_merkle_key)
    to sign our commitments, but plan to transition to an EdDSA key in the future. We will publish those
    signatures under a different key of the `sigs` object, corresponding to that new key's KID.

    Now that we've verified the hash of this signature was written to the blockchain, we can either verify
    the signature via `gpg`, or try something quick and dirty to strip out the signature's payload data.  For
    this demonstration, the latter suffices. Pull out the hash of the root block as follows:
  </md>


  {#
    print partial '../../components/code_snippet.toffee', samples: [
      {
        lang: 'Python'
        code: '''
          root_hash = re.compile(r"\\"root\\":\\"([a-f0-9]{128})\\"").search(sig).group(1)
        '''
      }
      {
        lang: 'IcedCoffeeScript'
        code: """
          root_hash = sig.toString("utf8").match(/"root":"([a-f0-9]{128})"/)[1]
        """
      }
    ]
  #}

  <md>
    Now we have the root, we can descend the Merkle tree to get the corresponding user data.  Let's look
    up my data, but feel free to try your own:
  </md>

  {#
    print partial '../../components/code_snippet.toffee', samples: [
      {
        lang: 'Python'
        code: '''
          username = "max"
          uri      = "%s/user/lookup.json?username=%s" % (kb, username)
          uid      = json.load(urlopen(uri))['them']['id']
          print uid
        '''
      }
      {
        lang: 'IcedCoffeeScript'
        code: """
          username = "max"
          uri      = "#{P}{kb}/user/lookup.json?username=#{P}{username}"
          await request { uri : uri, json : true }, defer err, res, json
          uid      = json.them.id
        """
      }
    ]
  #}

  <md>
    Descending the Merkle tree works as follows.  First, lookup the actual
    root block that corresponds to the root hash:
  </md>

  {#
    print partial '../../components/code_snippet.toffee', samples: [
      {
        lang: 'Python'
        code: '''
          uri = "%s/merkle/block.json?hash=%s" % (kb, root_hash)
          value_string = json.load(urlopen(uri))['value_string']
        '''
      }
      {
        lang: 'IcedCoffeeScript'
        code: """
          uri = "#{P}{kb}/merkle/block.json?hash=#{P}{root_hash}"
          await request { uri : uri, json : true }, defer err, res, json
        """
      }
    ]
  #}

  <md>
    Next, check that the server wasn't lying about the contents of the block:
  </md>

  {#
    print partial '../../components/code_snippet.toffee', samples: [
      {
        lang: 'Python'
        code: '''
          from hashlib import sha512, sha256
          computed_hash = hexlify(sha512(value_string).digest())
          assert(computed_hash == root_hash)
        '''
      }
      {
        lang: 'IcedCoffeeScript'
        code: """
          {createHash} = require 'crypto'
          computed_hash = createHash('sha512').update(json.value_string).digest('hex')
          assert.equal computed_hash, root_hash
        """
      }
    ]
  #}

  <md>
    Then go down the path from the tree root to my leaf.
    The first node is indexed with the first hex character of my UID;
    the next node down is indexed with the first two hex characters of my UID;
    and so on, until we hit a leaf node:
  </md>

  {#
    print partial '../../components/code_snippet.toffee', samples: [
      {
        lang: 'Python'
        code: '''
          for i in range(1,len(uid)):
            tab = json.loads(value_string)['tab']
            prefix = uid[0:i]
            nxt = tab.get(prefix)
            if nxt == None:
              break
            uri = "%s/merkle/block.json?hash=%s" % (kb, nxt)
            value_string = json.load(urlopen(uri))['value_string']
          my_triple = tab[uid][1]
        '''
      }
      {
        lang: 'IcedCoffeeScript'
        code: """
          for i in [1...uid.length]
            tab = JSON.parse(json.value_string).tab
            prefix = uid[0...i]
            nxt = tab[prefix]
            break unless nxt?
            uri  = "#{P}{kb}/merkle/block.json?hash=#{P}{nxt}"
            await request { uri : uri, json : true }, defer err, res, json
          my_triple = tab[uid][1]
        """
      }
    ]
  #}

  <md>
    At this point, we can again check the server isn't lying to us about this block in the Merkle
    tree using the same technique as above. After we do, we are down at the leaf of the tree, and can
    jump to my record:
  </md>

  {#
    print partial '../../components/code_snippet.toffee', samples: [
      {
        lang: 'Python'
        code: '''
          link_hash = my_triple[1]
        '''
      }
      {
        lang: 'IcedCoffeeScript'
        code: """
          link_hash = my_triple[1]
        """
      }
    ]
  #}

  <md>
    The triple contains: (0) the length of my signature chain; (1) the hash of the last thing I signed;
    and (2) the hash of the signature of the last thing I signed.

    We're almost there! Now let's fetch my whole signature chain, zoom to the last link, check that it
    matches the hash we got above, and dump it out (pretty-printed)
  </md>

  {#
    print partial '../../components/code_snippet.toffee', samples: [
      {
        lang: 'Python'
        code: '''
          uri           = "%s/sig/get.json?uid=%s" % (kb, uid)
          payload       = json.load(urlopen(uri))['sigs'][-1]['payload_json']
          computed_hash = hexlify(sha256(payload).digest())
          assert(computed_hash == link_hash)
          print json.dumps(json.loads(payload), indent=4)
        '''
      }
      {
        lang: 'IcedCoffeeScript'
        code: """
          uri = "#{P}{kb}/sig/get.json?uid=#{P}{uid}"
          await request { uri : uri, json : true }, defer err, res, json
          payload_json = json.sigs[-1...][0].payload_json
          computed_hash = createHash('sha256').update(payload_json).digest('hex')
          assert.equal computed_hash, link_hash
          console.log JSON.stringify(JSON.parse(payload_json), null, 4)
        """
      }
    ]
  #}

  <md>
    In my case, the last thing I signed was a statement of my Facebook proof.
    In sum, this statement was hashed into my signature chain, which was hashed into Keybase's Merkle
    tree, which eventually was injected into the Bitcoin blockchain, for all eternity. That's a strong
    guarantee.
