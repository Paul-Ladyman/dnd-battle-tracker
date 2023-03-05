import React from 'react';
import CreatureNoteList from './CreatureNoteList';
import CreatureStatus from './CreatureStatus';
import Separator from './Separator';

export default function ExpandedCreature({
  creature,
  round,
  secondsElapsed,
  removeNoteFromCreature,
  healthPoints,
  showHealth,
  playerSession,
}) {
  const {
    initiative, id, conditions, notes, shared,
  } = creature;
  const showInitiative = initiative !== undefined && initiative !== null;

  return (
    <>
      <div>
        <CreatureStatus creature={creature} shared={shared} />
        <Separator />
        {showHealth && healthPoints}
        {showInitiative
          && (
          <div className="expanded-creature--stat">
            <b>Initiative</b>
            {' '}
            {initiative}
          </div>
          )}
        { (showHealth || showInitiative) && <Separator /> }
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
