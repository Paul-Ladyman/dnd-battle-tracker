import React from 'react';
import ComboboxList from '../../form/ComboboxList';
import RollGroupIcon from '../../icons/RollGroupIcon';
import RollEachIcon from '../../icons/RollEachIcon';
import Rollable from '../../form/Rollable';

function RightControl({ rollEachHp, toggleRollEachHp }) {
  const title = rollEachHp ? 'Roll HP as group' : 'Roll HP per creature';
  const Icon = rollEachHp ? <RollEachIcon /> : <RollGroupIcon />;
  const onClick = (e) => {
    e.preventDefault();
    toggleRollEachHp();
  };
  return (
    <button type="button" title={title} onClick={onClick}>{Icon}</button>
  );
}

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
  rollEachHp,
  toggleRollEachHp,
}) {
  const rightControls = {
    RightControl: <RightControl rollEachHp={rollEachHp} toggleRollEachHp={toggleRollEachHp} />,
  };

  return (
    <Rollable
      value={hp}
      setValue={setHp}
      Component={ComboboxList}
      ref={inputRef}
      customClasses={`create-creature-form--item__number ${error && 'create-creature-form--item__tall'}`}
      error={error && <span className="form--label__error">number &gt;0, dice</span>}
      list={getHpOptions(creatureStats)}
      id="create-creature-form-health"
      dropdownId="create-creature-form-health-dropdown"
      dropdownLabel="Select HP option"
      label="HP (optional)"
      listAriaLabel="Creature HP options"
      inputAriaLabel="create creature form. Health points (optional)"
      inputAriaLabelItemSelected="create creature form. Health points (optional)"
      handleSubmit={createCreature}
      rightControls={rightControls}
    />
  );
}