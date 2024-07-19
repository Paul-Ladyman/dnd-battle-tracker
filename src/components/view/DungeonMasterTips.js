/* eslint-disable max-len */
import React from 'react';
import ExternalLink from '../page/ExternalLink';

export default function DungeonMasterTips() {
  return (
    <main className="main">
      <h2>Dungeon Master Tips</h2>
      <p>Here&apos;s some useful tips to help DMs get the most out of the Battle Tracker.</p>
      <ul>
        <li>The Battle Tracker is intended to be as quick and simple to use as possible to make it easy to deal with even an unplanned combat encounter. The only thing required to add a creature to the Battle is its name. The only additional thing required to start combat is an intitiave roll</li>
        <li>Creatures can be added to or removed from the Battle at any time, even after combat has started</li>
        <li>You can prepare for combat ahead of a session by adding all the creatures that will be involved. You can even pre-roll the initiative and health for NPCs if you&apos;d like</li>
        <li>You can share the Battle with your players from the Options Menu so the whole group can see the initiative order and the status of each creature. This can help to keep things running smoothly. Players are only provided with a vague description of a creature&apos;s hit points, but you can disable sharing hit points altogether if you&apos;d like</li>
        <li>If you&apos;d like to prepare a creature in advance, but reveal it later in combat as a surprise for your players, you can disable sharing for that creature until you are ready</li>
        <li>If you need to end the session before combat has finished, the current Battle can be downloaded from the Options Menu and uploaded at the start of the next session to pick up where you left off</li>
        <li>Creature notes can be editted, which is useful for tracking expendable things like spell slots</li>
        <li>If multiple combat encounters are likely in the session, lock each of the creatures in the players&apos; party. The Battle Tracker can be reset from the Options Menu at the end of the encounter but locked creatures will be persisted. You can then reuse the Battle for the next encounter and the party will be ready to go</li>
        <li>
          If you need a quick rule check you can access a search bar from the Options Menu. This searches the rules using
          {' '}
          <ExternalLink
            url="https://www.dndbeyond.com/"
          >
            D&D Beyond
          </ExternalLink>
          . Your players also have access to this feature if you have shared the Battle with them. Each creature provides a button to search for that creature in D&D Beyond (though not to your players!) - useful if you don&apos;t have the Monster Manual to hand. The same button is available when adding a new creature if you need to quickly look up its initiative or hit points
        </li>
        <li>The number of rounds and amount of time that has elapsed is displayed both for the combat encounter itself and for each note and condition added to a creature. This can be used to determine when an effect or condition should come to an end</li>
      </ul>
    </main>
  );
}
