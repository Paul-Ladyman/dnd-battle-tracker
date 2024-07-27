import React, { useState, useRef, useEffect } from 'react';
import isHotkey from 'is-hotkey';
import { hotkeys } from '../../../hotkeys/hotkeys';
import getMonster from '../../../domain/monster';
import { validateCreature } from '../../../state/CreatureFormManager';
import Name from './Name';
import Initiative from './Initiative';
import HitPoints from './HitPoints';
import Quantity from './Quantity';
import Submit from './Submit';
import ArmorClass from './ArmorClass';

function CreateCreatureForm({
  createCreatureErrors,
  createCreature: propsCreateCreature,
  handleCreateCreatureErrors,
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

  const nameInput = useRef(null);
  const initiativeInput = useRef(null);
  const hpInput = useRef(null);

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
    const errors = Object.keys(createCreatureErrors).length > 0;

    const { submitted } = state;
    if (submitted && !errors) {
      resetForm();
    }
  }, [state.submitted, createCreatureErrors]);

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
    const hp = roll().result;
    return () => hp;
  };

  const rollField = (ref, rollEach) => {
    const { roll } = ref.current;
    if (rollEach) return () => roll();
    const result = roll();
    return () => result;
  };

  const createCreature = () => {
    const {
      quantity,
      name,
      initiative,
      healthPoints,
      armorClass,
      rollEachHp,
      rollEachInitiative,
      stats,
    } = state;

    const intQuantity = parseInt(quantity, 10);

    const errors = validateCreature(name, initiative, healthPoints, armorClass, intQuantity);

    if (!errors) {
      const creature = {
        name,
        healthPoints: rollFieldForResult(hpInput, rollEachHp),
        armorClass,
        initiative: rollField(initiativeInput, rollEachInitiative),
        quantity: intQuantity,
        stats,
      };

      propsCreateCreature(creature);
    } else {
      handleCreateCreatureErrors(errors);
    }

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

  const formHandler = (event) => {
    if (event.keyCode === 13) {
      createCreature();
    }
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

  const {
    nameError, initiativeError, healthError, acError, quantityError,
  } = createCreatureErrors;

  return (
    <form className="create-creature-form">
      <Name
        name={name}
        setName={setName}
        createCreature={createCreature}
        onSelectMonster={onSelectMonster}
        inputRef={nameInput}
        error={nameError}
      />
      <Initiative
        initiative={initiative}
        handleChange={handleChange}
        rollEachInitiative={rollEachInitiative}
        toggleRollEachInitiative={toggleRollEachInitiative}
        formHandler={formHandler}
        inputRef={initiativeInput}
        error={initiativeError}
      />
      <HitPoints
        hp={healthPoints}
        setHp={setHp}
        creatureStats={state.stats}
        createCreature={createCreature}
        inputRef={hpInput}
        error={healthError}
        rollEachHp={rollEachHp}
        toggleRollEachHp={toggleRollEachHp}
      />
      <ArmorClass
        ac={armorClass}
        handleChange={handleChange}
        formHandler={formHandler}
        error={acError}
      />
      <Quantity
        quantity={quantity}
        handleChange={handleChange}
        formHandler={formHandler}
        error={quantityError}
      />
      <Submit createCreature={createCreature} />
    </form>
  );
}

export default CreateCreatureForm;
