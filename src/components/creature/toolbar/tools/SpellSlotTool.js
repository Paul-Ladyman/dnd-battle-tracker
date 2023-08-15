import React, { useState } from 'react';
import Input from '../../../form/Input';
import TabList from '../../../widgets/TabList';
import maxSpellSlots from '../../../../domain/spellSlots';

function SpellSlot({
  defaultValue,
  ariaLabel,
  label,
  inputId,
  max,
}) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Input
      integer
      min={0}
      max={max}
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
  maxValues,
}) {
  return (
    <div className="spell-slot-row">
      {
        row.map((level) => {
          const inputId = `${creatureId}-${id}-spell-slots-${level}`;
          const max = maxValues && maxValues[level];
          return (
            <SpellSlot
              key={inputId}
              defaultValue={defaultValue}
              ariaLabel={`${level} Level`}
              label={`${level} Lvl`}
              inputId={inputId}
              max={max}
            />
          );
        })
      }
    </div>
  );
}

function SpellSlotGrid({
  id,
  creatureId,
  defaultValue,
  maxValues,
}) {
  const row1 = ['1st', '2nd', '3rd'];
  const row2 = ['4th', '5th', '6th'];
  const row3 = ['7th', '8th', '9th'];
  return (
    <div className="spell-slot-grid">
      <SpellSlotRow
        row={row1}
        id={id}
        creatureId={creatureId}
        defaultValue={defaultValue}
        maxValues={maxValues}
      />
      <SpellSlotRow
        row={row2}
        id={id}
        creatureId={creatureId}
        defaultValue={defaultValue}
        maxValues={maxValues}
      />
      <SpellSlotRow
        row={row3}
        id={id}
        creatureId={creatureId}
        defaultValue={defaultValue}
        maxValues={maxValues}
      />
    </div>
  );
}

export default function SpellSlotTool({ creatureId, toolMenuId }) {
  const tabs = ['Used', 'Total'];
  const panels = [
    <SpellSlotGrid id="used" creatureId={creatureId} defaultValue={0} maxValues={maxSpellSlots} />,
    <SpellSlotGrid id="total" creatureId={creatureId} defaultValue="" maxValues={maxSpellSlots} />,
  ];
  const labelledBy = `${toolMenuId}-spell-slots`;
  const id = `${toolMenuId}-spell-slots-tabs`;
  return (
    <TabList labelledBy={labelledBy} tabs={tabs} panels={panels} id={id} customClasses="spell-slots-container" />
  );
}
