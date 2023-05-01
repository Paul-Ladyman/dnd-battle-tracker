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
import StatBlockLink from '../../buttons/StatBlockLink';
import MonsterSearcher from '../../buttons/MonsterSearcher';

function Separator() {
  return (
    <div className="expanded-creature--separator" />
  );
}

function getButtons() {
  return [
    {
      title: 'Creature Menu',
      text: null,
      Icon: () => <OptionsMenuIcon />,
      ToolMenu: ({ creature }) => {
        const { statBlock, name } = creature;
        return (
          <>
            { !statBlock && <MonsterSearcher search={name} /> }
            { statBlock && <StatBlockLink url={statBlock} /> }
          </>
        );
      },
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
  const [selectedButton, setSelectedButton] = useState(null);
  const toolbarRef = useRef(null);
  const {
    id, name,
  } = creature;

  const buttons = useMemo(getButtons, []);

  const wrapperId = `${id}-toolbar-wrapper`;

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

  const toggleSelectedButton = (i) => {
    if (selectedButton === i) {
      setSelectedButton(null);
    } else {
      setSelectedButton(i);
    }
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

  useEffect(() => {
    if (focused) {
      const clickHandler = (e) => {
        const wrapper = document.getElementById(wrapperId);
        const clickInWrapper = wrapper && wrapper.contains(e.target);
        if (focused && !clickInWrapper) {
          setFocused(false);
          setSelectedButton(null);
        }
      };
      document.addEventListener('click', clickHandler);

      return () => document.removeEventListener('click', clickHandler);
    }
    return undefined;
  }, [focused]);

  const toolbarWrapperClass = 'new-creature-toolbar-wrapper';
  const toolbarWrapperClasses = focused ? `${toolbarWrapperClass} ${toolbarWrapperClass}__focused` : toolbarWrapperClass;
  const toolbarClass = 'new-creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const mediumButtonClass = `${buttonClass}__medium`;
  const smallButtonClass = `${buttonClass}__small`;

  const tabIndex = focusedButton === null ? 0 : focusedButton;

  const toolMenuExpanded = selectedButton !== null;
  const toolMenuDisplay = toolMenuExpanded ? 'block' : 'none';
  const ToolMenu = toolMenuExpanded && buttons[selectedButton].ToolMenu;

  return (
    <div
      className={toolbarWrapperClasses}
      onFocus={() => setFocused(true)}
      id={wrapperId}
    >
      <div
        role="toolbar"
        aria-label={`${name} toolbar`}
        className={toolbarClass}
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
              onClick={() => toggleSelectedButton(i)}
              tabIndex={i === tabIndex ? '0' : '-1'}
              aria-haspopup="true"
              aria-controls={`${name}-toolbar-menu`}
              aria-expanded={toolMenuExpanded}
            >
              <Icon creature={creature} />
              { text }
            </button>
          );
        })}
      </div>
      { toolMenuExpanded && <Separator />}
      <div
        role="menu"
        aria-label={`${name} tool menu`}
        style={{ display: toolMenuDisplay }}
      >
        {ToolMenu && <ToolMenu creature={creature} />}
      </div>
    </div>
  );
}
