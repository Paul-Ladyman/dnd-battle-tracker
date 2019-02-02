import React from 'react';
import CreatureNoteList from './CreatureNoteList';

function ExpandedCreature({
  creature,
  active,
  round,
  secondsElapsed,
  removeCreature,
  removeNoteFromCreature
}) {
  const {alive, name, maxHealthPoints, healthPoints, initiative, id, conditions, notes} = creature;
  const displayName = alive ? name : `${name} (dead/unconscious)`;
  const showHealth = healthPoints !== undefined;
  const showConditions = conditions.length > 0;
  const showNotes = notes.length > 0;

  return (
    <div className="expanded-creature centered__columns">
      <div className="expanded-creature--name">{displayName}</div>
      {showHealth && <div className="expanded-creature--stat">Max Health: {maxHealthPoints}</div>}
      {showHealth && <div className="expanded-creature--stat">Current Health: {healthPoints}</div>}
      <div className="expanded-creature--stat">Initiative: {initiative}</div>
      {showConditions && <CreatureNoteList
        creatureId={id}
        label="Conditions"
        noteList={conditions}
        dismissHandler={(creatureId, text) => removeNoteFromCreature(creatureId, text, true)}
        round={round}
        secondsElapsed={secondsElapsed}
      />}
      {showNotes && <CreatureNoteList
        creatureId={id}
        label="Notes"
        noteList={notes}
        dismissHandler={(creatureId, text) => removeNoteFromCreature(creatureId, text, false)}
        round={round}
        secondsElapsed={secondsElapsed}
      />}
      {!active && <button onClick={() => removeCreature(id)}>remove</button>}
    </div>
  );
}

export default ExpandedCreature;