import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import OptionsMenuIcon from '../../icons/OptionsMenuIcon';
import KillStabalizeIcon from '../../icons/KillStabalizeIcon';
import InitiativeIcon from '../../icons/InitiativeIcon';
import AddHpIcon from '../../icons/AddHpIcon';
import AddNoteIcon from '../../icons/AddNoteIcon';
import ConditionsIcon from '../../icons/ConditionsIcon';

function getButtons() {
  return [
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
}

function isHotkeyForward(e) {
  return e.keyCode === 39;
}

function isHotkeyBackward(e) {
  return e.keyCode === 37;
}

function isHotkeyHome(e) {
  return e.keyCode === 36;
}

function isHotkeyEnd(e) {
  return e.keyCode === 35;
}

export default function NewCreatureToolbar({ creature }) {
  const [focused, setFocused] = useState(false);
  const [focusedButton, setFocusedButton] = useState(null);
  const toolbarRef = useRef(null);
  const {
    id, name,
  } = creature;

  const buttons = useMemo(getButtons, []);

  const toolbarClass = 'new-creature-toolbar';
  const toolbarClasses = focused ? `${toolbarClass} ${toolbarClass}__focused` : toolbarClass;
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const mediumButtonClass = `${buttonClass}__medium`;
  const smallButtonClass = `${buttonClass}__small`;

  const getNextButtonForward = (prev) => {
    const next = prev + 1;
    if (next === buttons.length) return 0;
    return next;
  };

  const getNextButtonBackward = (prev) => {
    const next = prev - 1;
    if (next === -1) return buttons.length - 1;
    return next;
  };

  const hotKeyHandler = (e) => {
    if (isHotkeyHome(e)) {
      e.preventDefault();
      setFocusedButton(0);
    }
    if (isHotkeyEnd(e)) {
      e.preventDefault();
      setFocusedButton(buttons.length - 1);
    }
    if (isHotkeyForward(e)) setFocusedButton(getNextButtonForward);
    if (isHotkeyBackward(e)) setFocusedButton(getNextButtonBackward);
  };

  useEffect(() => {
    if (toolbarRef.current) {
      const toolbar = toolbarRef.current;
      toolbar.addEventListener('keydown', hotKeyHandler);
      return () => toolbar.removeEventListener('keydown', hotKeyHandler);
    }
    return null;
  }, []);

  useEffect(() => {
    if (focusedButton !== null) buttons[focusedButton].ref.current.focus();
  }, [focusedButton]);

  const tabIndex = focusedButton === null ? 0 : focusedButton;

  return (
    <div
      role="toolbar"
      aria-label={`${name} toolbar`}
      className={toolbarClasses}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      ref={toolbarRef}
    >
      {buttons.map((button, i) => {
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
            onFocus={() => setFocusedButton(i)}
            tabIndex={i === tabIndex ? '0' : '-1'}
          >
            <Icon creature={creature} />
            { text }
          </button>
        );
      })}
    </div>
  );
}
