import React, { useState } from 'react';
import CreatureToolbarInput from '../CreatureToolbarInput';
import CrossIcon from '../../../../icons/CrossIcon';
import Input from '../../../../form/Input';

function Spell({
  spellProperty,
  spellKey,
  spell,
  id,
  creatureId,
  defaultValue,
  onSpellChange,
  useSpellMax,
}) {
  const initialValue = spell[spellProperty] || defaultValue;
  const [value, setValue] = useState(initialValue);
  const { label, total } = spell;

  const inputId = `${creatureId}-${id}-spells-${spellKey}`;

  const max = useSpellMax && Number.isInteger(total) ? total : 5;

  const handleChange = (event) => {
    const { value: newValue } = event.target;
    setValue(newValue);
    if (newValue !== '') onSpellChange(creatureId, spellKey, parseInt(newValue, 10));
  };

  return (
    <Input
      integer
      min="0"
      max={max}
      spinner
      value={value}
      ariaLabel={label}
      label={label}
      inputId={inputId}
      customClasses="spell-slot"
      handleChange={handleChange}
      disabled={max === 0}
    />
  );
}

function Spells({
  spells,
  spellProperty,
  creatureId,
  id,
  defaultValue,
  onSpellChange,
  useSpellMax,
}) {
  const spellKeys = Object.keys(spells);
  if (spellKeys.length === 0) return null;

  const spellsWithInputs = spellKeys.map((key) => (
    <Spell
      key={key}
      spellProperty={spellProperty}
      spellKey={key}
      spell={spells[key]}
      id={id}
      creatureId={creatureId}
      defaultValue={defaultValue}
      onSpellChange={onSpellChange}
      useSpellMax={useSpellMax}
    />
  ));

  return (
    <section aria-label="Spells">
      {spellsWithInputs}
    </section>
  );
}

export default function SpellList({
  spells,
  spellProperty,
  addSpell,
  creatureId,
  creatureName,
  id,
  description,
  defaultValue,
  onSpellChange,
  useSpellMax,
}) {
  return (
    <div>
      <p>{description}</p>
      <CreatureToolbarInput
        ariaLabel={`Add spells for ${creatureName}`}
        label="Spells"
        rightSubmit={(spell) => addSpell(creatureId, spell)}
        rightControls={{
          rightTitle: 'Add spell',
          RightSubmitIcon: <CrossIcon />,
        }}
        inputId={`${creatureId}-${id}-spells`}
      />
      <Spells
        spells={spells}
        spellProperty={spellProperty}
        creatureId={creatureId}
        id={id}
        defaultValue={defaultValue}
        onSpellChange={onSpellChange}
        useSpellMax={useSpellMax}
      />
    </div>
  );
}
