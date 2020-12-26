import React from 'react';
import CreatureNoteList from './CreatureNoteList';
import { conditionDescriptions } from '../model/conditions';
import ExternalLink from './ExternalLink';
import CreatureRemover from './CreatureRemover';

export default function ExpandedCreature({
  creature,
  active,
  round,
  secondsElapsed,
  removeCreature,
  removeNoteFromCreature,
  healthPoints,
  showHealth,
  playerSession,
}) {
  const {
    alive, initiative, id, conditions, notes,
  } = creature;
  const showInitiative = initiative !== undefined && initiative !== null;
  const showConditions = conditions.length > 0;
  const showNotes = notes.length > 0;
  const multiColumn = showConditions || showNotes;
  const columnClassName = multiColumn ? 'expanded-creature--columns__wide' : 'expanded-creature--columns__normal';

  return (
    <>
      <div className={`expanded-creature--columns ${columnClassName}`}>
        <div>
          {!alive
            && (
            <div className="expanded-creature--status">
              <em>
                <ExternalLink url={conditionDescriptions.Unconscious}>
                  Unconscious/dead
                </ExternalLink>
              </em>
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
        {showConditions
          && (
          <CreatureNoteList
            creatureId={id}
            label="Conditions"
            noteList={conditions}
            dismissHandler={(creatureId, note) => removeNoteFromCreature(creatureId, note, true)}
            round={round}
            secondsElapsed={secondsElapsed}
            playerSession={playerSession}
          />
          )}
        {showNotes
          && (
          <CreatureNoteList
            creatureId={id}
            label="Notes"
            noteList={notes}
            dismissHandler={(creatureId, note) => removeNoteFromCreature(creatureId, note, false)}
            round={round}
            secondsElapsed={secondsElapsed}
            playerSession={playerSession}
          />
          )}
      </div>
      <CreatureRemover
        playerSession={playerSession}
        active={active}
        creature={creature}
        removeCreature={removeCreature}
      />
      {active && <div style={{ height: '43px' }} />}
    </>
  );
}
