import React from 'react';
import CreatureNoteList from './CreatureNoteList';
import CreatureStatus from './CreatureStatus';
import SpellSlotMeters from './SpellSlotMeters';

export default function ExpandedCreature({
  creature,
  round,
  secondsElapsed,
  healthPoints,
  showHealth,
}) {
  const {
    initiative, id, conditions, notes, shared, armorClass, totalSpellSlots, usedSpellSlots,
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
        round={round}
        secondsElapsed={secondsElapsed}
        isConditionList
      />
      <CreatureNoteList
        creatureId={id}
        label="Notes"
        noteList={notes}
        round={round}
        secondsElapsed={secondsElapsed}
      />
      <SpellSlotMeters totalSpellSlots={totalSpellSlots} usedSpellSlots={usedSpellSlots} id={id} />
    </div>
  );
}
