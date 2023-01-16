/* eslint-disable max-len */
import React, { useState, useRef, useEffect } from 'react';
import isHotkey from 'is-hotkey';
import Switch from 'react-switch';
import { hotkeys } from '../../hotkeys/hotkeys';
import CrossIcon from '../icons/CrossIcon';
import MonsterSearcher from '../buttons/MonsterSearcher';
import Input from './Input';
import InitiativeGenerator from '../buttons/InitiativeGenerator';
import rollDice from '../../util/rollDice';
import DropdownOption from '../creature/toolbar/DropdownOption';
import { calculateAbilityModifier } from '../../util/characterSheet';

const BASE_API_URL = 'https://www.dnd5eapi.co';

function CreateCreatureForm({ createCreatureErrors, createCreature: propsCreateCreature }) {
  const initialState = {
    name: '',
    initiative: '',
    healthPoints: '',
    multiplier: 1,
    submitted: false,
    apiData: undefined,
  };
  const [state, setState] = useState(initialState);

  const [monsterData, setMonsterData] = useState([]);

  const [dropdownVisible, setDropdownVisible] = useState(true);

  const [hasSameInitiative, setSameInitiative] = useState(true);

  const nameInput = useRef(null);

  const hotKeyHandler = (e) => {
    if (isHotkey(hotkeys.createCreature, e)) {
      nameInput.current.focus();
    }
  };

  const toggleInitiative = () => {
    setSameInitiative((prevValue) => !prevValue);
  };

  const resetForm = () => {
    setState(initialState);
    setDropdownVisible(true);
    setSameInitiative(true);
    nameInput.current.focus();
  };

  useEffect(() => {
    fetch(`${BASE_API_URL}/api/monsters`, { 'Content-Type': 'application/json' })
      .then((response) => response.json())
      .then((data) => {
        setDropdownVisible(true);
        setMonsterData(data.results);
      })
      .catch(() => {
        setDropdownVisible(false);
        setMonsterData([]);
      });
  }, []);

  useEffect(() => {
    nameInput.current.focus();
    window.addEventListener('keydown', hotKeyHandler);
    return () => window.removeEventListener('keydown', hotKeyHandler);
  }, []);

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

  const createCreature = () => {
    const healthPoints = state.healthPoints === ''
      ? undefined
      : parseInt(state.healthPoints, 10);

    const multiplier = parseInt(state.multiplier, 10);

    const initiative = state.initiative === ''
      ? undefined
      : parseInt(state.initiative, 10);

    const creature = {
      ...state, healthPoints, initiative, multiplier, syncMultipleInitiatives: hasSameInitiative,
    };

    propsCreateCreature(creature);
    setState((prevState) => ({ ...prevState, submitted: true }));
  };

  const onPressDice = () => {
    setState((prevState) => ({
      ...prevState,
      initiative: `${rollDice(20)}`,
    }));
  };

  const formHandler = (event) => {
    if (event.keyCode === 13) {
      createCreature();
    }
  };

  const onSelectMonster = (monster) => {
    if (!monster) return;
    fetch(`${BASE_API_URL}${monster.url}`, { 'Content-Type': 'application/json' })
      .then((response) => response.json())
      .then((data) => {
        const dexterityModifier = data.dexterity ? calculateAbilityModifier(data.dexterity) : 0;
        const rolledNumber = rollDice(20);
        const calculatedInitiative = `${rolledNumber + dexterityModifier}`;
        setState((prevState) => ({
          ...prevState,
          initiative: state.initiative.length > 0 ? state.initiative : calculatedInitiative,
          name: monster.name,
          healthPoints: data.hit_points,
          apiData: data,
        }));
      })
      .finally(() => {
        setDropdownVisible(false);
      });
  };

  const {
    name, initiative, healthPoints, multiplier,
  } = state;

  const {
    nameError, initiativeError, healthError, multiplierError,
  } = createCreatureErrors;

  const renderToggle = state.multiplier > 1;

  const toggleTitle = hasSameInitiative ? 'Same' : 'Random';

  const filteredMonsters = monsterData.filter((monster) => monster.name.toLowerCase().includes(name.toLowerCase()));

  return (
    <form className="create-creature-form">
      <Input
        customClasses="create-creature-form--item__text"
        required
        error={nameError && <span className="form--label__error"> *</span>}
        inputRef={nameInput}
        value={name}
        ariaLabel="create creature form. Name (required)"
        label="Creature Name"
        name="name"
        handleChange={handleChange}
        rightControls={{
          rightEnabled: true,
          RightControl: <MonsterSearcher asButton={false} search={name} />,
        }}
        formHandler={formHandler}
        inputId="create-creature-form-name"
      />

      {name.length > 1 && filteredMonsters.length > 0 && dropdownVisible && (
      <ul
        style={{
          height: '80px',
          overflowY: 'scroll',
        }}
        className="creature-toolbar--notes-dropdown"
        role="listbox"
      >
        {filteredMonsters.map((item) => (
          <div className="creature-toolbar--notes-dropdown-group" key={item.index}>
            <DropdownOption
              className="creature-toolbar--notes-dropdown-item"
              onClick={() => onSelectMonster(item)}
              selected={false}
              text={item.name}
            />
          </div>
        ))}
      </ul>
      )}

      <Input
        customClasses="create-creature-form--item__number create-creature-form--item__tall"
        error={initiativeError}
        integer
        value={initiative}
        ariaLabel="create creature form. Initiative (optional)"
        label="Initiative (optional)"
        name="initiative"
        handleChange={handleChange}
        rightControls={{
          rightEnabled: true,
          RightControl: (
            <InitiativeGenerator asButton={false} onPressDice={onPressDice} diceRoll={initiative} />
          ),
        }}
        formHandler={formHandler}
        inputId="create-creature-form-initiative"
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
      {renderToggle && (
      <div className="right-toggle">
        <span className="sync-label-text">
          {toggleTitle}
          {' '}
          init.
        </span>

        <Switch
          onChange={toggleInitiative}
          checked={hasSameInitiative}
          className="react-switch"
          onColor="#822000"
          onHandleColor="#EBE1AD"
          handleDiameter={22}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={14}
          width={44}
          id="material-switch"
        />
      </div>
      )}

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
