# Link Previews

The Keybase chat client offers the ability to generate previews of URLs posted
in chat messages, and display them inline in the conversation thread. The client
protects user privacy when generating these previews in the following ways:

1. Allows the user to control which domains they have allowed previews to be
   generated for. By default, the client is configured to prompt the user for
   every domain of the URLs the user sends. This way, the user doesn't
   accidentally expose their IP address to a random link they paste into a
   message by mistake. A user client only visits a link if the user has
   explicitly granted permission to do so.
2. Previews are completely packaged up, encrypted and sent into the chat
   thread with all information necessary to render the preview in all receiving
   clients. This way receiving clients also do not need to visit the URL to
   preview it, all the information is in the encrypted payload of the thread.

## Prompts

Whenever a URL is sent into a chat thread, the user will be prompted to take
action on it for the purposes of the link previews. The options are the
following:

1. Always - the client will always automatically generate a preview for all
   domains in the future.
2. Always for _domain_ - the client will never prompt for the specific domain
   again.
3. Yes, but ask again for _domain_ - the client will generate the preview for
   the current message, but will ask again for the _domain_.
4. Not now - the client will not generate a preview for this message.
5. Never - the client will never generate any preview, or prompt for them in the
   future.

The domain whitelist data is stored in a special hidden, "developer" chat
conversation associated with the user. This allows the user to sync the domain
whitelist to all of their devices without the Keybase server knowing the
contents of it. The hidden chat channels get all of the same encryption and
privacy of a normal chat channel, but provides the benefit of allowing the
Keybase client to sync cross device in an encrypted manner. 

## Giphy

Giphy.com is special-cased in the Keybase client to allow for searching for GIFs
to send directly from the client. We use a technique similar to
[Signal](https://www.signal.org) to
safeguard user privacy for these requests as described in their [blog
post](https://signal.org/blog/giphy-experiment) about
the subject. The general technique is to use a TCP proxy on the Keybase
server-side to anonymize the requests into Giphy.com. This has the effect of
hiding the search contents from Keybase, and hiding the IP address of the user
from Giphy.com. This is achieved in the following manner:

1. Keybase client opens a TCP connection to the Keybase Giphy proxy server.
2. Keybase client performs TLS for the giphy.com domain and certificate. This
   protects the data from Keybase.
3. The Keybase proxy server opens a TCP connection to Giphy.com and begins
   forwarding packets to/from Giphy and the Keybase client. This protects the
   client from exposing its IP address to Giphy. 

Giphy link previews are packaged, encrypted and sent into conversation threads
in the same manner as any other link preview, so receivers will never contact
the Keybase Giphy proxy or Giphy to render the content. 


