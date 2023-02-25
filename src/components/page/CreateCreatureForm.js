import React, { useState, useRef, useEffect } from 'react';
import isHotkey from 'is-hotkey';
import { hotkeys } from '../../hotkeys/hotkeys';
import CrossIcon from '../icons/CrossIcon';
import MonsterSearcher from '../buttons/MonsterSearcher';
import Input from '../form/Input';
import RollableInput from '../form/RollableInput';
import RollGroupIcon from '../icons/RollGroupIcon';
import RollEachIcon from '../icons/RollEachIcon';
import ComboboxList from '../form/ComboboxList';
import { calculateAbilityModifier } from '../../domain/characterSheet';
import { getMonsters, getMonster } from '../../client/dnd5eapi';
import { validateCreature } from '../../state/CreatureFormManager';

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
  };
  const [state, setState] = useState(initialState);

  const [monsterData, setMonsterData] = useState([]);

  const nameInput = useRef(null);
  const initiativeInput = useRef(null);

  const hotKeyHandler = (e) => {
    if (isHotkey(hotkeys.createCreature, e)) {
      nameInput.current.focus();
    }
  };

  useEffect(() => {
    getMonsters().then(setMonsterData);
  }, []);

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

  const rollInitiative = () => {
    const { roll } = initiativeInput.current;
    if (state.rollEachInitiative) return () => roll().result;
    const initiative = roll().result;
    return () => initiative;
  };

  const createCreature = () => {
    const healthPoints = state.healthPoints === ''
      ? undefined
      : parseInt(state.healthPoints, 10);

    const multiplier = parseInt(state.multiplier, 10);

    const errors = validateCreature(state.name, state.initiative, healthPoints, multiplier);

    if (!errors) {
      const creature = {
        name: state.name, healthPoints, initiative: rollInitiative(), multiplier,
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

    const d20 = 'd20';
    if (dexterityModifier === 0) return d20;
    const sign = dexterityModifier > 0 ? '+' : '';
    return `${d20}${sign}${dexterityModifier}`;
  };

  const onSelectMonster = async (monster) => {
    const data = await getMonster(monster);
    const { hit_points: healthPoints, dexterity } = data;
    const dexterityModifier = calculateAbilityModifier(dexterity);
    setState((prevState) => ({
      ...prevState,
      name: monster.name,
      healthPoints: healthPoints || '',
      initiative: getInitiative(dexterity, dexterityModifier),
      dexterityModifier,
    }));
  };

  const {
    name, initiative, healthPoints, multiplier, rollEachInitiative,
  } = state;

  const {
    nameError, initiativeError, healthError, multiplierError,
  } = createCreatureErrors;

  const filteredMonsters = () => {
    if (name.length < 2) return [];
    return monsterData
      .filter((monster) => monster.name.toLowerCase().includes(name.toLowerCase()))
      .map((monster) => ({
        ...monster,
        text: monster.name,
        id: monster.index,
      }));
  };

  const nameRightControls = {
    rightEnabled: true,
    RightControl: <MonsterSearcher asButton={false} search={name} />,
  };

  return (
    <form className="create-creature-form">
      <ComboboxList
        value={name}
        setValue={setName}
        list={filteredMonsters()}
        id="create-creature-form-name"
        dropdownId="create-creature-form-name-dropdown"
        dropdownLabel="Select creature"
        label="Creature Name"
        listAriaLabel="Creature search results"
        inputAriaLabel="create creature form. Name (required)"
        inputAriaLabelItemSelected="create creature form. Name (required)"
        rightControls={nameRightControls}
        rightControlsItemSelected={nameRightControls}
        handleSubmit={createCreature}
        onItemSubmit={onSelectMonster}
        inputRef={nameInput}
        error={nameError && <span className="form--label__error"> *</span>}
        customClassName="create-creature-form--item__text"
      />
      <RollableInput
        value={initiative}
        customClasses="create-creature-form--item__number create-creature-form--item__tall"
        error={initiativeError && <span className="form--label__error"> number, dice</span>}
        ariaLabel="create creature form. Initiative (optional)"
        label={initiativeError ? 'Initiative' : 'Initiative (optional)'}
        name="initiative"
        handleChange={handleChange}
        submitHandler={toggleRollEachInitiative}
        rightControls={{
          rightTitle: rollEachInitiative ? 'Roll as group' : 'Roll per creature',
          RightSubmitIcon: rollEachInitiative ? <RollEachIcon /> : <RollGroupIcon />,
        }}
        formHandler={formHandler}
        inputId="create-creature-form-initiative"
        ref={initiativeInput}
      />
      <Input
        customClasses="create-creature-form--item__number"
        integer
        error={healthError && <span className="form--label__error"> &gt; 0</span>}
        value={healthPoints}
        ariaLabel="create creature form. Health points (optional)"
        label="HP (optional)"
        min="1"
        name="healthPoints"
        handleChange={handleChange}
        formHandler={formHandler}
        inputId="create-creature-form-health"
      />
      <div className="create-creature-form--multiplier-wrapper">
        <span className="create-creature-form--multiplier-symbol">x</span>
        <Input
          customClasses="create-creature-form--item__multiplier"
          integer
          required
          min="1"
          max="50"
          error={multiplierError && <span className="form--label__error"> 1 - 50</span>}
          value={multiplier}
          ariaLabel="create creature form. Multiplier (required)"
          label="Multiply"
          name="multiplier"
          handleChange={handleChange}
          formHandler={formHandler}
          inputId="create-creature-form-multiplier"
        />
      </div>
      <div className="create-creature-form--item__submit">
        <button
          type="button"
          className="create-creature-form--submit"
          title="Add creature"
          aria-label="Add creature"
          onClick={createCreature}
        >
          <CrossIcon />
        </button>
      </div>
    </form>
  );
}

export default CreateCreatureForm;
