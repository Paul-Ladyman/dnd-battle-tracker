import React from 'react';
import CreatureNoteList from './CreatureNoteList';
import CreatureStatus from './CreatureStatus';

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
    initiative, id, conditions, notes, shared, armorClass,
  } = creature;
  const showInitiative = initiative !== undefined && initiative !== null;
  const showAc = armorClass !== null && armorClass !== undefined;

  return (
    <div className="expanded-creature">
      <div className="avoid-break">
        <CreatureStatus creature={creature} shared={shared} />
        <div className="expanded-creature--separator" />
        {showHealth && healthPoints}
        {showAc
          && (
            <div className="expanded-creature--stat">
              <b>Armor Class</b>
              {' '}
              {armorClass}
            </div>
          )}
        {showInitiative
          && (
          <div className="expanded-creature--stat">
            <b>Initiative</b>
            {' '}
            {initiative}
          </div>
          )}
        { (showHealth || showAc || showInitiative) && <div className="expanded-creature--separator" /> }
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
    </div>
  );
}
