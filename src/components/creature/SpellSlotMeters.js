import React from 'react';
import maxSpellSlots from '../../domain/spellSlots';

function isFull(total, used, level) {
  if (total !== undefined) {
    return total === used;
  }

  return maxSpellSlots[level] === used;
}

function meter(max, now) {
  return Array.from({ length: max }).reduce((slots, _, i) => {
    const key = slots.length;
    const className = i < now ? 'spell-slot-meter__filled' : 'spell-slot-meter__empty';
    const slot = <div className={className} key={key} />;
    return [...slots, slot];
  }, []);
}

export default function SpellSlotMeters({ totalSpellSlots, usedSpellSlots, id }) {
  const spellSlotMeters = Object.keys(maxSpellSlots).map((level) => {
    const total = totalSpellSlots?.[level];
    const used = usedSpellSlots?.[level];
    const max = total || used || 0;
    if (max === 0) return null;
    const now = used || 0;

    const fullClass = isFull(total, used, level) ? 'spell-slot-meter--label__full' : '';
    const slotsId = `${id}-spell-slots-${level}`;
    return (
      <div key={level} className="spell-slot-meter--container">
        <div className={`spell-slot-meter--label ${fullClass}`} id={slotsId}>{`${level} Level`}</div>
        <div className="spell-slot-meter" role="meter" aria-valuemin="0" aria-valuemax={max} aria-valuenow={now} aria-labelledby={slotsId}>
          {meter(max, now)}
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
