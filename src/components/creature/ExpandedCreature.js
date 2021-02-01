import React from 'react';
import CreatureNoteList from './CreatureNoteList';
import CreatureStatus from './CreatureStatus';

export default function ExpandedCreature({
  creature,
  shared,
  round,
  secondsElapsed,
  removeNoteFromCreature,
  healthPoints,
  showHealth,
  playerSession,
}) {
  const {
    initiative, id, conditions, notes,
  } = creature;
  const showInitiative = initiative !== undefined && initiative !== null;

  return (
    <>
      <div>
        <CreatureStatus creature={creature} shared={shared} />
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
    </>
  );
}
