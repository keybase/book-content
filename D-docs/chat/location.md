# Location Sharing

Keybase offers the option of sharing your location into conversations in chat
from the mobile app. These can be either personal chats or team chats, wherever
the /location command is available. In addition, the client allows for posting
your location over a time interval, a so-called "live location". The proper use
of this feature requires Keybase to have access to the user's location on the
mobile device.

## How it Works

Locations are shared into conversations through the use of the Google Maps
Static API. The system for obtaining the map is similar to how [Giphy search is
implemented](linkpreviews). We use the following procedure to obtain a map:

1. Keybase client opens a TCP connection to the Keybase Google Maps proxy
   server.
2. Keybase client performs TLS for the googleapis.com domain and certificate.
   This protects the data from Keybase.
3. The Keybase proxy server opens a TCP connection to googleapis.com and begins
   forwarding packets to/from Google and the Keybase client. This protects the
   client from exposing its IP address to Google.

Once we have the map, we package it up, encrypt it, and send it directly into
the chat selected. As a result, receivers of this map will just be downloading
an encrypted payload like any other from Keybase, no communication with any
third party is required.

## Live Location

In order to post a location continuously over a time interval, Keybase
implements the following procedure:

1. Start a loop that will run until the user either explicitly stops location
   sharing, or the timer runs out.
2. At most every 30 seconds, delete the current map posted for the location
   share, and replace it with a new one containing the updated location. In
   addition, we add on another map that shows where the user has been during the
   location share.
3. Once the location share is complete, we post a final map indicating the user
   is no longer sharing their location.
