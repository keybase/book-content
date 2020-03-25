## Proof Verification Script

This is a python3 script intended to help you build an integration with Keybase. The idea is,
if you've built a complete integration on your side, and lightly edited this script for your
specific application, it should pass all the way through.

It takes the path to a [config file](/docs/proof_integration_guide#1-config), and attempts
to make all of the HTTP requests against the site listed in the config. Even if you don't run it, reading
the code might help explain how the back and forth works.

To get started,
1. copy this into a file in a python3 environment,
1. make sure the [`requests`](http://docs.python-requests.org/en/master/) and
[`json`](https://docs.python.org/3/library/json.html) and [`lxml`](https://lxml.de/) modules are available,
1. update the [example config](/docs/proof_integration_guide#1-config) for your site
1. run it in your terminal like this: `python verify.py ./config.json`

```python
import os
import json
from lxml import html
import requests
import sys

print("Welcome to the Keybase verification script. The point of this script "
"is to help you see what an end-to-end working integration flow looks "
"like. It is our hope that this will help you have something to build "
"against. For more info, check out our docs: "
"http://keybase.io/docs/proof_integration_guide\n")

# CHANGE ME
# ---------
identity_service_username = "squeekytween"
identity_service_password = "hunter2"
# This is the URL for the request that happens when a user click
# on the `Submit` or `Post` button on your site. It's super specific
# to your implementation, so we'll make a reasonable guess if you
# don't fill this in. But our guess is probably wrong, so just fill
# this in when you figure out what it should be.
proof_post_url = None

# This is the signature ID of a Reddit proof on a test user. It is a valid proof
# and so will pass the Keybase check if you're doing it on your side when these
# values get posted. For an explanation of why this is necessary, see:
# http://keybase.io/docs/proof_integration_guide#3-linking-user-profiles
kb_username = "marvin_gannon"
sig_id = "06dec904c22abaf6d4498ff7fc54a5b55759bbece2418b4a82b5ac5b1052466b0f"
# and here's another existing test user for you to play with (this one on twitter)
# using this you can test a user with multiple keybase usernames or an update to a signature
# kbuser: t_alice, sig_id: 8514ae2f9083a3c867318437845855f702a4154d1671a19cf274fb2e6b7dec7c0f

# Check that this script was called correctly
try:
    sys.argv[1]
except IndexError:
    print("Missing path to config. Please run like this: `python verify.py ./config.json`")
    sys.exit()

# Read in the config as json
config_path = sys.argv[1]
with open(config_path) as json_data:
    config = json.load(json_data)
print("1. Read in your config. Thanks. \nIf the script prompts you for additional "
"information, please feel free to stop the run, and go hardcode the values we're "
"looking for. They're all right at the top of the file. And if any of the requests "
"are failing, You may need to tweak some things to work with your specific site.\n")

# Set up valid creds for your service so we can create an authenticated session.
# We'll plop in our defaults, and if they're still there (please change them above), we'll
# prompt for new ones.
if identity_service_username == "squeekytween":
    identity_service_username = input(f"Username of a valid account in {config['display_name']}: ")
if identity_service_password == "hunter2":
    identity_service_password = input(f"Password for {identity_service_username}: ")

# create a basic, logged in session
base_url = os.path.join("https://", config['domain'])
session = requests.session()
login_url = os.path.join(base_url, "auth/sign_in")
result = session.get(login_url)
tree = html.fromstring(result.text)
# This is super application-specific, so it's very unlikely to be correct.
# But it's hopefully representative enough to get you there without too much effort.
authenticity_token = list(set(tree.xpath("//input[@name='authenticity_token']/@value")))[0]
data = {
    "user[email]": identity_service_username,
    "user[password]": identity_service_password,
    "utf-8": "✓",
    "authenticity_token": authenticity_token,
}
resp = session.post(login_url, data=data, headers=dict(referrer=login_url))
assert resp.status_code == 200
print(f"2. Created an authenticated session to {config['display_name']} for {identity_service_username}.")

######################################
# PROOF CREATION: http://keybase.io/docs/proof_integration_guide#2-1-proof-creation
######################################
# go to the prefill_url with the keybase username and signature values populated
prefill_url = config['prefill_url']
prefill_url = prefill_url.replace("%{kb_username}", kb_username, 1)
prefill_url = prefill_url.replace("%{username}", identity_service_username, 1)
prefill_url = prefill_url.replace("%{sig_hash}", sig_id, 1)
resp = session.get(prefill_url)
assert resp.status_code == 200
assert kb_username in resp.text, "kb_username should be in the response text"
assert sig_id in resp.text, "kb_username should be in the response text"
print("3. Was able to GET the prefill_url, and naively, the response appears "
" to have what we expect. \nPlease take a look at this output and verify that "
"it's what you expect. There should be a submit button, and the keybase "
"username and sig_hash.")
print(resp.text)

input("\nPress enter when it looks right...")

# This is completely unique to your site, and what we have here is likely
# not correct. This should be the POST that gets called from clicking on
# the submit button.
proof_post_url = proof_post_url or prefill_url
data = {"kb_username": kb_username, "sig_hash": sig_id}
resp = session.post(proof_post_url, data=data)
assert resp.status_code == 201, "expected posting the proof to be a 201"
print(f"4. Successfully posted the proof for {username}/{kb_username} to {config['display_name']}!")
# Now that we're done posting the proof, we no longer need the session.
# Let's delete it so we don't use it accidentally below.
del(session)

######################################
# PROOF CHECKING: http://keybase.io/docs/proof_integration_guide#2-2-proof-checking
######################################
# Now that the proof has been posted to your site, we'll check it.
check_url = config['check_url']
prefill_url = check_url.replace("%{username}", identity_service_username, 1)
headers = {"Accept": "application/json"}
resp = requests.get(check_url, headers=headers)
assert resp.status_code == 200, "expected checking the proof to be a 200"
response_data = resp.json()
# step into it using the check_path to find the data we care about
running_proofs = response_data
for step in config['check_path']:
    running_proofs = running_proofs[step]
expected_proofs = [{'kb_username': kb_username, 'sig_hash': sig_id}]
assert running_proofs == expected_proofs, "expected proofs from your check_url to match"
print("5. Got the proofs we were looking for. Everything checks out. :)")
```

