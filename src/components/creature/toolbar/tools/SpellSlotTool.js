/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import Input from '../../../form/Input';
import TabList from '../../../widgets/TabList';
import maxSpellSlots from '../../../../domain/spellSlots';

function SpellSlot({
  level,
  id,
  creatureId,
  defaultValue,
  values,
  defaultMaxValues,
  maxValues,
  addSpellSlots,
}) {
  const initialValue = values?.[level] || defaultValue;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const inputId = `${creatureId}-${id}-spell-slots-${level}`;
  const max = maxValues?.[level] || defaultMaxValues[level];

  const handleChange = (event) => {
    const { value: newValue } = event.target;
    setValue(newValue);
    addSpellSlots(creatureId, level, newValue);
  };

  return (
    <Input
      integer
      min={0}
      max={max}
      spinner
      value={value}
      ariaLabel={`${level} Level`}
      label={`${level} Lvl`}
      inputId={inputId}
      customClasses="spell-slot"
      handleChange={handleChange}
      disabled={max === '0'}
    />
  );
}

function SpellSlotRow({
  row,
  ...props
}) {
  return (
    <div className="spell-slot-row">
      {
        row.map((level) => (
          <SpellSlot
            key={level}
            level={level}
            {...props}
          />
        ))
      }
    </div>
  );
}

function SpellSlotGrid(props) {
  const row1 = ['1st', '2nd', '3rd'];
  const row2 = ['4th', '5th', '6th'];
  const row3 = ['7th', '8th', '9th'];
  return (
    <div className="spell-slot-grid">
      <SpellSlotRow
        row={row1}
        {...props}
      />
      <SpellSlotRow
        row={row2}
        {...props}
      />
      <SpellSlotRow
        row={row3}
        {...props}
      />
    </div>
  );
}

export default function SpellSlotTool({
  creatureId, toolMenuId, totalSpellSlots, addTotalSpellSlots, usedSpellSlots, addUsedSpellSlots,
}) {
  const tabs = ['Used', 'Total'];
  const panels = [
    <SpellSlotGrid
      id="used"
      creatureId={creatureId}
      defaultValue={0}
      values={usedSpellSlots}
      defaultMaxValues={maxSpellSlots}
      maxValues={totalSpellSlots}
      addSpellSlots={addUsedSpellSlots}
    />,
    <SpellSlotGrid
      id="total"
      creatureId={creatureId}
      defaultValue=""
      values={totalSpellSlots}
      defaultMaxValues={maxSpellSlots}
      maxValues={maxSpellSlots}
      addSpellSlots={addTotalSpellSlots}
    />,
  ];
  const labelledBy = `${toolMenuId}-spell-slots`;
  const id = `${toolMenuId}-spell-slots-tabs`;
  return (
    <TabList labelledBy={labelledBy} tabs={tabs} panels={panels} id={id} customClasses="spell-slots-container" />
  );
}
