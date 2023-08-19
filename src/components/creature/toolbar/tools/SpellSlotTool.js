import React, { useState } from 'react';
import Input from '../../../form/Input';
import TabList from '../../../widgets/TabList';
import maxSpellSlots from '../../../../domain/spellSlots';

function SpellSlot({
  level,
  creatureId,
  defaultValue,
  ariaLabel,
  label,
  inputId,
  max,
  onChange,
}) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event) => {
    const { value: newValue } = event.target;
    setValue(newValue);
    onChange(creatureId, level, newValue);
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
  values,
  defaultMaxValues,
  maxValues,
  onChange,
}) {
  return (
    <div className="spell-slot-row">
      {
        row.map((level) => {
          const inputId = `${creatureId}-${id}-spell-slots-${level}`;
          const value = values?.[level] || defaultValue;
          const max = maxValues?.[level] || defaultMaxValues[level];
          return (
            <SpellSlot
              key={inputId}
              level={level}
              creatureId={creatureId}
              defaultValue={value}
              ariaLabel={`${level} Level`}
              label={`${level} Lvl`}
              inputId={inputId}
              max={max}
              onChange={onChange}
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
  values,
  defaultMaxValues,
  maxValues,
  onChange,
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
        values={values}
        defaultMaxValues={defaultMaxValues}
        maxValues={maxValues}
        onChange={onChange}
      />
      <SpellSlotRow
        row={row2}
        id={id}
        creatureId={creatureId}
        defaultValue={defaultValue}
        values={values}
        defaultMaxValues={defaultMaxValues}
        maxValues={maxValues}
        onChange={onChange}
      />
      <SpellSlotRow
        row={row3}
        id={id}
        creatureId={creatureId}
        defaultValue={defaultValue}
        values={values}
        defaultMaxValues={defaultMaxValues}
        maxValues={maxValues}
        onChange={onChange}
      />
    </div>
  );
}

export default function SpellSlotTool({
  creatureId, toolMenuId, totalSpellSlots, addTotalSpellSlots,
}) {
  const tabs = ['Used', 'Total'];
  const panels = [
    <SpellSlotGrid
      id="used"
      creatureId={creatureId}
      defaultValue={0}
      values={{}}
      defaultMaxValues={maxSpellSlots}
      maxValues={totalSpellSlots}
      onChange={() => {}}
    />,
    <SpellSlotGrid
      id="total"
      creatureId={creatureId}
      defaultValue=""
      values={totalSpellSlots}
      defaultMaxValues={maxSpellSlots}
      maxValues={maxSpellSlots}
      onChange={addTotalSpellSlots}
    />,
  ];
  const labelledBy = `${toolMenuId}-spell-slots`;
  const id = `${toolMenuId}-spell-slots-tabs`;
  return (
    <TabList labelledBy={labelledBy} tabs={tabs} panels={panels} id={id} customClasses="spell-slots-container" />
  );
}
