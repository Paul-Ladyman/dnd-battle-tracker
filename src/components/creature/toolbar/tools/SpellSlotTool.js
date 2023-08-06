import React from 'react';
import Input from '../../../form/Input';

function SpellSlotRow({
  row,
  id,
  creatureId,
  defaultValue,
}) {
  return (
    <div className="spell-slot-row">
      {
        row.map((level) => (
          <Input
            integer
            spinner
            value={defaultValue}
            ariaLabel={`${level} Level`}
            label={`${level} Lvl`}
            inputId={`${creatureId}-${id}-spell-slots-${level}`}
            customClasses="spell-slot"
          />
        ))
      }
    </div>
  );
}

export default function SpellSlotTool({
  id,
  creatureId,
  defaultValue,
}) {
  const row1 = ['1st', '2nd', '3rd'];
  const row2 = ['4th', '5th', '6th'];
  const row3 = ['7th', '8th', '9th'];
  return (
    <>
      <SpellSlotRow row={row1} id={id} creatureId={creatureId} defaultValue={defaultValue} />
      <SpellSlotRow row={row2} id={id} creatureId={creatureId} defaultValue={defaultValue} />
      <SpellSlotRow row={row3} id={id} creatureId={creatureId} defaultValue={defaultValue} />
    </>
  );
}
