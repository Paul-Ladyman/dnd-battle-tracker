import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import getButtons from './buttons/buttons';

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

export default function NewCreatureToolbar({
  creature,
  conditions,
  creatureManagement,
  active,
}) {
  const [focused, setFocused] = useState(false);
  const [focusedButton, setFocusedButton] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const toolbarRef = useRef(null);
  const {
    id, name,
  } = creature;

  const buttons = useMemo(getButtons, []);

  const wrapperId = `toolbar-wrapper-${id}`;

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

  const closeToolMenu = () => setSelectedButton(null);

  const focusButton = (i) => {
    if (i !== null) buttons[i].ref.current.focus();
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
    focusButton(focusedButton);
  }, [focusedButton]);

  useEffect(() => {
    if (focused) {
      const wrapper = document.getElementById(wrapperId);
      const clickToCloseHandler = (e) => {
        const clickOutsideWrapper = wrapper && !wrapper.contains(e.target);
        if (clickOutsideWrapper) {
          setFocused(false);
          setSelectedButton(null);
        }
      };
      document.addEventListener('click', clickToCloseHandler);

      return () => document.removeEventListener('click', clickToCloseHandler);
    }
    return undefined;
  }, [focused]);

  useEffect(() => {
    if (focused) {
      const wrapper = document.getElementById(wrapperId);
      const tabToCloseHandler = (e) => {
        if (e.keyCode === 9) {
          const focusOutsideComboBox = wrapper && !wrapper.contains(e.target);
          if (focusOutsideComboBox) {
            setFocused(false);
            setSelectedButton(null);
          }
        }
      };
      document.addEventListener('keyup', tabToCloseHandler);

      return () => document.removeEventListener('keyup', tabToCloseHandler);
    }
    return undefined;
  }, [focused]);

  useEffect(() => {
    if (focused) {
      const wrapper = document.getElementById(wrapperId);
      const escapeToCloseHandler = (e) => {
        if (e.keyCode === 27) {
          const targetIsNotesTool = e.target.getAttribute('id') === `combobox-notes-wrapper-${id}`;
          const notesToolEmpty = e.target.getAttribute('value') === '';
          const notesToolClosed = e.target.getAttribute('aria-expanded') === 'false';
          const shouldEscape = targetIsNotesTool ? notesToolEmpty && notesToolClosed : true;
          if (shouldEscape) {
            setSelectedButton(null);
            focusButton(focusedButton);
          }
        }
      };
      wrapper.addEventListener('keydown', escapeToCloseHandler);

      return () => wrapper.removeEventListener('keydown', escapeToCloseHandler);
    }
    return undefined;
  }, [focused, focusedButton]);

  const ToolMenu = buttons[selectedButton]?.ToolMenu;

  const toolbarWrapperClass = 'new-creature-toolbar-wrapper';
  const toolbarWrapperClasses = focused ? `${toolbarWrapperClass} ${toolbarWrapperClass}__focused` : toolbarWrapperClass;
  const toolbarClass = 'new-creature-toolbar';

  const tabIndex = focusedButton === null ? 0 : focusedButton;
  const toolMenuExpanded = !!ToolMenu;
  const toolMenuDisplay = toolMenuExpanded ? 'block' : 'none';
  const toolMenuId = `${name}-tool-menu`;

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
            Button,
            ref,
            key,
          } = button;
          return (
            <Button
              key={key}
              creature={creature}
              buttonRef={ref}
              focused={selectedButton === i}
              onFocus={() => setFocusedButton(i)}
              onClick={() => toggleSelectedButton(i)}
              tabIndex={i === tabIndex ? '0' : '-1'}
              toolMenuId={toolMenuId}
              toolMenuExpanded={toolMenuExpanded}
              creatureManagement={creatureManagement}
              closeToolMenu={closeToolMenu}
            />
          );
        })}
      </div>
      { toolMenuExpanded && <div className="expanded-creature--separator" />}
      <div
        role="menu"
        aria-label={`${name} tool menu`}
        style={{ display: toolMenuDisplay }}
        id={toolMenuId}
      >
        {ToolMenu
          && (
          <ToolMenu
            creature={creature}
            conditions={conditions}
            creatureManagement={creatureManagement}
            active={active}
          />
          )}
      </div>
    </div>
  );
}
