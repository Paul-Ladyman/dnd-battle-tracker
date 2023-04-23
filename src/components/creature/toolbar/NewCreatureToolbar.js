import React, { useState, useEffect } from 'react';
import OptionsMenuIcon from '../../icons/OptionsMenuIcon';
import KillStabalizeIcon from '../../icons/KillStabalizeIcon';
import InitiativeIcon from '../../icons/InitiativeIcon';
import AddHpIcon from '../../icons/AddHpIcon';
import AddNoteIcon from '../../icons/AddNoteIcon';
import ConditionsIcon from '../../icons/ConditionsIcon';

const buttons = [
  {
    title: 'Creature Menu',
    text: null,
    Icon: () => <OptionsMenuIcon />,
    ref: React.createRef(),
    key: (id) => `${id}-menu`,
  },
  {
    title: 'Kill/Make unconscious',
    text: null,
    Icon: ({ creature }) => {
      const { alive } = creature;
      return <KillStabalizeIcon alive={alive} />;
    },
    ref: React.createRef(),
    key: (id) => `${id}-kill`,
  },
  {
    title: 'Initiative',
    text: 'Initiative',
    Icon: () => <InitiativeIcon />,
    ref: React.createRef(),
    key: (id) => `${id}-initiative`,
  },
  {
    title: 'Conditions',
    text: 'Conditions',
    Icon: () => <ConditionsIcon />,
    ref: React.createRef(),
    key: (id) => `${id}-conditions`,
  },
  {
    title: 'Notes',
    text: 'Notes',
    Icon: () => <AddNoteIcon />,
    ref: React.createRef(),
    key: (id) => `${id}-notes`,
    medium: true,
  },
  {
    title: 'HP',
    text: 'HP',
    Icon: () => <AddHpIcon />,
    ref: React.createRef(),
    key: (id) => `${id}-hp`,
    small: true,
  },
];

export default function NewCreatureToolbar({ creature }) {
  const [focused, setFocused] = useState(false);
  const [focusedButton, setFocusedButton] = useState(0);
  const {
    id, name,
  } = creature;

  const toolbarClass = 'new-creature-toolbar';
  const toolbarClasses = focused ? `${toolbarClass} ${toolbarClass}__focused` : toolbarClass;
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const mediumButtonClass = `${buttonClass}__medium`;
  const smallButtonClass = `${buttonClass}__small`;

  const hotKeyHandler = (e) => {
    if (e.keyCode === 39) {
      setFocusedButton((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', hotKeyHandler);
    return () => window.removeEventListener('keydown', hotKeyHandler);
  }, []);

  useEffect(() => {
    buttons[focusedButton].ref.current.focus();
  }, [focusedButton]);

  return (
    <div
      role="toolbar"
      aria-label={`${name} toolbar`}
      className={toolbarClasses}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {buttons.map((button) => {
        const {
          title,
          text,
          Icon,
          key,
          medium,
          small,
          ref,
        } = button;
        const className = `${text ? textButtonClass : buttonClass} ${medium && mediumButtonClass} ${small && smallButtonClass}`;
        return (
          <button
            key={key(id)}
            title={title}
            className={className}
            type="button"
            ref={ref}
          >
            <Icon creature={creature} />
            { text }
          </button>
        );
      })}
    </div>
  );
}
