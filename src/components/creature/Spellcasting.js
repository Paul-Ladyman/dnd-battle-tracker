import React from 'react';
import { maxSpellSlots, maxSpellsPerDay } from '../../domain/spellcasting';

function isFull(total, used, key) {
  if (total !== undefined) return total === used;

  const max = maxSpellSlots[key];
  if (max) return maxSpellSlots[key] === used;

  return maxSpellsPerDay === used;
}

function useWideFormat(meters) {
  return meters.findIndex(({ label }) => label.length >= 15) > -1;
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

function SpellMeter({
  total,
  used,
  spellKey,
  label,
  id,
}) {
  const max = total || used || 0;
  if (max === 0) return null;
  const now = used || 0;

  const fullClass = isFull(total, used, spellKey) ? 'spell-meter--label__full' : '';
  const meterId = `${id}-spellcasting-${spellKey}`;
  return (
    <div className="spell-meter--container">
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
  spells = {},
  id,
}) {
  const spellSlotMeters = Object.keys(maxSpellSlots).map((level) => {
    const total = totalSpellSlots?.[level];
    const used = usedSpellSlots?.[level];
    const label = `${level} Level`;
    if (!total && !used) return null;
    return {
      total,
      used,
      spellKey: level,
      label,
    };
  }).filter((_) => _);

  const spellMeters = Object.keys(spells).map((key) => {
    const spell = spells[key];
    const { total, used, label } = spell;
    if (!total && !used) return null;
    return {
      total,
      used,
      spellKey: key,
      label,
    };
  }).filter((_) => _);

  const meters = [
    ...spellSlotMeters,
    ...spellMeters,
  ];

  if (meters.length === 0) return null;

  const formatClass = useWideFormat(meters) ? 'spell-meters__wide' : 'spell-meters__slim';

  return (
    <div className={`avoid-break ${formatClass}`}>
      <div className="creature-note-list--label">Spellcasting</div>
      {meters.map(({
        total,
        used,
        spellKey,
        label,
      }) => (
        <SpellMeter
          total={total}
          used={used}
          spellKey={spellKey}
          label={label}
          id={id}
          key={spellKey}
        />
      ))}
    </div>
  );
}
