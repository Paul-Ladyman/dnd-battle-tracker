import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import getToolbar from './toolbar';
import useNavigableList from '../../widgets/useNavigableList';
import useAutoClosable from '../../widgets/useAutoClosable';

export default function CreatureToolbar({
  creature,
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

  const [focusedButton, setFocusedButton] = useNavigableList({
    items: buttons,
    parentRef: toolbarRef,
    horizontal: true,
  });

  const wrapperId = `toolbar-wrapper-${id}`;

  const toggleSelectedButton = (i) => {
    if (selectedButton === i) {
      setSelectedButton(null);
    } else {
      setSelectedButton(i);
    }
  };

  const focusButton = (i) => {
    if (i !== null) buttons[i].ref.current.focus();
  };

  const closeToolMenu = () => setSelectedButton(null);

  const onAutoClose = () => {
    setFocused(false);
    closeToolMenu();
  };

  const onEscapeToClose = (e) => {
    const targetIsNotesTool = e.target.getAttribute('id') === `combobox-notes-wrapper-${id}`;
    if (!targetIsNotesTool) {
      setSelectedButton(null);
      focusButton(focusedButton);
    }
  };

  useEffect(() => {
    focusButton(focusedButton);
  }, [focusedButton]);

  useAutoClosable({
    closable: focused,
    wrapperId,
    onClickToClose: onAutoClose,
    onTabToClose: onAutoClose,
    onEscapeToClose,
    onEscapeDeps: [focusedButton],
  });

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
              active={active}
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
            creatureManagement={creatureManagement}
            active={active}
            toolMenuId={toolMenuId}
          />
          )}
      </div>
    </div>
  );
}
