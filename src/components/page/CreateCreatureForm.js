import React, { useState, useRef, useEffect } from 'react';
import isHotkey from 'is-hotkey';
import { hotkeys } from '../../hotkeys/hotkeys';
import CrossIcon from '../icons/CrossIcon';
import MonsterSearcher from '../buttons/MonsterSearcher';
import Input from './Input';
import DropdownOption from '../creature/toolbar/DropdownOption';

const BASE_API_URL = 'https://www.dnd5eapi.co';

function CreateCreatureForm({ createCreatureErrors, createCreature: propsCreateCreature }) {
  const initialState = {
    name: '',
    initiative: '',
    healthPoints: '',
    multiplier: 1,
    submitted: false,
  };
  const [state, setState] = useState(initialState);

  const [monsterData, setMonsterData] = useState([]);

  const [dropdownVisible, setDropdownVisible] = useState(true);

  const nameInput = useRef(null);

  const hotKeyHandler = (e) => {
    if (isHotkey(hotkeys.createCreature, e)) {
      nameInput.current.focus();
    }
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

  const resetForm = () => {
    setState(initialState);
    setDropdownVisible(true);
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

  const createCreature = () => {
    const healthPoints = state.healthPoints === ''
      ? undefined
      : parseInt(state.healthPoints, 10);

    const multiplier = parseInt(state.multiplier, 10);

    const initiative = state.initiative === ''
      ? undefined
      : parseInt(state.initiative, 10);

    const creature = {
      ...state, healthPoints, initiative, multiplier,
    };

    propsCreateCreature(creature);
    setState((prevState) => ({ ...prevState, submitted: true }));
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
        setState((prevState) => ({
          ...prevState,
          name: monster.name,
          healthPoints: data.hit_points,
          // TODO: add AC
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

  const filteredMonsters = monsterData.filter((monster) =>  monster.name.toLowerCase().includes(name.toLowerCase()));

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
