
# Teams

Here is the technical documentation for teams:

* [Sigchain V2](/docs/teams/sigchain) is a discussion of changes to our sigchain format made for the sake of teams.
* [Per-User Keys](/docs/teams/puk) describes how Keybase users, when using teams, share a secret key across all their devices.
* [Design](/docs/teams/design) explains the high-level design goals of Teams
* [Signature Chain Details](/docs/teams/details) describes the lower-level signature chain operation behind teams
* [Crypto](/docs/teams/crypto) describes the lower-level cryptography behind teams
{# * [Team Loader](/docs/teams/?) describes the process of loading teams in the Keybase client. #}
* [Cascading Lazy Key Rotation](/docs/teams/clkr) describes the key rotation process for teams.
* [Downgrade Leases](/docs/teams/downgrade-leases) describes how cross-chain operations are kept serializable and race-free
* [Seitan Tokens V2](/docs/teams/seitan) describes how we securely invite a user to a team without server trust
* [Fast Team Loader](/docs/teams/ftl) describes how team loading is fast-pathed on clients without primed caches
* [Team Box Auditor](/docs/teams/box-auditor) describes how clients audit the server to make sure the teams' secret keys are keyed for the right users and devices
