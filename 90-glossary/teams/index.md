
# Teams

Here is the technical documentation for teams:

* [Sigchain V2](sigchain_v2) is a discussion of changes to our sigchain format made for the sake of teams.
* [Per-User Keys](puk) describes how Keybase users, when using teams, share a secret key across all their devices.
* [Design](design) explains the high-level design goals of Teams
* [Signature Chain Details](details) describes the lower-level signature chain operation behind teams
* [Crypto](crypto) describes the lower-level cryptography behind teams
* [Team Loader](loader) describes the process of loading teams in the Keybase client.
* [Cascading Lazy Key Rotation](clkr) describes the key rotation process for teams.
* [Downgrade Leases](downgrade_leases) describes how cross-chain operations are kept serializable and race-free
* [Seitan Tokens V2](seitan_v2) describes how we securely invite a user to a team without server trust
* [Fast Team Loader](ftl) describes how team loading is fast-pathed on clients without primed caches
* [Team Box Auditor](box_auditor) describes how clients audit the server to make sure the teams' secret keys are keyed for the right users and devices
