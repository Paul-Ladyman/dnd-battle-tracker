# [D&D Battle Tracker](http://dndbattletracker.com/)

D&D Battle Tracker is a combat tracker tool for Dungeons & Dragons 5th Edition (D&D 5e). Track the initiative and status of all creatures involved in combat with this D&D combat tracker!

## Use

The D&D Battle Tracker is designed to run as a single HTML page in the browser (but does not require an internet connection).

You can either [access the D&D Battle Tracker live](http://dndbattletracker.com/) or download a specific release of the `dnd-battle-tracker.html` file below and open it in your favourite browser.

**Latest release (v5.9.3):** [dnd-battle-tracker.html](https://github.com/Paul-Ladyman/dnd-battle-tracker/releases/download/v5.9.3/dnd-battle-tracker.html)
[List of previous releases](https://github.com/Paul-Ladyman/dnd-battle-tracker/releases)

## Motivation

As a new DM I found that I was frequently making mistakes during combat, such as:

* Forgetting who's turn it was or skipping a creature's turn altogether.
* Forgetting what conditions creatures were under.
* Doing maths wrong when applying damage to creatures (!)

It was clear that some automation would be helpful. There's a number of browser-based combat trackers out there at the time of writing:

* [D&D Beyond](https://www.dndbeyond.com/combat-tracker)
* [Aide D&D](https://www.aidedd.org/dnd-tracker/index.php?l=1)
* [DHMStark](http://dhmstark.co.uk/rpgs/encounter-tracker/)
* [Donjon](https://donjon.bin.sh/5e/initiative/)
* [Harmless Key](https://harmlesskey.com/)
* [Improved Initiative](https://www.improved-initiative.com/)
* [Kassoon](https://www.kassoon.com/dnd/combat-tracker/)
* [Orc Pub](https://www.orcpub2.com/)
* [Roll20](https://app.roll20.net/sessions/new)
* [HeroMuster](https://encounters.heromuster.com/)

Many of these systems are very feature rich and aim to provide tools beyond the combat tracker itself, which is great. However that does mean that they come with a learning curve and several are gated-off behind login screens.

This D&D Battle Tracker simply aims to automate the process of tracking combat using a pen and paper. It attempts to do this in a way that is as straight-forward and easy to use as possible. As such it does not do things like automate dice roles, provide custom character creation tools, battle map creation tools or provide content from the Player's Hand Book. Instead it focuses on automating the smaller things that are prone to error and often distract a DM from the combat itself.

## Features

* Core DM features work entirely offline.
* Create a list of creatures who are involved in combat by adding a name, initiative score and health points for each one.
* Track creature status pre- and post-battle so active conditions carry into battle and persist when its over.
* Automatically order creatures by their initiative.
* Keep track of who's turn it is as combat progresses as well as what the current round is and how long combat has lasted.
* Keep track of creature conditions and any additional notes and how long they have been applied.
* Make it obvious when conditions or notes have been applied to help the DM not to forget to take them into account.
* Provide links to D&D Beyond's list of condition descriptions and monsters.
* Manage the health points of enemy creatures or NPCs allowing HP to be added and removed whilst supporting adding PCs to the creature list without HP.
* Allowing creatures to be killed/made unconscious and making it obvious to the DM that this has happened.
* Creatures can be added to or removed from the list at any time, even after combat has started.
* Save and load battles in case they continue into another session.
* Share your battle with your players so they can see the initiative order and follow along. Requires internet access.

## Credits

* All icons taken from [game-icons.net](https://game-icons.net/) under the terms of the [Creative Commons 3.0 BY license](https://creativecommons.org/licenses/by/3.0/). See below for individual credits.
* Fonts provided by [Google Fonts](https://fonts.google.com/) under the terms of the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0). See below for individual credits.
* [Critical Role](https://www.youtube.com/channel/UCpXBGqwsBkpvcYjsJBQ7LEQ) for the inspiration.
* This application is not affiliated with, endorsed, sponsored, or specifically approved by Wizards of the Coast LLC.

### Icons

* [Play button](https://game-icons.net/1x1/guard13007/play-button.html) icon by [Guard13007](https://guard13007.com/)
* [Health normal](https://game-icons.net/1x1/sbed/health-normal.html) icon by [sbed](https://opengameart.org/content/95-game-icons)
* [Hearts](https://game-icons.net/1x1/skoll/hearts.html) icon by Skoll
* Icons by [Delapouite](https://delapouite.com/):
  * [Hamburger menu](https://game-icons.net/1x1/delapouite/hamburger-menu.html)
  * [Save arrow](https://game-icons.net/1x1/delapouite/save-arrow.html)
  * [Share](https://game-icons.net/1x1/delapouite/share.html)
  * [Broom](https://game-icons.net/1x1/delapouite/broom.html)
  * [Padlock open](https://game-icons.net/1x1/delapouite/padlock-open.html)
  * [Contract](https://game-icons.net/1x1/delapouite/contract.html)
  * [Expand](https://game-icons.net/1x1/delapouite/expand.html)
  * [Trash can](https://game-icons.net/1x1/delapouite/trash-can.html)
  * [Pencil](https://game-icons.net/1x1/delapouite/pencil.html)
  * [Player time](https://game-icons.net/1x1/delapouite/player-time.html)
  * [Next button](https://game-icons.net/1x1/delapouite/next-button.html)
  * [Previous button](https://game-icons.net/1x1/delapouite/previous-button.html)
* Icons by [Lorc](http://lorcblog.blogspot.com/):
  * [Magnifying glass](https://game-icons.net/1x1/lorc/magnifying-glass.html)
  * [Crossed swords](https://game-icons.net/1x1/lorc/crossed-swords.html)
  * [Padlock](https://game-icons.net/1x1/lorc/padlock.html)
  * [Skull crossed bones](https://game-icons.net/1x1/lorc/skull-crossed-bones.html)
  * [Charm](https://game-icons.net/1x1/lorc/charm.html)

### Fonts

* [Open Sans](https://fonts.google.com/specimen/Open+Sans) font by Steve Matteson
* [IM Fell Great Primer SC](https://fonts.google.com/specimen/IM+Fell+Great+Primer+SC) font by Igino Marini

## Development

### Checkout and install

     $ git clone git@github.com:Paul-Ladyman/dnd-battle-tracker.git
     $ cd dnd-battle-tracker
     $ npm install

### To run

     $ npm start

### To test

     $ npm test

## Architecture

![D&D Battle Tracker architecture](architecture.png)

## Deployment Pipeline

- Following a Continuous Integration workflow, all commits to `master` will trigger the execution of automated tests and a build of the project
- Commits to `master` that successfully pass the CI step will result in the build artefact being deployed to the [staging environment](https://github.com/Paul-Ladyman/dnd-battle-tracker/deployments/activity_log?environment=staging)
- Commits to `master` that include a change in the package version and have successfully passed the CI and stage deploy steps will be deployed to the [production environment](https://github.com/Paul-Ladyman/dnd-battle-tracker/deployments/activity_log?environment=production)
- In this way a Continuous Delivery workflow can be followed by committing a change that includes a version change. If a manual testing step is called for, the version can be left as it is and the change tested on the stage environment. The version can then be bumped to promote the change to production
- Each version change should also be refelcted in the ***Latest release*** section of this README and in a Github release where the build artefact `dnd-battle-tracker.html` is uploaded. This ensures the current version of the project can be easily downloaded for use offline and all previous versions are

### Dependabot

- The projects dependencies are automatically kept up to date using Dependabot, which creates pull requests for each update
- Commits to pull requests also trigger the CI step of the pipeline and this step must execute successfully before the PR can be merged