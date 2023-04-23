import React from 'react';
import ComboboxList from '../../form/ComboboxList';
import RollGroupIcon from '../../icons/RollGroupIcon';
import RollEachIcon from '../../icons/RollEachIcon';
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
  rollEachHp,
  toggleRollEachHp,
}) {
  const rightControls = {
    rightTitle: rollEachHp ? 'Roll HP as group' : 'Roll HP per creature',
    RightSubmitIcon: rollEachHp ? <RollEachIcon /> : <RollGroupIcon />,
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
      id="create-creature-form-hp"
      dropdownId="create-creature-form-hp-dropdown"
      dropdownLabel="Select HP option"
      label="HP (optional)"
      listAriaLabel="Creature HP options"
      inputAriaLabel="create creature form. Hit points (optional)"
      inputAriaLabelItemSelected="create creature form. Hit points (optional)"
      handleSubmit={toggleRollEachHp}
      formHandler={createCreature}
      rightControls={rightControls}
      rightControlsItemSelected={rightControls}
      resetOnSubmit={false}
    />
  );
}
