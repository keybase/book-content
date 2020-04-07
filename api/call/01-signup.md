## signup

{#
        print partial '../call_item.toffee',

          title:  'signup'
          method: 'POST'
          sample_params: """
                name:           "Chris"               # required
                email:          "cc@chriscoyne.com"   # required
                username:       "chris"               # required
                pwh:            "aabbccee..."         # required
                pwh_version:    3                     # required
                salt:           "7d34343eeeee..."     # required
                invitation_id:  "0000000000123"       # required...for now
                pdpka5_kid:     "0120aabb....."       # required
          """
          sample_output: """
                {
                  "status": {
                      "code": 0
                  },
                  "csrf_token": "lgHZIDFjZmY0Nzlj..."
                }
          """
          watch_for: ["BAD_SIGNUP_USERNAME_TAKEN", "BAD_SIGNUP_USERNAME_DELETED", "BAD_SIGNUP_USERNAME_RESERVED", "BAD_SIGNUP_EMAIL_TAKEN", "BAD_SIGNUP_TEAM_NAME", "INPUT_ERROR"]
          suffix: """
            <h4>Picking a salt</h4>
            <p>
              It is the client app's responsibility to generate a salt.
              Make sure to use a
              strong pseudo-random number generator. In the browser, for example, we collect entropy
              from a combination of <code>window.crypto.getRandomValues</code>
              and a bunch of extra CPU timing.
            </p>

            <p>
              Your salt should be a 16-byte number, hex encoded. In other words,
              it should be sent to Keybase as a 32-character hex string.
            </p>
            <h4>Generating the password hash (pwh) and PDPKA5 Key (pdpka5_kid)</h4>
            <p>
              For these two fields, compute:
              <blockquote>
                <code>
                 passphraseStream = scrypt(passphrase, unhex(salt), N=2<sup>15</sup>, r=8, p=1, dkLen=256)<br/>
                 pwh = passphraseStream[192:224]<br/>
                 v5 = passphraseStream[224:256]<br/>
                 pdpka5_kid = keybaseKID(edDSAPublicKeyFromSeed(v5))<br/>
                </code>
              </blockquote>
              That is, we stretch the input passphrase using the salt generated on signup.
              One slice of the output stream is interpreted directly as <code>pwh</code>, the legacy
              passphrase hash.  It's more or less ignored on the server.  The next slice is
              treated like an <a href="https://ed25519.cr.yp.to/">EdDSA</a> private key, and
              the corresponding public key is sent to the server in Keybase <a href="/docs/api/1.0/kid">key ID</a> format. See the <a href="login">login</a> API call for more details on how this
              is used later for logins.
            </p>
          """
#}
