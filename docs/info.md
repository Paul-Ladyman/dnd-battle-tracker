# [D&D Battle Tracker](https://paul-ladyman.github.io/dnd-battle-tracker/)

This is an easy to use battle tracker application for D&D 5e.

## Use

The D&D Battle Tracker is designed to run as a single HTML page in the browser (but does not require an internet connection).

You can either [access the D&D Battle Tracker live](https://paul-ladyman.github.io/dnd-battle-tracker/) or download the latest release of the `dnd-battle-tracker.html` file below and open it in your favourite browser.

**Latest release (v1.9.0):** [dnd-battle-tracker.html](https://github.com/Paul-Ladyman/dnd-battle-tracker/releases/download/v1.9.0/dnd-battle-tracker.html)

## Motivation

As a new DM I found that I was frequently making mistakes during a battle, such as:

* Forgetting who's turn it was or skipping a creature's turn altogether.
* Forgetting what conditions creatures were under.
* Doing maths wrong when applying damage to creatures (!)

It was clear that some automation would be helpful. There's a number of browser-based battle trackers out there at the time of writing:

* [Improved Initiative](https://www.improved-initiative.com/)
* [Aide D&D](https://www.aidedd.org/dnd-tracker/index.php?l=1)
* [Orc Pub](https://www.orcpub2.com/)
* [Roll20](https://app.roll20.net/sessions/new)
* [D&D Beyond](https://www.dndbeyond.com/) (Currently in development)

Many of these systems are very feature rich and aim to provide tools beyond the battle tracker itself, which is great. However that does mean that they come with a learning curve and several are gated-off behind login screens.

This D&D Battle Tracker simply aims to automate the process of tracking a battle using a pen and paper. It attempts to do this in a way that is as straight-forward and easy to use as possible. As such it does not do things like automate dice roles, provide custom character creation tools, battle map creation tools or provide content from the Player's Hand Book. Instead it focuses on automating the smaller things that are prone to error and often distract a DM from the battle itself.

## Features

* Works entirely offline.
* Create a list of creatures who are involved in the battle by adding a name, initiative score and optionally health points for each one.
* Automatically order creatures by their initiative.
* Keep track of who's turn it is as the battle progresses as well as what the current round is and how long the battle has lasted.
* Keep track of creature conditions and any additional notes and how long they have been applied.
* Make it obvious when conditions or notes have been applied to help the DM not to forget to take them into account.
* Provide links to Roll20 compendium of condition descriptions.
* Manage the health points of enemy creatures or NPCs allowing HP to be added and removed whilst supporting adding PCs to the creature list without HP.
* Allowing creatures to be killed/made unconscious and making it obvious to the DM that this has happened.
* Creatures can be added to or removed from the list at any time, even after the battle has started.

## Development

### Checkout and install

     $ git clone git@github.com:Paul-Ladyman/dnd-battle-tracker.git
     $ cd dnd-battle-tracker
     $ npm install

### To run

     $ npm start

### To test

     $ npm test

## Release

- Update the version in package.json and in the ***Download*** section of this README.
- `npm run build` to build the project and package all the static resources into a single HTML file. This file will be made available under:
  - `docs/index.html` to provide the live Github Pages site.
  - `dist/dnd-battle-tracker.html` for people to download from Github to use offline.
- Push the results to the `master` branch.
- Create a release in Github and upload the `dist/dnd-battle-tracker.html` file.

## TODO

* Consider adding a log to keep track of all battle events