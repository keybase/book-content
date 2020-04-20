# Coin Flip

The /flip command on Keybase chat implements a [commitment
scheme](https://en.wikipedia.org/wiki/Commitment_scheme) protocol
allowing the members of a channel to participate in secure coin flips.
Leveraging the fact that all messages in chat are signed by the sender, building
such a protocol on top of chat is a natural fit. In addition to flipping coins,
the shared randomness can also be used to present different forms of the flip;
such as shuffling items, picking a random number, and even dealing hands of
playing cards.

# Flips

The types of flips supported right now include the following:

1. /flip - Flip a coin.
2. /flip 6 - Roll a _k_-sided die.
3. /flip -10..10 - Pick a random number in a range
4. /flip apple, orange, pear - Shuffle a list of items
5. /flip cards - deal a deck of cards
6. /flip cards 5 mike, chris, max, patrick - Deal out a hand of 5 cards to a
   list of people
7. /flip @here - shuffle the members of a channel
8. /flip cards 5 @here - deal out hands of 5 cards to the channel

# Protocol

The following is a description of the protocol the chat client uses to implement
the commitment scheme.

1. The _initiator_ starts the flip by issuing a /flip command.
2. All members of the channel commit to a secret by sending a chat message into
   a special hidden "developer" channel including the same members as the host
   channel.
3. The initiator collects all commitments in a set time interval, and sends a
   message with all of the participants that responded in time. These are the
   participants in the flip result.
4. Upon reception of this message, clients send chat messages revealing their
   secrets, and confirm that the secrets of others match their commitments.
5. The final result is displayed in the chat channel once all secrets are
   revealed.

As long as a participant trusts at least one person in the flip (including
themselves if they participated), then the result of the flip is fair.

A caveat with this protocol is that participants can disappear after committing
to a flip. In this case, the chat client will render an error for the flip,
since it could be the case that a disappearing participant is just trying to
force a new flip to happen (although it is more likely the user just
disconnected).

# UI Display

A special feature of the UI is rendering the flip while it is in progress. This
can be seen with the orange and purple boxes that animate while the flip is
happening. These boxes are a visualization of the bytes of the commitments and
secrets as they are received by the chat client. The color of each cell maps a
byte of a commitment or secret to a color pallette.
