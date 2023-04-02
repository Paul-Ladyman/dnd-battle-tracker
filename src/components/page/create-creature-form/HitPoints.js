import React from 'react';
import ComboboxList from '../../form/ComboboxList';
import Rollable from '../../form/Rollable';

function getHpOptions(creatureStats) {
  if (!creatureStats) return [];
  const { hit_points: hitPoints, hit_points_roll: hitPointsRoll } = creatureStats;
  const hp = hitPoints ? [{ text: hitPoints, id: 'hp', title: 'Select average HP' }] : [];
  const hpRoll = hitPointsRoll ? [{ text: hitPointsRoll, id: 'hp-roll', title: 'Select HP dice' }] : [];
  return [...hp, ...hpRoll];
}

export default function HitPoints({
  hp,
  setHp,
  creatureStats,
  createCreature,
  inputRef,
  error,
}) {
  return (
    <Rollable
      value={hp}
      setValue={setHp}
      Component={ComboboxList}
      ref={inputRef}
      customClasses={`create-creature-form--item__number ${error && 'create-creature-form--item__tall'}`}
      error={error && <span className="form--label__error">number, dice, &gt;0</span>}
      list={getHpOptions(creatureStats)}
      id="create-creature-form-health"
      dropdownId="create-creature-form-health-dropdown"
      dropdownLabel="Select HP option"
      label="HP (optional)"
      listAriaLabel="Creature HP options"
      inputAriaLabel="create creature form. Health points (optional)"
      inputAriaLabelItemSelected="create creature form. Health points (optional)"
      handleSubmit={createCreature}
    />
  );
}
