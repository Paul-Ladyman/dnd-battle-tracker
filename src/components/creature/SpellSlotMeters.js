import React from 'react';
import maxSpellSlots from '../../domain/spellSlots';

function FilledSpellSlot() {
  return <div className="spell-slot-meter__filled" />;
}

function EmptySpellSlot() {
  return <div className="spell-slot-meter__empty" />;
}

function isFull(total, used, level) {
  if (total !== undefined) {
    return total === used;
  }

  return maxSpellSlots[level] === used;
}

export default function SpellSlotMeters({ totalSpellSlots, usedSpellSlots, id }) {
  const spellSlotMeters = Object.keys(maxSpellSlots).map((level) => {
    const total = totalSpellSlots?.[level];
    const used = usedSpellSlots?.[level];
    const max = total || used || 0;
    if (max === 0) return null;

    const now = used || 0;

    const usedMeter = new Array(now).fill(<FilledSpellSlot />);
    const remainingMeter = new Array(max - now).fill(<EmptySpellSlot />);

    const fullClass = isFull(total, used, level) ? 'spell-slot-meter--label__full' : '';
    const slotsId = `${id}-spell-slots-${level}`;
    return (
      <div key={level} className="spell-slot-meter--container">
        <div className={`spell-slot-meter--label ${fullClass}`} id={slotsId}>{`${level} Level`}</div>
        <div className="spell-slot-meter" role="meter" aria-valuemin="0" aria-valuemax={max} aria-valuenow={now} aria-labelledby={slotsId}>
          {usedMeter}
          {remainingMeter}
        </div>
      </div>
    );
  }).filter((_) => _);

  if (spellSlotMeters.length === 0) return null;

  return (
    <div className="avoid-break">
      <div className="creature-note-list--label">Spell Slots</div>
      {spellSlotMeters}
    </div>
  );
}
