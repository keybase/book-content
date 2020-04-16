<style>
body .kbfs-crypto-spec {
  counter-reset: h2counter;
}
.kbfs-crypto-spec h1 {
  counter-reset: h2counter;
}
.kbfs-crypto-spec h2:before {
  content: counter(h2counter) ".\0000a0\0000a0";
  counter-increment: h2counter;
}
.kbfs-crypto-spec h2 {
  counter-reset: h3counter;
}
.kbfs-crypto-spec h3:before {
  content: counter(h2counter) "." counter(h3counter) ".\0000a0\0000a0";
  counter-increment: h3counter;
}
.kbfs-crypto-spec h3 {
  counter-reset: h4counter;
}
.kbfs-crypto-spec h4:before {
  content: counter(h2counter) "." counter(h3counter) "." counter(h4counter) ".\0000a0\0000a0";
  counter-increment: h4counter;
}
.kbfs-crypto-spec h4 {
  counter-reset: h5counter;
}
.kbfs-crypto-spec h5:before {
  content: counter(h2counter) "." counter(h3counter) "." counter(h4counter) "." counter(h5counter) ".\0000a0\0000a0";
  counter-increment: h5counter;
}
.kbfs-crypto-spec p.note {
  font-size: 0.4em;
}
</style>

<div class="kbfs-crypto-spec">
  <h1>Crypto spec: the Keybase filesystem (KBFS)</h1>

  <md>
    See also: [KBFS documentation](/docs/kbfs)
  </md>

  <p>Version 2.0</p>
  <p><strong>ChangeLog</strong></p>
  <ul>
    <li>Version 2.0
      <ul>
        <li>Describe the new block encryption/hashing scheme, addressing the low-risk issue NCC-KB2018-005 in the <a href="https://keybase.io/docs-assets/blog/NCC_Group_Keybase_KB2018_Public_Report_2019-02-27_v1.3.pdf">NCC audit</a>.  We will eventually stop supporting new blocks being generated with the old scheme.</li>
      </ul>
    </li>
    <li>Version 1.10
      <ul>
        <li>Point to new teams documentation.</li>
      </ul>
    </li>
    <li>Version 1.9
      <ul>
        <li>Temporarily remove talk of orgs while we refactor the doc.</li>
      </ul>
      </li>
    <li>Version 1.8
      <ul>
        <li>More details and dates for the KBFS Merkle Trees.</li>
      </ul>
      </li>
    <li>Version 1.7
    <ul>
      <li>A threat model</li>
    </ul>
    </li>
    <li>Version 1.6
    <ul>
      <li>Say what's in progress on what's implemented.</li>
      <li>Last writer isn't encrypted.</li>
    </ul>
    </li>
    <li>Version 1.5
      <ul>
        <li>Remove pairwise HMACs, just used signatures.</li>
        <li>Rename file from <tt>crypto</tt> to <tt>kbfs-crypto</tt>.</li>
        <li>Remove browser/deterministic keys.</li>
      </ul>
    </li>
    <li>Version 1.4
      <ul>
        <li>Revert PRF-based per-block key generation</li>
        <li>Raise Jeremy's objection to MAC-ing TLFs with read-only members.</li>
        <li>Provide system overview</li>
        <li>Better key exchange specifics</li>
      </ul>
    </li>
    <li>Version 1.3
      <ul>
        <li>PRF-based per-block key generation system with per-epoch folder keys</li>
        <li>Try to use "TLF" consistently everywhere instead of "folder" or "directory"</li>
      </ul>
    </li>
    <li>Version 1.2
    <ul>
      <li>Describe directory IDs</li>
      <li>Detail \((M_f, m_f)\) generation</li>
    </ul>
    </li>
    <li>Version 1.1
    <ul>
      <li>Organizations</li>
      <li>Readers can push onto reader lists</li>
      <li>Merkle Trees for Public and Private data</li>
    </ul>
    </li>
    <li>Version 1.0: Initial Revision</li>
  </ul>

  <h2>Threat Model and Security Claims</h2>

  <p>
  <strong>End-to-end security</strong>: Keybase promises secrecy and integrity of
  file system data and metadata even in the case of total server compromise.</p>

  <p>Our key cryptographic assumptions are: (1) weak collision-resistence of SHA256; (2) the
  security of the
  <a href="https://github.com/golang/crypto/tree/master/nacl">Go</a>
  <a href="https://github.com/agl/ed25519">Implementation</a> of the
  <a href="http://nacl.cr.yp.to">NaCl</a> cryptographic library.
  </p>

  <p>
  <strong>Best Effort via Access Control</strong>: If our server infrastructure isn't compromised, we provide only via access control:
  </p>

  <ul>
    <li>Forward-secrecy for lost or decomissioned devices.</li>
    <li>Confidentiaility regarding which private folders have data, and which
        are empty.</li>
    <li>Confidentiality for quota data.</li>
  </ul>
  <p>
  In other words, an adversary who has access to Keybase's server data could:
  learn about who is communicating with whom via KBFS; would have the same
  usage details we would eventually use for billing; and would be able to recover data encrypted
  for lost or decomissioned devices, if they additionally recover those devices.
  </p>

  <p>
  Of course we are mere mortals and don't believe we can indefinitely stave off
  conserted attacks against our infrastructure, so we encourage our users to only
  depend on our end-to-end security claims.
  </p>

  <p>Additionally, we don't guarantee availability of data or metadata in the
  case of server compromise.</p>

  <h2>System Overview</h2>

  <p><strong>Sibling keys and subkeys</strong>.
    Each user in Keybase keeps two keypairs per device; one keypair
    for signing, and one pair for encryption.  Secret keys never leave the
    device.  The signing keys are known as "siblings" since they
    all are equally powerful.  Any active sibling key can provision or revoke
    another device.  Subkeys are signed by an active sibling key but can't
    delegate to other keys.  The first of a series of sibling keys is
    called an "eldest" key and can be revoked without affecting its other
    live siblings.
  </p>

  <p><strong>Private Personal Directories</strong>
  Every keybase user gets a private personal directory, keyed so that all
  of her devices can read and write it.
  </p>

  <p><strong>Public Directories</strong>
   Groups of one-or-more users can create public directories.  Items in
   public directories are signed by one of the devices of one of the directory's
   writers; they are not encrypted.  Public directories are good places to release
   software or authenticated manifestos.
  </p>

  <p><strong>Private Group Directories</strong>
    The most interesting case, a group of people with read/write permission
    get together with some other people who have read-only permission to share
    a directory.  This directory should use authenticated encryption to
    guarantee that only someone in the group could have written to it.  It
    should further use some mechanism (currently vanilla signatures) to determine which writer is
    responsible for which write, so that users can't put words in each other's mouths.
  </p>

  <p><strong>Forest of Merkle Trees</strong> [Unimplmented]
    Keybase keeps public Merkle trees for managing: (1) each user's collection of keypairs
    and public identities; and (2) the progression of file system states, so that the
    server can't maliciously roll back to previous states.
  </p>

  <h2>Keys</h2>

  <h3>Eldest Key</h3>

  <p>
    When a user Alice (\(A\)) joins, she starts off by generating or
    importing a keypair.  For our current users, this is a PGP keypair,
    denoted (\(P_A,p_A\)). But there's nothing special about PGP keys,
    and we are free to change the format in the future. We call this keypair
    Alice's <em>eldest</em> keypair, since it's the first among potentially
    many sibling keys.
  </p>

  <h3>Per-Device Keys</h3>
  <p>
    For each of her devices, Alice generates two per-device keypairs.
    The signing key becomes a sibkey, and the encryption keypair is just a
    subkey.
  </p>

  <p>
    For Alice's \(i\)th device, the procedure is:
  </p>

  <ol>

   <li>
    Generate an <a href="http://ed25519.cr.yp.to/">Ed25519</a> <a
    href="https://github.com/agl/ed25519">Keypair</a> at random, yielding the
    pair \((E^i_A, e^i_A)\). In Ed25519, the private key is a 64-byte
    string, and the public key is a 32-byte (derived) string.
   </li>

   <li>
     <a href="https://code.google.com/p/go/source/browse/nacl/box/box.go?repo=crypto&r=8fec09c61d5d66f460d227fd1df3473d7e015bc6#32">Generate</a> a <a href="http://nacl.cr.yp.to/">Curve25519 Keypair</a> suitable for use
     with NaCL's <a href="http://nacl.cr.yp.to/box.html">Box</a> feature (or Go Crypto's <a href="https://code.google.com/p/go/source/browse/nacl/box/box.go?repo=crypto&r=8fec09c61d5d66f460d227fd1df3473d7e015bc6#60">box.Seal</a> feature). Call
     it \((M^i_A,m^i_A)\). In Curve25519
    (Montgomery form), the public and private key are both 32-byte strings.
   </li>

   <li>
    Sign \(E^i_{A}\) with a valid sibling key; and as in PGP, include a "reverse" signature
    of the delegating key, signed by the new key.  Push this <em>sibkey</em> signature
    into Alice's signature chain.  See <a href="key-exchange">our doc</a> on key exchange
    for more specifics.
   </li>

   <li>
     Sign \(M^i_{A}\) with \(e^i_{A}\).  Push this <em>subkey</em>
     signature into Alice's signature chain.
   </li>

   <li>
     Store \(e^i_{A}\) and \(m^i_{A}\) on device \(i\)
   </li>
  </ol>

  <h3>Key IDS (kids)</h3>
  <p>
    Keybase has an idea of a "Key ID".  In the case of PGP keys, it's a hash
    of the public key materials.  In the case of ECC keys, it's the public key
    itself. We describe here how to construct them in Version 1:
  </p>

  <ul>
    <li>For a PGP public key \(P\), compute the serialization \(s(P)\)
    as you would to compute a PGP fingerprint.  Let \(t\) be the one-byte type
    of the key in question. For example, or RSA, \(t = 1\); for DSA \(t = 17\).
    See <a href="http://tools.ietf.org/html/rfc4880#section-9.1">RFC 4880</a> and <a href="http://tools.ietf.org/html/rfc6637#section-5">RFC 6637</a> for a complete list.
    Then:
      <blockquote>
        kid(\(P\)) = <tt>0x01</tt> || \(t\) || SHA-256(\(s(P)\)) || <tt>0x0a</tt>
      </blockquote>
    </li>
    <li>For a NaCl encryption key, \(E\):
      <blockquote>
        kid(E) = <tt>0x01</tt> || <tt>0x21</tt> || E || <tt>0x0a</tt>
      </blockquote>
    </li>
    <li>For a NaCl EDDSA key, \(M\):
      <blockquote>
        kid(M) = <tt>0x01</tt> || <tt>0x20</tt> || M || <tt>0x0a</tt>
      </blockquote>
    </li>
  </ul>

  <h2>Top-Level Folder (TLFs) in KBFS</h2>

  <p>
  A top-level folder (TLF) in KBFS has a fixed set of readers and writers, as specified by
  the name of the folder.  Every file and folder recursively contained in a TLF has
  the same permissions as its parent.  This orginization will feel a little bit different from normal
  POSIX semantics, but greatly simplifies the system.
  </p>

  <h3>Private TLFs</h3>
  <p>
    We cover the case of private TLFs with multiple readers and writers first, since
    it's the most general. Home directories are a simple subcase of general private
    group TLFs.
  </p>

  <h4>Keying a Private Group TLF</h4>

  <p>
  Let's say Alice (\(A\)) is creating a new TLF for Bob (\(B\))
  and Charlie (\(C\)). Bob has read/write access, and Charlie only gets
  read-only access. Alice keys the folder (call it \(f\)) for all other
  users when she creates it. The procedure is as follows:
  </p>
  <ol>
    <li>Generate a random 15-byte directory ID, with the suffix <tt>0x16</tt></li>
    <li>Generate a per-TLF Curve25519 DH key pair for inclusion of this folder's
        metadata in the site's private-data Merkle tree; call it \((M_f, m_f)\).
    </li>
    <li>Generate a 32-byte random secret key (version=0 for the first one): \(s^{f,0}\) =
    rand(32)</li>
    <li>Generate an ephemeral Curve25519 Diffie-Helman keypair.  Call it \((M_e,m_e)\).</li>
    <li>For each user \(u\) in \(\{A,B,C\}\):
     <ol>
      <li>For each device \(i\) in \(u\)'s set of devices:
        <ol>
          <li>generate \(s^{f,0,i}_{u} = \) rand(32).
           This will be the server-side half of the key.</li>
           <li>
             \(t^{f,0,i}_{u} = s^{f,0,i}_u \oplus s^{f,0}\).  That is, XOR the global per-TLF key together with the per-user-per-device key to get a masked key.
           </li>
          <li>
            \(S^{f,0,i}_{u} = (M_e, \)Box\((m_e, M^i_u, t^{f,0,i}_u))\).
            That is, run the <a href="http://nacl.cr.yp.to/box.html">NaCl Box</a> function with the ephemeral private key, with the user's public device key,
            and on the message \(t^{f,0,i}_u\).
            This new key \(S^{f,0,i}_u\) can now be published publically.  It
            can only be decrypted by \(u\)'s private device key, and with some server
            assist (via \(s^{f,0,i}_u\)).  Note that we prepend the public key
            \(M_e\) to the output of Box.  Eventually, we might need to add new keys
            or replace existing keys, and we'll do so with a new ephemeral keypair.  So
            \(M_e\) might eventually be replaced.
          </li>
        </ol>
       </li>
     </ol>
    </li>
    <li>Publish the following metadata (\(md_c\)) in the clear:
      <ol>
        <li>A block of reader keys.  In this case it's just Charlie who is read-only:
            <blockquote>
               readers = \([ S^{f,0,1}_{C}, S^{f,0,2}_{C}, S^{f,0,3}_{C} ]\)
            </blockquote>
        </li>
        <li>
          A block of writer keys.  In this case it's Alice and Bob:
            <blockquote>
               writers = \([ S^{f,0,1}_{A}, S^{f,0,2}_{A}, S^{f,0,1}_{B},S^{f,0,2}_{B} ]\)
            </blockquote>
        </li>
        <li>
          The public key \(M_f\)
        </li>
      </ol>
    </li>
    <li>Some of the metadata is encrypted.  Construct a plaintext \(md_{e}\) as:
      <ol>
        <li>The root TLF block (described more below).</li>
        <li>The private key \(m_f\).</li>
      </ol>
      <p>
      Then, the encryption is computed as: SecretBox(\(s^{f,0}, md_{e}\))
      </p>
    </li>

  </ol>

 <p>
    Note that the server sees reader and writer blocks in the clear, and
    can therefore sanity check updates to them.  For instance, the server
    can check that the readers and writers correspond to the TLF
    name, and that readers and writers aren't being dropped maliciously
    during updates.
  </p>

  <p>
    Similarly, the last writer is known to the server, since the server should
    check the signatures on incoming updates.
  </p>

  <p>
    Writers can obviously update all of the metadata and data for a TLF.
    Readers can change two fields in the folder's metadata: they can push new
    keys onto the end of the reader key list; and they can flip the folder's
    "rekey" bit to "on."  In either case, they sign these changes with any of
    their valid signing sibkeys.  The server and clients can check that all
    updates to metadata are authorized. The server rejects unauthorized
    updates, and clients ignore them.
  </p>

  <h4>Encrypting a Block</h4>

  <p>
    Once she has established keys as above, Alice can start encrypting blocks.
    Take any arbitrary plaintext block like \(b_j\) in TLF \(f\).
    Assume version 0 of the key. To encrypt:
    <ol>
      <li> Generate a random 32-byte per-block key \(s_{j}\).</li>
      <li> Compute \(h_{j} = HMAC512(s^{f,0}, s_{j})\).
      <li> Let \(h^{[0,31]}_{j}\) be the first 32 bytes of \(h_{j}\), to be used as the block encryption key.
      <li> Let \(n\) be the next 24 bytes of \(h_{j}\), to be used as a nonce.
      <li> Compute: \(B_j = \) SecretBox\((h^{[0,31]}_{j}, n, b_j)\)</li>
      <li> For the initial rollout, store \(\{n,s_j\}\) along with \(B_j\) on the
           hosted storage provider.  In the future, we hope to store \(s_{j}\) on machines
           we host to get more secure block deletion.</li>
    </ol>
  </p>

  <p>
    The idea of some sort of per-block key is one we'll want to keep and
    expand upon in the future.  It allows us to be quite liberal in distributing
    encrypted blocks to CDNs and local caches, without fearing that they might
    be never thrown away. If we apply more strict access controls on per-block
    keys \(s_j\), we still retain some ability to throw away blocks, even
    after client key compromise.
  </p>

  <p>
    We're not using convergent encryption or anything like it, so a block that's used twice
    will be encrypted differently both times.  However, clients will keep per-folder caches that
    map hashes of block plaintexts to encrypted block IDs.  So they shouldn't reencrypt/reupload
    blocks they know to be repeats.  In practice, this local lookup might be good enough, since often
    data is read before it's copied, and many block copies will hit this cache.  We don't
    want to allow block deduplication across top-level-directories for privacy reasons.
  </p>

  <h4>FS Structure</h4>

  <p>
    The files in a TLF form a Merkle Tree as in other secure distributed file systems
    (including <a href="https://spqr.eecs.umich.edu/papers/sfsro-tocs.pdf">SFSRO</a>,
     <a href ="https://www.usenix.org/legacy/event/osdi04/tech/full_papers/li_j/li_j.pdf">SUNDR</a>
     and <a href="https://www.tahoe-lafs.org/">Tahoe-LAFS</a>).
    However, KBFS makes the same simplification as the <a href="http://ori.scs.stanford.edu/">ORI File system</a>,
    and does away with iNode-style indirection. Thus, KBFS cannot implement hard-links
    without deeper architectural changes.
  </p>

  <p>
    Block IDs are computed as the SHA-256 hashes of encrypted blocks
    and their nonces.  Using the nonce \({n}\) (which is
    derived from the block's secret key) prevents the server from
    colluding with another writer in the folder to compute another
    combination of secret key and plaintext data that will result in
    the same ciphertext for the block, thus allowing the server to
    serve alternate blocks (with identical block IDs) to some subset
    of readers.  By deriving the nonce from the secret key, we
    guarantee that the block IDs would be different even if the
    attacker found a way to duplicate the ciphertext, and thus the
    attack would be detectable by the client.  For more details, see
    NCC-KB2018-005 in the <a
    href="https://keybase.io/docs-assets/blog/NCC_Group_Keybase_KB2018_Public_Report_2019-02-27_v1.3.pdf">NCC
    audit</a>
  </p>

  <p>
    Directory nodes are, in turn, maps of file names
    to Block IDs.  They are packed as blocks, and get the same
    encryption treatment as data blocks. This structure continues
    recursively up to the TLF root.
  </p>

  <h4>Signing The Root Block</h4>

  <p>
    Readers and writers in a private shared TLF know via authenticated
    encryption that someone who had access to \(s^{f,0}\) wrote \(f\),
    but they don't know who.  Alice can try to steal credit for Bob's work, or
    Bob might frame Alice for saying something naughty.
  </p>

  <p>
    A sledgehammer approach to this problem would be to have Alice sign the
    root block of \(f\) on every update.  But this is too strong of a
    statement. If Eve later compromises Charlie's key, she can blackmail
    Alice, since Alice proved to Bob, Charlie and everyone else that she wrote
    particular contents to \(f\).
  </p>

  <p>
    We experimented with various pairwise symmetric MAC schemes, to achieve
    repudiability as in OTR protocols.  However, such schemes didn't work for
    folders with non-writing readers.  So we do the simple thing which is
    just to sign the hash of the root block with the writer's per-device
    EdDSA signing key.  The same technique is used in all three cases:
    public directories, private directories without non-writing readers,
    and private directories with non-writing readers.
  </p>

  <h3>Public Directories</h3>

  <p>
    If user \(u\) updates a KBFS folder with his \(i\)th device,
    he must sign his changes to the whole folder state by signing its root block.
    This will in effect sign all data and metadata contained recursively in this folder.
  </p>

  <p>To sign, \(u\) computes the complete metadata \(md\)
  as specified above, except without encrypting \(md_e\).  He then signs the block:
    <blockquote>
      \(\sigma(md) = \) Sign(\(e^i_{u},md\))
    </blockquote>
  </p>

  <p>
   The <em>Sign</em> function outputs both the signature, and the KID of the
   key used to generate it.  This way, verifiers know which key to use.
  </p>

  <h3>Home Directories</h3>

  <p>
    As described above, home directories are special cases of TLF group
    directories. When Alice sets up encryption keys for all of her devices,
    she uses the protocol described in 4.1.1, iterating all of her per-device
    keys.  Alice can skip the signing step described in 4.1.3, because she is not
    worried about the "confused authorship" attack, but she still needs to
    sign \(md\) as for public directories to prevent the server from
    spoofing rekeys.
  </p>

  <h2>Keeping the Server Honest</h2>

  <p>
    Unless we're careful, the server can selectively withhold file system updates
    or can serve two different versions of the FS to two different clients.  In
    this section, we describe the precautions we take to prevent these sorts of
    attacks.
  </p>

  <p>
    Our general approach is that the server creates a Merkle Tree out of all
    sensitive site data, then signs and publishes this tree for all to see.
    Third party monitors are invited to check on the progression of the site's
    Merkle trees and to check they obey the specified cryptographic consistency
    constraints.  Clients check their views of the file system with those
    published in the Merkle trees to make sure the server isn't rolling back
    state or attempting a fork.
  </p>

  <p>
    There are three separate Merkle trees to consider: (1) the Keybase Core
    Merkle tree that publicizes sibling keys, public identity proofs, and
    ``follower'' statements;
    (2) a public-data Merkle tree that captures all of the public data on KBFS; and
    (3) a private-data Merkle tree that encapsulates the state of all private data on KBFS.
  </p>

  <h3>The Keybase Core Merkle Tree</h3>

  <p>
    As described in <a href="../server_security">our
    Server Security</a> document, users sign statements about their keys,
    their identities and the identities of others. They commit these
    signatures to monitonically growing signature chains, which are collected
    into a sitewide Merkle Tree. As we describe later in this document, these
    signature chains will eventually cover organizations in addition to single
    users.  These structure all exist outside of KBFS and should be accessible
    without KBFS software.
  </p>

  <h3>The Public-Data Merkle Tree</h3>

  <p>
    All public directories on KBFS are collected into a sitewide Merkle Tree.
    The leaves of this tree are dictionaries of key-value pairs.  The key
    is the ID of the TLF, and the value is most recent signature of
    the TLF <tt>RootMetadata</tt> block.  This signature contains,
    recursively: the writer keys for this directory, the root directory
    entry for this directory, and the hash of the previous <tt>RootMetadata</tt>
    block.
  </p>

  <p>
    Interior nodes of the merkle tree are constructed upwards, covering shorter
    prefixes of the directory IDs listed in the leaves.  The final root is
    signed, and published periodically, maybe every hour.
  </p>

  <h3>The Private-Data Merkle Tree</h3>

  <p>
    Private data deserves the same treatment as public data, but we have to
    be slightly more careful not to reveal: (1) how often private directories
    are modified; or (2) even worse, who is collaborating with whom.  Naive
    solutions might allow an adversary to correlate device additions in public
    sigchains with changes in private TLFs to correlate share membership.
    We take a pretty blunt approach that should solve data leaks from the server
    to the public.
  </p>

  <p>
    When a user Alice creates private TLF \(f\), she generates a
    Curve25519 keypair \((M_f, m_f)\). She stores \(M_f\) in the folder's
    public metadata, and \(m_f\) in the folder's private metadata.
  </p>

  <p>
    Every hour, the server makes a new Merkle Tree of the entire site's private data.
    The algorithm is:
    <ol>
      <li>Generate an ephemeral Curve25519 keypair \((M_S, m_s)\)</li>
      <li>For each private folder \(f\):
      <ol>
         <li>
         Perform encryption \(C_f \leftarrow\) Box(\(m_s,M_f,\sigma_f\)), where \(\sigma_f\)
         is the most-recent signature of \(f\)'s metadata.
         </li>
         <li>
          Make a mapping of the ID of \(f\) to \(C_f\).
         </li>
      </ol>
      </li>
      <li>
        Construct a Merkle tree from these leaves as in the Public data case, and publish
        the tree along with \(M_s\), the public ephemeral Curve25519 key.
      </li>
    </ol>

  </p>

  <p>
    When Alice's client goes to fetch TLF \(f\), she gets the most recent
    root from the server, and also the most recently-published Merkle tree
    from the server.  She traces a path down the from the root to the leaf for \(f\),
    and then decrypts \(\sigma_f\) using \(m_f\).  She finally checks
    that the current root links back to the root published in the merkle tree.  She might
    of course need to traverse 100s or 1000s of links if there were many writes in the
    last hour, but the server should batch all of the data necessary to make this
    determination in a few RPC calls. Future implementations might also implement
    "skip list"-style fast-forward links to speed this process for periods of heavy
    writes.
  </p>

  <h3>Merkle Tree Integration</h3>

  <p>
    The roots of the two KBFS Merkle trees will be inserted into the root block of
    the main Keybase Merkle Tree.  Doing so establishes ordering relationships between
    key manipulations and writes to KBFS.  In turn, this knowledge allows
    KBFS clients to determine if writes to KBFS happened before or after a key is revoked,
    and therefore whether or not a corrupt server has exploited an exposed key.
  </p>

  <h2>Keying, Rekeying, and Revoking</h2>

  <h3>Adding A New Device</h3>

Imagine Bob gets a new device. He now wants to provision it for access to all
relevant KBFS folders. Here are the high-level steps he would take:

  <ol>
    <li>Key generation</li>
    <li>Key certification: sign the new key with an existing sibling key</li>
    <li>TLF keying: add the key to the relevant reader and writer blocks</li>
  </ol>

The first step, key generation, was covered above, and is the same here.
Key certification is covered in our <a href="key-exchange">key exchange</a>
document.

  <h4>TLF Keying</h4>

  <p>
  Now Bob must go through and add write access for his device on all encrypted
  Keybase directories that he can write. Call his new device \(n\) and
  his old device \(d\). Device \(d\) does the following:
  </p>

  <ol>
    <li>Generate an ephemeral Curve25519 Diffie-Helman keypair.  Call it \((M_e,m_e)\).</li>
    <li>For every TLF \(f\) that Bob can read:
     <ol>
      <li>Use \(m^{d}_{B}\) to decrypt \(t^{f,0,d}_B\)</li>
      <li>Query the server for \(s^{f,0,d}_{B}\) and XOR to recover \(s^{f,0}\)</li>
      <li>Encrypt \(s^{f,0}\) using sender key \(m_e\) and receiver key \(M^{n}_{B}\),
          which was generated on device \(n\) and securely transferred over to \(d\)
          in previous steps.</li>
      <li>
        Add \(S^{f,0,n}_B\) to the writers (or readers) list for \(f\) and
        sign with \(e^{d}_B\)
      </li>
      </ol>
    </li>
  </ol>

  <p>
  Bob pushes \((M_e, S^{f,0,n}_B)\) to TLF \(f\)'s reader or
  writer list.  If he is a reader, he is allowed to push onto the reader list
  in the metadata.  If he is a writer, he can edit \(f\)'s metadata
  at will.
  </p>

  <h3>Freezing a Device [Unimplemented]</h3>

  <p>
  If Alice loses a device \(d\), the first thing to do is to "freeze" access
  to the device via the server.  Any device that can establish a session as the user
  can do so.  Once a device is frozen, the server will refuse to honor requests for
  key-halves of the form \(s^{f,0,d}_{A}\). Any device but \(d\) can
  ask for an unfreeze.
  </p>

  <p>
  Alice can take an additional (optional) step.  She can sign a <em>key freeze</em> into her
  signature chain for each signing key on the lost device.  Other clients should refuse
  to honor signatures from frozen keys during the freeze window.  Alice can later
  cancel the freeze using the same key that ordered the freeze.  The server
  can't assist here, so Alice can only freeze a specific key if she has another provisioned device.
  </p>

  <h3>Decommisioning a Device (And Optionally Adding a New One)</h3>

  <p>
  To decommision a device, Alice should first freeze it as above, issuing a final revocation
  statement for the key into her sigchain. Her client should
  then iterate over all TLFs that she has read or write access to, and delete the lost
  keys from the keyblocks, and then rekey.  She of course needs an active keypair in order to do this.
  Let's say \(r\) is Alice's lost device, and \(d\) is her currently
  active device.  Also, Alice can optionally provision a new device \(n\) as a result
  of this process:
  </p>

  <ol>
    <li>For each TLF \(f\) Alice can write to:
    <ol>
      <li>Generate an ephemeral Curve25519 Diffie-Helman keypair.  Call it \((M_e,m_e)\). </li>
      <li>Delete \(S^{f,0,r}_{A}\)</li>
      <li>Ask the server to delete \(s^{f,0,r}_A\).</li>
      <li>Generate a new 32-byte random secret key (version=1 for the next one): \(s^{f,1}\) = rand(32)</li>
      <li>For each user \(u\) who can access \(f\)
      <ol>
        <li>For each device \(i\) that \(u\) has:
          <ol>
            <li>As before, generate \(s^{f,1,i}_{u} = \) rand(32), for the server-side of the key</li>
            <li>As before, encrypt:
              \(S^{f,1,i}_{u} = \)Box\((m_e, M^i_u, s^{f,1,i}_u \oplus s^{f,1})\)
            </li>
          </ol>
        </li>
      </ol>
      </li>
      <li>If provisioning \(n\), generate and encrypt \(S^{f,1,n}_{A}\).</li>
      <li>Store the rekeyed key blocks to the server, signed with \(e^d_A\)</li>
      <li>Store \(M_e\) to the server </li>
      <li>Don't bother to reencrypt old blocks, so leave the old decryption materials around
          (except for the compromised key)</li>
    </ol>
    </li>
    <li>For each TLF \(f\) Alice can read:
      <ol>
        <li>Ask the server to delete \(s^{f,0,r}_A\).</li>
        <li>Flip the <strong>rekey</strong> flag on TLF \(f\) to ``on''.  The next writer who updates the directory
            will perform the above protocol that Alice used for her writable directories.</li>
      </ol>
    </li>
    <li>Rekey any organizations that Alice is a member of (see below).</li>
  </ol>

  <h3>Eldest Key Update (or Deletion) [Unimplmented]</h3>

  <p>
    If Alice fears all of her sibling keys have been compromised, she should
    start from scratch. The protocol is:
  </p>

  <ol>
    <li>Generate a new eldest key pair.</li>
    <li>Generate a new per-device keys for the the current device.</li>
    <li>Decomission all old keys, while provisioning the device keys.</li>
  </ol>

  <p>
    If simply deleting her account, Alice will do as above but will not generate
    new keys or provision new devices.
  </p>

  <h2>Organizations</h2>

  <p>
    See our discussion of <a href="/docs/teams">Teams</a>.
  </p>

  <h2>Other Topics</h2>

  <h3>File Wipe [Unimplemented]</h3>

  <p>
    The server maintains a list of which block-specific keys are in use for
    each folder.  It doesn't know which key corresponds to which files, since
    the TLF structure cannot be recreated without decryption keys.
  </p>

  <h4>With A Provisioned Device</h4>

  <p>
    Say the user wants to delete a file \(f\).
    A provisioned device can compute a set \(I\) such that for any \(i \in I\),
    \(b_i\) is or was a part of \(f\).  The client then asks
    the server to delete \(s_i\) for \(i \in I\).  The server
    honors this request as long as the user can write to the parent TLF.
  </p>

  <h4>Without a Provisioned Device</h4>

  <p>
    If a user loses all of his provisioned devices, he can ask the server to wipe
    a TLF by deleting all keys for blocks in that TLF.  The server keeps
    a list, so can perform the task.  Of course, the server will only honor
    such a request if the user can write to this TLF.
  </p>

</div>
