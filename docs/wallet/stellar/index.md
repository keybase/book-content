#{partial './stellar_header.toffee'}

<div>

<md>

## Stellar wallet key management

The Keybase Stellar wallet keeps your Stellar account keys secure yet conveniently available
on your devices.

### Summary

When you add a Stellar account to your Keybase wallet, the private key and the name of the
account are encrypted by your client.  A bundle of all your Stellar account information
is stored in the Keybase database.  A sigchain link is created for your primary account so
other users can find a Stellar address to send you payments.

When you need a Stellar private key to make a payment, the client downloads the account
key bundle from the Keybase servers, decrypts it to get the key, and signs the transaction.
The key is then erased from memory as soon as it is no longer needed.

Although the keys are stored on the Keybase servers, the private keys are encrypted with
a client-side key that the Keybase servers do not have access to.  Having the encrypted
keys on the Keybase servers allows you to have all your Stellar accounts on all your devices.

### Basics

Stellar data for a user consists of:

1. Links in the sigchain for your primary Stellar account ID.  The most recent one is your
   current primary account.
1. A bundle of plaintext data, visible to user and server with information about the stellar accounts in the user's keybase wallet.  Name: **server visible**.
1. A global bundle of encrypted data containing secret metadata (i.e. the account name) about all the stellar accounts in the user's keybase wallet.  Name: **user private**.
1. Per-account encrypted data containing the private stellar account key necessary for signing a transaction.  Name: **account private**.

All Stellar data are stored in the Keybase database.  The server reads
**server visible** when necessary.  It cannot decrypt **user private** or **account private**
as it does not have the encryption keys necessary.  The client will fetch **server visible** and **user private**
from the server in order to display the wallet accounts, their balances, recent transactions.  To
sign a transaction, the client will fetch the **account private** bundle and discard it after use.

To encrypt this data, the client uses Per-User Keys.  We have an [entire document](/docs/teams/puk)
on PUKs, but a simplistic view of it is a seed that is encrypted for all [device keys](/blog/keybase-new-key-model)
for a user.

The keys used for encryption are symmetric NaCL keys derived from the user's PUK seed and
a constant string specific for these bundles.

For **user private** bundles, it is:

    key = hmac(key=[puk seed], data="Derived-User-NaCl-SecretBox-StellarBundle-1")

For **account private**, it is:

    key = hmac(key=[puk seed], data="Derived-User-NaCl-SecretBox-StellarAcctBundle-1")

The **user private** data is packed into binary data via msgpack.  This is then sealed with a random nonce
and the derived symmetric key.  The encrypted data, nonce, version of encrypted data, and generation of the
PUK are put into a structure.  That structure is packed into binary data via msgpack.  The msgpack data is
then encoded into a string via base64.

The **account private** data is packed into binary data via msgpack.  This is then sealed with a
random nonce and the derived symmetric key.  The encrypted data, nonce, version of encrypted
data, and generation of the PUK are put into a structure.  That structure is packed into binary
data via msgpack. The msgpack data is then encoded into a string via base64.

The **server visible** bundle structure is packed into binary data via msgpack.  It is then encoded 
into a string via base64.

When you change which Stellar account is your primary account, a link is inserted in your [sigchain](/docs/sigchain).
This is so that other users can find which account belongs to you so they can send you Stellar lumens or assets.

### Mobile-only mode

As an extra security measure, you can mark any of your Stellar accounts as "mobile-only".  Since mobile
device applications have better sandboxing, there is less likelihood of a rogue application interacting
with the keybase app to retreive your secret keys.

Once you set an account to be mobile-only, the server will only return the encrypted **account private** bundle
to mobile devices.

To protect against someone with access to one of your desktop devices from provisioning a new mobile device
and using that to gain access to a mobile-only account, the server will not return the encrypted **account private**
bundle to any mobile devices that are less than 7 days old.  In addition to this, you will receive plenty of
notifications that a new device was added to your account so that you can take appropriate action if necessary.

Only a (sufficiently old) mobile device can turn off the mobile-only setting on an account.

### Sending to future Keybase users or users without wallets

Once you have a Keybase wallet, you can send XLM to any Keybase user even if he or she hasn't established
any Stellar accounts, or any future Keybase user.

```bash
keybase wallet send serenawilliams@twitter 5 USD
```

(Currently, no user on Keybase has proven ownership of the serenawilliams@twitter account, but you can
still send her lumens!)

We do this using what we call a "relay" payment.

If we detect that the person you are sending to either doesn't have a Stellar account associated with
their Keybase account or isn't even on Keybase yet, then we create a temporary holding account where
we send the payment.  The private key for the account is encrypted for the "team" consisting of the sender
and the recipient.

In the example above of sending to Serena Williams, the Keybase app would create a new random account,
say `GCYMBZE2RB5ZMSGB5KVOFR5XOGT6ZKVQ426QUU7RHKI7XWLT5CUIO3YS`.  It would encrypt the private key for that
account using a similar method as encrypting chat or KBFS files shared between the sender and `serenawilliams@twitter`.
The encrypted data for the relay account is stored in the Keybase database.

Once the recipient creates an account on Keybase and proves `serenawilliams@twitter`, her new client will create
a Stellar account key pair.  It will then notice that there is a relay payment waiting for her, so it
will create an account merge transaction to send all the funds from `GCYMBZ...` into her 
new account.

Until the recipient does this, the sender can cancel the relay payment at any time.  When that happens,
an account merge transaction sends all the funds from `GCYMBZ...` back into the sender's account.

### Data cleanup

When possible, we expunge any Stellar data from the database.

For example, if you revoke a device, transparently to you, your client will make a new PUK for you and 
reencrypt your Stellar **user private** and **account private** bundles.  Once they are posted to the 
servers, the prior bundle versions (encrypted for your old keys) will be permanently deleted.

When you delete a Stellar account from your wallet, the data is permanently deleted.

### Backups

We recommend users store secure backups of their Stellar private keys.  By design, we cannot recover
the private keys.  If you lose all your Keybase installs and paper keys, the encrypted keys will not
be decryptable.

### Links

* [download it!](/download)
* [all other documentation](/docs)
* [reporting issues via GitHub](https://github.com/keybase/client/issues)


</md>

</div>
#{partial './stellar_footer.toffee'}


