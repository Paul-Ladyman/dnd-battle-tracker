import React, { useState } from 'react';
import Input from '../../../form/Input';

function SpellSlot({
  defaultValue,
  ariaLabel,
  label,
  inputId,
}) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Input
      integer
      spinner
      value={value}
      ariaLabel={ariaLabel}
      label={label}
      inputId={inputId}
      customClasses="spell-slot"
      handleChange={handleChange}
    />
  );
}

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
          <SpellSlot
            defaultValue={defaultValue}
            ariaLabel={`${level} Level`}
            label={`${level} Lvl`}
            inputId={`${creatureId}-${id}-spell-slots-${level}`}
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
