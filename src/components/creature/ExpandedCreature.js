import React from 'react';
import CreatureNoteList from './CreatureNoteList';
import CreatureStatus from './CreatureStatus';
import Spellcasting from './Spellcasting';
import RollResult from '../dice/RollResult';

export default function ExpandedCreature({
  creature,
  round,
  secondsElapsed,
  healthPoints,
  showHealth,
}) {
  const {
    initiative,
    initiativeRoll,
    initiativeTieBreaker,
    id,
    conditions,
    notes,
    shared,
    armorClass,
    totalSpellSlots,
    usedSpellSlots,
    spells,
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
            <RollResult roll={initiativeRoll} />
            {initiativeTieBreaker
              && (
              <>
                {' '}
                (Tie
                {' '}
                {initiativeTieBreaker}
                )
              </>
              )}
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
      <Spellcasting
        totalSpellSlots={totalSpellSlots}
        usedSpellSlots={usedSpellSlots}
        spells={spells}
        id={id}
      />
    </div>
  );
}
