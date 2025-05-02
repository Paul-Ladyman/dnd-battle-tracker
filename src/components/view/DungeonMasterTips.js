/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
import React from 'react';
import ExternalLink from '../page/ExternalLink';
import CreatureMenuIcon from '../icons/CreatureMenuIcon';
import ShareIcon from '../icons/ShareIcon';
import OptionsMenuIcon from '../icons/OptionsMenuIcon';
import ShareHitPointsIcon from '../icons/ShareHitPointsIcon';
import RulesSearchMenuIcon from '../icons/RulesSearchMenuIcon';
import StartBattleIcon from '../icons/StartBattleIcon';
import NextTurnIcon from '../icons/PageNavigationIcon';
import StatBlockIcon from '../icons/StatBlockIcon';
import MonsterSearchIcon from '../icons/MonsterSearchIcon';
import SaveLoadIcon from '../icons/SaveLoadIcon';
import LockedIcon from '../icons/LockedIcon';
import RemoveIcon from '../icons/RemoveIcon';
import RollGroupIcon from '../icons/RollGroupIcon';
import RollEachIcon from '../icons/RollEachIcon';
import InitiativeIcon from '../icons/InitiativeIcon';

export default function DungeonMasterTips() {
  return (
    <main className="dmtips">
      <h2 className="dmtips--title">Dungeon Master Tips</h2>
      <p className="dmtips--intro">Here&apos;s some useful tips to help DMs get the most out of the Battle Tracker. The icons described below refer to the desktop version of the application.</p>
      <p className="dmtips--happydming">Happy DMing!</p>
      <h3 className="dmtips--title">Adding Creatures</h3>
      <p>The Battle Tracker is intended to be as quick and simple to use as possible to make it easy to deal with even an unplanned combat encounter.</p>
      <p className="dmtips--tip">The only thing required to add a creature to the Battle is its name. The only additional thing required to start combat is an intitiave roll.</p>
      <p className="dmtips--tip">You can add some or all of the creatures that will be involved in combat before the session starts. You can even pre-roll the initiative and health for NPCs if you&apos;d like. Creatures can always be added after starting combat too, so no worries if you&apos;ve forgetten something.</p>
      <p className="dmtips--tip">You can use dice notation (e.g. <code>1d20+2</code>) for the Initiative and HP of creatures added to a battle, or use the dice values available for creatures from the <ExternalLink url="https://www.dndbeyond.com/resources/1781-systems-reference-document-srd">SRD</ExternalLink>! You can choose to roll once for the whole group [<RollGroupIcon />] or roll dice individually for each creature in a group [<RollEachIcon />] to add some variety to a combat encounter.</p>
      <p className="dmtips--tip">If multiple creatures roll the same initiative you can optionally define their initiative order by using the Tie Breaker tool [<InitiativeIcon />]. Just add the creature with its original initiative roll, then set the tie breaker (higher tie breaker values go first).</p>
      <h3 className="dmtips--title">Sharing a Battle</h3>
      <p>Sharing a Battle allows your players to see the initiative order and the status of each creature. Having the whole group keep an eye on things can help to keep combat running smoothly.</p>
      <p className="dmtips--tip">You can enable sharing from the Battle Menu [<OptionsMenuIcon /> then <ShareIcon />] and send the link to your group, who will get a non-editable version of the Battle with all the DM-only information hidden.</p>
      <p className="dmtips--tip">Players are provided with a vague description of a creature&apos;s hit points, but you can disable sharing hit points altogether if you&apos;d like from the Creature Menu [<CreatureMenuIcon /> then <ShareHitPointsIcon enabled />].</p>
      <p className="dmtips--tip">If you&apos;d like to prepare a creature in advance, but reveal it later in combat as a surprise for your players, you can disable sharing for that creature until you are ready by going to the Creature Menu [<CreatureMenuIcon /> then <ShareIcon enabled />].</p>
      <h3 className="dmtips--title">Running a Combat Encounter</h3>
      <p>The Battle Tracker will have your back throughout combat, helping you remember all the little details so you can focus on giving your players a great time!</p>
      <p className="dmtips--tip">Once you&apos;ve added some creatures and initiative rolls, don&apos;t forget to start the Battle [<StartBattleIcon />] and use the Next Turn [<NextTurnIcon />] button to let the Battle Tracker guide you through the turns and rounds of combat.</p>
      <p>Beyond the basic features, here&apos;s some things to keep in mind.</p>
      <p className="dmtips--tip">
        If you need a quick rule check you can access a search bar from the Battle Menu [<OptionsMenuIcon /> then <RulesSearchMenuIcon />]. This searches the rules using <ExternalLink url="https://www.dndbeyond.com/">D&D Beyond</ExternalLink>. Your players also have access to this feature if you have shared the Battle with them. Each creature added from the <ExternalLink url="https://www.dndbeyond.com/resources/1781-systems-reference-document-srd">SRD</ExternalLink> provides a link to its official stat block [<CreatureMenuIcon /> then <StatBlockIcon />] (though not to your players!). Otherwise creatures provide a button to search for that creature in D&D Beyond [<CreatureMenuIcon /> then <MonsterSearchIcon />].
      </p>
      <p className="dmtips--tip">The number of rounds and amount of time that has elapsed is displayed both for the combat encounter itself and for each note and condition added to a creature. This can be used to determine when an effect or condition should come to an end.</p>
      <h3 className="dmtips--title">Ending a Combat Encounter</h3>
      <p>Even at the end of combat you can get a head start on the next encounter!</p>
      <p className="dmtips--tip">If multiple combat encounters are likely in the session, lock each of the creatures in the players&apos; party [<CreatureMenuIcon /> then <LockedIcon locked={false} />]. The Battle Tracker can be reset from the Battle Menu [<OptionsMenuIcon /> then <RemoveIcon />] at the end of the encounter but locked creatures will be persisted. You can then reuse the Battle for the next encounter and the party will be ready to go.</p>
      <p>Saving and loading:</p>
      <p className="dmtips--tip">The Battle Tracker will autosave the current Battle every time it is updated. So if your computer decides to crash right as things are getting interesting, just reopen the Battle Tracker and jump right back into combat!</p>
      <p className="dmtips--tip">If you need to save multiple different combat encounters, or if you need to continue a combat encounter on a different browser/computer, the current Battle can be downloaded from the Battle Menu [<OptionsMenuIcon /> then <SaveLoadIcon /> ] and uploaded [<SaveLoadIcon load />] at the start of the next session to pick up where you left off.</p>
      <h3 className="dmtips--title">Playing Offline</h3>
      <p>The Battle Tracker is designed to work even without an internet connection so you can play anywhere!</p>
      <p className="dmtips--tip">The next time you open D&D Battle Tracker in this browser it will be available for offline use. If your browser supports it you can also install the Battle Tracker to your device as a <ExternalLink url="https://support.google.com/chrome/answer/9658361?hl=en-GB&co=GENIE.Platform%3DDesktop">PWA</ExternalLink> to get the best experience.</p>
    </main>
  );
}
