#{partial 'api_header.toffee'}

      <h2>Responses</h2>

      <p>
        All API responses are JSON. Every response includes a <code>status</code> object and a <code>csrf_token</code> string.
      </p>

      <h4>Successes</h4>

      <p>
         The simplest possible response is:
      </p>

      <hcode>json
        {
          "status": {
            "code": 0
          },
          "csrf_token": "lgHZIDFjZmY0Nzlj..."
        }
      </hcode>

      <p>
        As you can guess, a status of <code>0</code> is success. Yeehah!
      </p>

      <h4>Errors</h4>
      <p>
        Extra info accompanies error codes. If an input
        is missing or formatted incorrectly,
        you'll get a generic <code>"INPUT_ERROR"</code> or <code>"MISSING_PARAMETER"</code>, with a <code>fields</code> dictionary, describing all the errors.
      </p>

      <hcode>json
        {
          "status": {
            "name":    "INPUT_ERROR",
            "code":    100,
            "desc":    "missing or invalid input",
            "fields": {
              "email": "invalid email address"
            }
          },
          "csrf_token": "lgHZIDRlMjJjN..."
        }
      </hcode>

      <p>
        If the fields are good, but there's a logical error, expect a custom error code. The API documentation
        will show which ones to expect for each call.
      </p>

      <hcode>json
        {
          "status": {
            "name":   "BAD_SIGNUP_USERNAME_TAKEN",
            "code":   701,
            "desc":   "username taken",
            "fields": [ "username" ]
          },
          "csrf_token": "lgHZIDFjZmY0Nzlj..."
        }
      </hcode>

#{partial 'api_footer.toffee'}
