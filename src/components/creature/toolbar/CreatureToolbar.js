import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import getToolbar from './toolbar';
import useNavigableList from '../../widgets/useNavigableList';

export default function CreatureToolbar({
  creature,
  conditions,
  creatureManagement,
  active,
}) {
  const [focused, setFocused] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const toolbarRef = useRef(null);
  const {
    id, name,
  } = creature;

  const buttons = useMemo(getToolbar, []);

  const [focusedButton, setFocusedButton] = useNavigableList(buttons, toolbarRef);

  const wrapperId = `toolbar-wrapper-${id}`;

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

  const toolbarWrapperClass = 'creature-toolbar-wrapper';
  const toolbarWrapperClasses = focused ? `${toolbarWrapperClass} ${toolbarWrapperClass}__focused` : toolbarWrapperClass;
  const toolbarClass = 'creature-toolbar';

  const tabIndex = focusedButton === null ? 0 : focusedButton;
  const toolMenuExpanded = !!ToolMenu;
  const toolMenuDisplay = toolMenuExpanded ? 'block' : 'none';
  const toolMenuId = `${id}-tool-menu`;

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
              key={key(id)}
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
      { toolMenuExpanded && <div className="creature-toolbar-separator" />}
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
            toolMenuId={toolMenuId}
          />
          )}
      </div>
    </div>
  );
}
