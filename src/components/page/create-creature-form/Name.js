import React, { useState, useEffect } from 'react';
import ComboboxList from '../../form/ComboboxList';
import { getMonsters } from '../../../client/dnd5eapi';

function getFilteredMonsters(name, monsterData) {
  if (name.length < 2) return [];
  return monsterData
    .filter((monster) => monster.name.toLowerCase().includes(name.toLowerCase()))
    .map((monster) => ({
      ...monster,
      text: monster.name,
      id: monster.index,
    }));
}

export default function Name({
  name,
  setName,
  onSelectMonster,
  inputRef,
  error,
}) {
  const [monsterData, setMonsterData] = useState([]);

  useEffect(() => {
    getMonsters().then(setMonsterData);
  }, []);

  return (
    <ComboboxList
      value={name}
      setValue={setName}
      list={getFilteredMonsters(name, monsterData)}
      id="create-creature-form-name"
      dropdownId="create-creature-form-name-dropdown"
      dropdownLabel="Select creature"
      label="Creature Name"
      listAriaLabel="Creature search results"
      inputAriaLabel="create creature form. Name (required)"
      inputAriaLabelItemSelected="create creature form. Name (required)"
      onItemSubmit={onSelectMonster}
      inputRef={inputRef}
      error={error}
      customClasses="create-creature-form--item__text"
      spellCheck={false}
      required
    />
  );
}
