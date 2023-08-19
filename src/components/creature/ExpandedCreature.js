import React from 'react';
import CreatureNoteList from './CreatureNoteList';
import CreatureStatus from './CreatureStatus';
import maxSpellSlots from '../../domain/spellSlots';

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
    initiative, id, conditions, notes, shared, armorClass, totalSpellSlots, usedSpellSlots,
  } = creature;
  const showInitiative = initiative !== undefined && initiative !== null;
  const showAc = armorClass !== null && armorClass !== undefined;

  const spellSlotMeters = Object.keys(maxSpellSlots).map((level) => {
    const total = totalSpellSlots?.[level];
    const used = usedSpellSlots?.[level];
    const max = total || used || 0;
    if (max === 0) return null;

    const now = used || 0;

    const usedMeter = new Array(now).fill('X');
    const remainingMeter = new Array(max - now).fill('0');

    const slotsId = `${id}-spell-slots-${level}`;
    return (
      <div key={level} className="spell-slot-meter-container">
        <div id={slotsId}>{`${level} Level`}</div>
        <div role="meter" aria-valuemin="0" aria-valuemax={max} aria-valuenow={now} aria-labelledby={slotsId}>
          {usedMeter}
          {remainingMeter}
        </div>
      </div>
    );
  }).filter((_) => _);

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
      {spellSlotMeters.length > 0 && (
        <div className="avoid-break">
          <div className="creature-note-list--label">Spell Casting</div>
          {spellSlotMeters}
        </div>
      )}
    </div>
  );
}
