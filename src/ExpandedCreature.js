import React from 'react';
import CreatureNoteList from './CreatureNoteList';
import HealthPoints from './HealthPoints';
import { conditionDescriptions } from './conditions';
import ExternalLink from './ExternalLink';

function ExpandedCreature({
  creature,
  active,
  round,
  secondsElapsed,
  removeCreature,
  removeNoteFromCreature
}) {
  const {alive, name, maxHealthPoints, healthPoints, initiative, id, conditions, notes} = creature;
  const displayName = alive ?
    name : 
    <React.Fragment>
      {name} (<ExternalLink url={conditionDescriptions.unconscious} text="unconscious/dead"/>)
    </React.Fragment>;
  const showHealth = healthPoints !== undefined;
  const showConditions = conditions.length > 0;
  const showNotes = notes.length > 0;

  return (
    <div className="expanded-creature centered__columns">
      <div className="expanded-creature--name">{displayName}</div>
      <div className="expanded-creature--separator" />
      {showHealth && <HealthPoints
        hp={healthPoints}
        maxHp={maxHealthPoints}
        className="expanded-creature--stat"
      />}
      <div className="expanded-creature--stat">
        <b>Initiative</b> {initiative}
      </div>
      <div className="expanded-creature--separator" />
      {showConditions && 
        <React.Fragment>
          <CreatureNoteList
            creatureId={id}
            label="Conditions"
            noteList={conditions}
            dismissHandler={(creatureId, note) => removeNoteFromCreature(creatureId, note, true)}
            round={round}
            secondsElapsed={secondsElapsed}
            className="expanded-creature--stat"
          />
          {!showNotes && <div className="expanded-creature--separator" /> }
        </React.Fragment>
      }
      {showNotes && 
        <React.Fragment>
          <CreatureNoteList
            creatureId={id}
            label="Notes"
            noteList={notes}
            dismissHandler={(creatureId, note) => removeNoteFromCreature(creatureId, note, false)}
            round={round}
            secondsElapsed={secondsElapsed}
            className="expanded-creature--stat"
          />
          <div className="expanded-creature--separator" />
        </React.Fragment>
      }
      {!active &&
        <button className="expanded-creature--button" onClick={() => removeCreature(id)}>Remove</button>
      }
    </div>
  );
}

export default ExpandedCreature;