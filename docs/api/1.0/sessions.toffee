#{partial 'api_header.toffee'}

        <h2>Sessions</h2>

        <h4>Cookie-based</h4>

        <p>
          A successful login to Keybase will set a <code>session</code> cookie. This needs
          to be passed to all API's.
        </p>

        <h4>Client-Generated Auth Token</h4>

        <p>
          An alternative scheme is for the client to generate an Auth-Token.  See
          `sig/post_auth` for more information on how to generate such a token. Once
          generated, the client should include the header:
        </p>

         <blockquote>
          <tt>X-Keybase-Auth-Token: <em>uid</em>,<em>auth_token</em></tt>
         </blockquote>
        <p>
          Both the <em>uid</em> and <em>auth_token</em> fields should be given in hexadecimal
          representation.  This validation will work as long as the <em>auth_token</em> isn't expired
          or the key that signed it isn't revoked.
        </p>

