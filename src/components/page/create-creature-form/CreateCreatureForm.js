import React, { useState, useRef, useEffect } from 'react';
import isHotkey from 'is-hotkey';
import { hotkeys } from '../../../hotkeys/hotkeys';
import getMonster from '../../../domain/monster';
import Name from './Name';
import Initiative from './Initiative';
import HitPoints from './HitPoints';
import Quantity from './Quantity';
import Submit from './Submit';
import ArmorClass from './ArmorClass';

function CreateCreatureForm({
  createCreature: propsCreateCreature,
}) {
  const initialState = {
    name: '',
    initiative: '',
    healthPoints: '',
    armorClass: '',
    quantity: 1,
    submitted: false,
    rollEachInitiative: false,
    rollEachHp: false,
    dexterityModifier: 0,
    stats: null,
  };
  const [state, setState] = useState(initialState);
  const [modified, setModified] = useState(false);

  const nameInput = useRef(null);
  const initiativeInput = useRef(null);
  const hpInput = useRef(null);
  const quantityInput = useRef(null);

  const hotKeyHandler = (e) => {
    if (isHotkey(hotkeys.createCreature, e)) {
      nameInput.current.focus();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', hotKeyHandler);
    return () => window.removeEventListener('keydown', hotKeyHandler);
  }, []);

  const resetForm = () => {
    setState(initialState);
    nameInput.current.focus();
  };

  useEffect(() => {
    const { submitted } = state;
    if (submitted) {
      resetForm();
    }
  }, [state.submitted]);

  const handleChange = (event) => {
    event.persist();
    setState((prevState) => {
      const newState = { ...prevState };
      newState[event.target.name] = event.target.value;
      return newState;
    });
  };

  const setName = (newName) => {
    setState((prevState) => ({ ...prevState, name: newName }));
  };

  const setHp = (newHp) => {
    setState((prevState) => ({ ...prevState, healthPoints: newHp }));
  };

  const rollFieldForResult = (ref, rollEach) => {
    const { roll } = ref.current;
    if (rollEach) return () => roll().result;
    const { result } = roll();
    return () => result;
  };

  const rollField = (ref, rollEach) => {
    const { roll } = ref.current;
    if (rollEach) return () => roll();
    const result = roll();
    return () => result;
  };

  const createCreature = () => {
    const {
      name,
      armorClass,
      rollEachHp,
      rollEachInitiative,
      stats,
    } = state;

    const creature = {
      name,
      healthPoints: rollFieldForResult(hpInput, rollEachHp),
      armorClass,
      initiative: rollField(initiativeInput, rollEachInitiative),
      quantity: rollFieldForResult(quantityInput)(),
      stats,
    };

    propsCreateCreature(creature);

    setState((prevState) => ({ ...prevState, submitted: true }));
  };

  const toggleRollEachInitiative = () => {
    setState((prevState) => {
      const { rollEachInitiative } = state;
      const newState = { ...prevState, rollEachInitiative: !rollEachInitiative };
      return newState;
    });
  };

  const toggleRollEachHp = () => {
    setState((prevState) => {
      const { rollEachHp } = state;
      const newState = { ...prevState, rollEachHp: !rollEachHp };
      return newState;
    });
  };

  const getInitiative = (dexterity, dexterityModifier) => {
    if (dexterity === undefined) return '';

    const d20 = '1d20';
    if (dexterityModifier === 0) return d20;
    const sign = dexterityModifier > 0 ? '+' : '';
    return `${d20}${sign}${dexterityModifier}`;
  };

  const onSelectMonster = async (monsterData) => {
    const monster = await getMonster(monsterData);
    const {
      name,
      hp,
      hpRoll,
      dexterity,
      dexterityModifier,
      armorClass,
      stats,
    } = monster;

    setState((prevState) => ({
      ...prevState,
      name,
      healthPoints: hp || hpRoll || '',
      initiative: getInitiative(dexterity, dexterityModifier),
      dexterityModifier,
      armorClass: armorClass || '',
      stats,
    }));
  };

  const {
    name, initiative, healthPoints, armorClass, quantity, rollEachInitiative, rollEachHp,
  } = state;

  const formOnSubmit = (e) => {
    e.preventDefault();
    setModified(false);
    createCreature();
  };

  const formOnChange = () => {
    if (!modified) setModified(true);
  };

  const modifiedModifier = modified ? 'create-creature-form--modified' : '';

  return (
    <form className={`create-creature-form ${modifiedModifier}`} onSubmit={formOnSubmit} onChange={formOnChange}>
      <Name
        name={name}
        setName={setName}
        onSelectMonster={onSelectMonster}
        inputRef={nameInput}
        error="Required"
      />
      <Initiative
        initiative={initiative}
        handleChange={handleChange}
        rollEachInitiative={rollEachInitiative}
        toggleRollEachInitiative={toggleRollEachInitiative}
        inputRef={initiativeInput}
        error="Number / dice notation"
      />
      <HitPoints
        hp={healthPoints}
        setHp={setHp}
        creatureStats={state.stats}
        inputRef={hpInput}
        error="Number greater than 0 / dice notation"
        rollEachHp={rollEachHp}
        toggleRollEachHp={toggleRollEachHp}
      />
      <ArmorClass
        ac={armorClass}
        handleChange={handleChange}
        error="Number greater than 0"
      />
      <Quantity
        quantity={quantity}
        handleChange={handleChange}
        error="Required. Number between 1 and 50 / dice notation"
        inputRef={quantityInput}
      />
      <Submit createCreature={createCreature} />
    </form>
  );
}

export default CreateCreatureForm;
