import React from 'react';
import CreatureNoteList from './CreatureNoteList';
import HealthPoints from './HealthPoints';

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
      {showHealth && <HealthPoints
        hp={healthPoints}
        maxHp={maxHealthPoints}
        className="expanded-creature--stat"
      />}
      <div className="expanded-creature--stat">
        <b>Initiative:</b> {initiative}
      </div>
      {showConditions && <CreatureNoteList
        creatureId={id}
        label="Conditions"
        noteList={conditions}
        dismissHandler={(creatureId, note) => removeNoteFromCreature(creatureId, note, true)}
        round={round}
        secondsElapsed={secondsElapsed}
        className="expanded-creature--stat"
      />}
      {showNotes && <CreatureNoteList
        creatureId={id}
        label="Notes"
        noteList={notes}
        dismissHandler={(creatureId, note) => removeNoteFromCreature(creatureId, note, false)}
        round={round}
        secondsElapsed={secondsElapsed}
        className="expanded-creature--stat"
      />}
      {!active && <button className="expanded-creature--button" onClick={() => removeCreature(id)}>Remove</button>}
    </div>
  );
}

export default ExpandedCreature;