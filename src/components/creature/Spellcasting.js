import React from 'react';
import { maxSpellSlots, maxSpellsPerDay } from '../../domain/spellcasting';

function isFull(total, used, key) {
  if (total !== undefined) return total === used;

  const max = maxSpellSlots[key];
  if (max) return maxSpellSlots[key] === used;

  return maxSpellsPerDay === used;
}

function meter(max, now) {
  return Array.from({ length: maxSpellsPerDay }).reduce((slots, _, i) => {
    const key = slots.length;
    const slotClass = i < max ? 'spell-meter__slot' : '';
    const filledClass = i < now ? 'spell-meter__filled' : '';
    const slot = <div className={`${slotClass} ${filledClass}`} key={key} />;
    return [...slots, slot];
  }, []);
}

function getSpellMeter(total, used, spellKey, label, id) {
  const max = total || used || 0;
  if (max === 0) return null;
  const now = used || 0;

  const fullClass = isFull(total, used, spellKey) ? 'spell-meter--label__full' : '';
  const meterId = `${id}-spellcasting-${spellKey}`;
  return (
    <div key={spellKey} className="spell-meter--container">
      <div className={`spell-meter--label ${fullClass}`} id={meterId}>{label}</div>
      <div className="spell-meter" role="meter" aria-valuemin="0" aria-valuemax={max} aria-valuenow={now} aria-labelledby={meterId}>
        {meter(max, now)}
      </div>
    </div>
  );
}

export default function Spellcasting({
  totalSpellSlots,
  usedSpellSlots,
  spells,
  id,
}) {
  const spellSlotMeters = Object.keys(maxSpellSlots).map((level) => {
    const total = totalSpellSlots?.[level];
    const used = usedSpellSlots?.[level];
    const label = `${level} Level`;
    return getSpellMeter(total, used, level, label, id);
  }).filter((_) => _);

  const spellMeters = Object.keys(spells).map((key) => {
    const spell = spells[key];
    const { total, used, label } = spell;
    return getSpellMeter(total, used, key, label, id);
  }).filter((_) => _);

  if (spellSlotMeters.length === 0 && spellMeters.length === 0) return null;

  return (
    <div className="avoid-break">
      <div className="creature-note-list--label">Spellcasting</div>
      {spellSlotMeters}
      {spellMeters}
    </div>
  );
}
