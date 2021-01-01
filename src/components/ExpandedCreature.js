import React from 'react';
import CreatureNoteList from './CreatureNoteList';
import { isCreatureStable } from '../state/CreatureManager';

export default function ExpandedCreature({
  creature,
  active,
  round,
  secondsElapsed,
  removeNoteFromCreature,
  healthPoints,
  showHealth,
  playerSession,
}) {
  const {
    alive, initiative, id, conditions, notes,
  } = creature;
  const showInitiative = initiative !== undefined && initiative !== null;

  return (
    <>
      <div>
        {!alive && (
          <div className="expanded-creature--status">
            <em>Dying/dead</em>
          </div>
        )}
        {isCreatureStable(creature) && (
          <div className="expanded-creature--status">
            <em>Stable</em>
          </div>
        )}
        <div className="expanded-creature--separator" />
        {showHealth && healthPoints}
        {showInitiative
          && (
          <div className="expanded-creature--stat">
            <b>Initiative</b>
            {' '}
            {initiative}
          </div>
          )}
        { (showHealth || showInitiative) && <div className="expanded-creature--separator" /> }
      </div>
      <CreatureNoteList
        creatureId={id}
        label="Conditions"
        noteList={conditions}
        dismissHandler={(creatureId, note) => removeNoteFromCreature(creatureId, note, true)}
        round={round}
        secondsElapsed={secondsElapsed}
        playerSession={playerSession}
        isConditionList
      />
      <CreatureNoteList
        creatureId={id}
        label="Notes"
        noteList={notes}
        dismissHandler={(creatureId, note) => removeNoteFromCreature(creatureId, note, false)}
        round={round}
        secondsElapsed={secondsElapsed}
        playerSession={playerSession}
      />
      {active && <div style={{ height: '43px' }} />}
    </>
  );
}
