import React, { useState, useRef, useEffect } from 'react';
import isHotkey from 'is-hotkey';
import { hotkeys } from '../../../hotkeys/hotkeys';
import { calculateAbilityModifier } from '../../../domain/characterSheet';
import { getMonster } from '../../../client/dnd5eapi';
import { validateCreature } from '../../../state/CreatureFormManager';
import Name from './Name';
import Initiative from './Initiative';
import HitPoints from './HitPoints';
import Multiply from './Multiply';
import Submit from './Submit';

function CreateCreatureForm({
  createCreatureErrors,
  createCreature: propsCreateCreature,
  handleCreateCreatureErrors,
}) {
  const initialState = {
    name: '',
    initiative: '',
    healthPoints: '',
    multiplier: 1,
    submitted: false,
    rollEachInitiative: false,
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
    nameInput.current.focus();
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

  const rollInitiative = () => {
    const { roll } = initiativeInput.current;
    if (state.rollEachInitiative) return () => roll().result;
    const initiative = roll().result;
    return () => initiative;
  };

  const createCreature = () => {
    const multiplier = parseInt(state.multiplier, 10);

    const errors = validateCreature(state.name, state.initiative, state.healthPoints, multiplier);

    const { roll: rollHp } = hpInput.current;

    if (!errors) {
      const creature = {
        name: state.name,
        healthPoints: rollHp().result,
        initiative: rollInitiative(),
        multiplier,
        stats: state.stats,
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

  const onSelectMonster = async (monster) => {
    const data = await getMonster(monster);
    const { hit_points: hp, hit_points_roll: hpRoll, dexterity } = data;
    const dexterityModifier = calculateAbilityModifier(dexterity);
    setState((prevState) => ({
      ...prevState,
      name: monster.name,
      healthPoints: hp || hpRoll || '',
      initiative: getInitiative(dexterity, dexterityModifier),
      dexterityModifier,
      stats: data,
    }));
  };

  const {
    name, initiative, healthPoints, multiplier, rollEachInitiative,
  } = state;

  const {
    nameError, initiativeError, healthError, multiplierError,
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
      />
      <Multiply
        multiplier={multiplier}
        handleChange={handleChange}
        formHandler={formHandler}
        error={multiplierError}
      />
      <Submit createCreature={createCreature} />
    </form>
  );
}

export default CreateCreatureForm;
