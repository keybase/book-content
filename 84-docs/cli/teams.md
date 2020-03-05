{#
  yername = me?.basics?.username or 'yourname'
  emoji = (e) -> """<span style="color:#fff;">#{e}</span>"""
  if platform_detection?.Windows
    kbfs_url = "K:\\keybase\\team\\"
  else
    kbfs_url = "/keybase/team/"
#}

<style>
.gs-img {
  text-align:center;
  margin:40px 0;
}
#page-teams-alpha ul li {
  margin-bottom:10px;
}
#page-teams-alpha h3 {
  margin-top:50px;
}
</style>

<div id="page-teams-alpha">

      <md>
        ## Teams for Keybase

        ## <span class="label label-success">YEee</span> <span class="label label-success">HAW!</span>

        Brand new

        <div class="alert alert-info">Note: feel free to share this page privately, but please don't post on HackerNews, ProductHunt, etc. We're waiting for a bigger announcement.</div>

        ### What is it?

        A keybase team is a *named* group of people, with flexible membership. If you work on a project called Acme, you could register the team name `acme` on Keybase. This team name is *universal*; there can be only one Keybase team with a given name.

        A team's encrypted files can be found in `#{kbfs_url}`:

        <img src="/images/teams/team_kbfs.png" class="img img-responsive">

        Teams can have chat channels, kind of like Slack.  But unlike Slack, Keybase chats are end-to-end encrypted, and your team's admins cryptographically control who is on the team.

        Each team gets a default `#general` chat channel, but you can make more.

        During this early alpha, team administration is solely done through the command line. If that's ok with you, keep reading.

        ### A command-line TL;DR:
        ```bash
        # make a team
        # -----------

        > keybase team create dingbatz

        # see what teams you're in
        # ------------------------

        > keybase team list-memberships
        Team            Role      Username    Full name
        keybase         owner     chris       Chris Coyne
        dingbatz        owner     chris       Chris Coyne

        # add some people
        # ---------------------------------------------

        > keybase team add-member dingbatz --user max     --role=admin
        > keybase team add-member dingbatz --user crudder --role=writer
        > keybase team list-memberships dingbatz

        # end-to-end encrypted KBFS folders
        # ---------------------------------
        > mv ~/Dropbox/Manifesto.pdf .

        # and chats!
        # --------------------------------------------

        > keybase chat send dingbatz "hello to my pals"

        ```

        ### In the GUI

        I actually ran the above commands, so now I see the "dingbatz #general" chat channel show up in my UI. Max and crudder do, too, since I added them. We can share files in KBFS, and we can chat. If I add someone else to the team, they'll get access to the files and chat histories, too, as we'll rekey for them.

        In an upcoming release, it will be prettier, but right now team chat looks like a regular chat with no avatar, and prefixed with that ugly `#general`. This is an MVP, so please bear with us.

        <img src="/images/teams/dingbatz.png" class="img img-responsive">

        ### Casual teams and big orgs

        We want to support both casual discussions (e.g., pokerpals) and large organizations (e.g., nytimes).

        To serve bigger groups:

         * there will soon be a teams tab in the app for administering with greater complexity
         * we have baked-in subteam support. For example, `atlassian.usa.marketing` or `nytimes.devops`.

        For the next 4-8 weeks, all administration is in the CLI.


        ### The most important command

        ```bash
        keybase team help
        ```

        ### Making chat channels

        In the first days of our alpha, creating a chat channel other than `#general` is slightly annoying. You have to kick it off by sending a message from the CLI:

        ```bash
        keybase chat send --channel '#hr-issues' uber "let's do this"
        ```

        After that your team can use it in the GUI - both on the desktop and phone apps. Anyone who wants to join the channel (for now) can do it from the command line.

        ```bash
        # join a channel
        keybase chat join-channel fyre '#festival2018'

        # or list channels
        keybase chat list-channels acme
        ```

        Oh, also, at-mentioning a team member will pull them in...so the simplest thing is just to make a channel, join it yourself, and then ping someone on it in the GUI.

        A chat channel can be joined by anyone on a team. For example, if you have an `acme #design` channel, anyone in `acme` can join and read it.

        If you want to segregate chats, cryptographically, this is what subteams will be for. More on that below.


        ### Subteams

        We have implemented subteams! For example, if you're the owner of `nike`, you could keep the top team pretty empty and divide your company into `nike.usa` and `nike.marketing` and even deeper teams such as `nike.web.engineering.interns2017`. And if you did a partnership with Apple, you could make `nike.apple_partnership` and put some people who work at Apple into that subteam.

        ```bash
        # assuming you're an admin of nike
        keybase team create nike.board
        ```

        Each subteam in your org has its own chat channels. So to have an encrypted discussion with only your board of directors, you could make the subteam `acme.board`. Inside that team, you could make chat channels for whatever B.O.D.'s talk about, `#plausible-deniability` and `#efficient-breach`.

        Members of `acme` won't know there's a subteam called `acme.board` unless they're an admin of `acme` or invited into `acme.board`.

        More details:

        * to create a subteam you must be an admin of its parent
        * parent admins have certain admin controls of a subteam, even if they don't join the team. This prevents lost, orphaned subteams. If you're an admin of `acme` and make `acme.interns` without joining it, you won't see its chat or files; even though you have cryptographic keys to the group, the server will refuse to give you the encrypted data unless you explicitly sign yourself into the team, which lets all its members know.
        * subteam members don't need to be parent team members. So `acme.interns` don't need to be members of `acme`.
        * members of a team cannot tell the name or membership of subteams they're not a part of.
        * members of sibling teams cannot see each other's names or memberships. Lowly `nike.interns` can't see `nike.sweatshop`.
        * members of a subteam *can* tell membership of parent teams.
        * subteams can be renamed, unlike root team names.



        ### Asking to join a team

        You can request team access:

        ```bash
        > keybase team request-access acme
        ```

        As an outsider, you can't tell who's in a team, so Keybase will reach out to the admins and say you've requested access. They can then add you or ignore the request.

        ### Approving by social media handle

        Ultimately admins are signing into a team the username + key chain of a Keybase user. Continued team membership does not require maintaining specific social proofs, so if an admin cares about a social proof they should check it at the time they sign someone in.

        All that said, there's a protocol to approve by other proven identities:

        ```bash
        keybase team add-member --role writer --user acmeceo@twitter acme
        ```

        1. this signs an admin statement (to yourself and other admins) in the team sig chain, saying, "hey, if @acmeceo on twitter proves their account, sign whoever that user is into our team."

        2. an admin's client will obey the fellow admin's signed link and perform the action.

        To be clear, this user does not need to maintain the twitter account indefinitely; they are not kicked out of the team if Twitter goes down or they abandon the account.

        ### A taste of TOFU: quick team building by email

        The following is a common desire, so we've made it work:

        ```bash
        keybase team add-member --role writer --email wonderwoman@acme.com acme
        ```

        Here's what happens when you run this command:

        1. you sign an admin statement, saying you want wonderwoman@acme.com to join the team
        2. **the Keybase servers** get wonderwoman@acme.com to join and establish a username
        3. the next admin online gets pinged to automatically sign her onto the team, trusting Keybase checked the email.

        This is "Trust on First Use" (TOFU) because you're trusting Keybase isn't lying about the email proof...the same kind of TOFU you see when using Signal or WhatsApp to lookup a key by phone number.

        Once wonderwoman is on the team, her identity can't be swapped out. Also, as she adds more devices you won't have to go through TOFU again, unlike when people wipe/install their phones with some chat apps. (That really isn't TOFU, now, is it?)

        Keybase can't abuse this feature to insert extra people on your team. It only works if you start the process off by posting a signed statement that you want it to work, and the admin(s) on your team verify the signed statement, because that statement is checked in step 3. The invitation can be revoked, cryptographically, if you change your mind.

        Admin privileges cannot be granted with TOFU.

        ### Understanding roles

        We'll move this to a table soon. Here's a screenshot of a spreadsheet:

        <img src="/images/teams/roles.png" class="img img-responsive">

        In the above, an "implied admin" of a subteam is someone who is an admin of a parent team.

        ### Metadata

        Keybase servers do know team memberships: team names, users, and roles. Keybase servers *cannot* read the contents of chats or files or even know the names of chat channels or files, as that is end-to-end encrypted.  **At no point does Keybase have any private keys for any KBFS or chat data.**

        ### On the immutability of teams' sig chains

        Any change to a team is signed into a chain, referencing the hash of the last change to the team. This chain itself hangs off a Merkle tree, where it can be found, deterministically. If you'e a member of `acme` you can traverse the tree to the chain. This means you will see the exact same `acme` chain as any other acme user. [We even write the root of our merkle tree to the bitcoin blockchain](/docs/server_security/merkle_root_in_bitcoin_blockchain).

        This is so you can say or type: "Hey - we're in a team on Keybase called 'lollipops'. Join Keybase and request access." Or "Expect an invitation from the team dunkindonuts...that'll be me." We believe this kind of human discourse without fingerprints or codes is crucial. Just say no to hex strings or 60-digit numbers you're supposed to compare.

        Teams do not have a concept of being "reset" or recovered. Once a team is created, it can never be stolen by Keybase or given to someone else. Links can only be added to its signature chain by admins, and links can be added but never removed. Only revoked. This prevents the server from lying by omission.

        If all your admins lose all their keys, you will permanently lose your team! There's nothing Keybase can do to help, because Keybase can't mess with your team.

        ### Small odds of team screwup

        You're among the first testers of Keybase Teams, so there is a small chance we'll screw something up and you'll need to haul your data out and pick a new team name. We hope this doesn't happen. Call it 1% chance of this for July-Sept 2017.

        ### Limits

        During our testing:

        - teams are limited to 20 people
        - subteam creation is disabled for a little while
        - you can only make 100 total teams. Don't go squatting names for companies and projects that you know others will want, please.

        ### Anticipated Questions

        **Why are team names universal?**

        So people can talk about a team just using its name, without using fingerprints or security codes.

        **Why can't I rename top-level teams?**

        You can rename subteams, but top-level team renaming is not something we're ready to implement yet. It would require a level of redirection in our Merkle tree and, more important, extensive user experience considerations. So we may never implement it. If you dislike your team name, make a new team and invite everyone.

        **Can people outside my teams know what teams I'm in?**

        No. As mentioned in the metadata section above, the Keybase servers need to know, for a variety of user experience and notification reasons. But team sig chains are not published, unlike user sig chains, which are.

        **What happens if I "reset" my account**

        Account resetting on Keybase is where you throw away all your keys and start over, and redo your identity proofs. **This kicks you off all your teams.** You will need to be added again.

        It has to be this way, otherwise Keybase could kick you out of a team and put someone else in your place.

        **How do I test?**

        Just install Keybase and make a team with the command line.

        **How do I send feedback?**

        ```bash
        # if you have any issues in the desktop client
        > keybase log send
        ```

        In the phone app, you can go to **gear icon > feedback**.

        For general non-bug feedback, you can create an issue on [https://github.com/keybase/client](https://github.com/keybase/client)

        **How does this fit into Keybase's business model?**

        We think someday if teams take off, we'll charge for larger teams. Nothing we're offering for free now will flip to a pay model, so if you make a 20 person team now and start using it, you won't someday be faced with a credit card screen to get your files or messages.

        **Is this actually open source?**

        Yes, on all clients.

        [https://github.com/keybase/client](https://github.com/keybase/client)

        [Installation instructions here](/download)

        <center style="margin:40px 0"><img src="/images/teams/acme.png" class="img" width"500" height="251"></center>


      </md>


</div>
