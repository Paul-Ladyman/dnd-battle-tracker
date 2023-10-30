import React, { useRef, useState, useContext } from 'react';
import OptionsMenuIcon from '../../icons/OptionsMenuIcon';
import SaveLoadIcon from '../../icons/SaveLoadIcon';
import ShareIcon from '../../icons/ShareIcon';
import RulesSearchMenuIcon from '../../icons/RulesSearchMenuIcon';
import RemoveIcon from '../../icons/RemoveIcon';
import useNavigableList from '../../widgets/useNavigableList';
import useAutoClosable from '../../widgets/useAutoClosable';
import BattleManagerContext from '../../app/BattleManagerContext';

const searchRules = {
  icon: <RulesSearchMenuIcon />,
  label: 'Search rules',
  ref: React.createRef(),
  onClick: () => {},
};

const dmItems = (battleManager, shareEnabled) => ([
  searchRules,
  {
    icon: <ShareIcon enabled={shareEnabled} />,
    label: shareEnabled ? 'Unshare battle' : 'Share battle',
    ref: React.createRef(),
    onClick: () => battleManager.toggleShare(),
  },
  {
    icon: <RemoveIcon />,
    label: 'Reset battle',
    ref: React.createRef(),
    onClick: () => {},
  },
  {
    icon: <SaveLoadIcon />,
    label: 'Save battle',
    ref: React.createRef(),
    onClick: () => {},
  },
  {
    icon: <SaveLoadIcon load />,
    label: 'Load battle',
    ref: React.createRef(),
    onClick: () => {},
  },
]);

const playerItems = [searchRules];

export default function BattleMenu({ playerSession, shareEnabled }) {
  const [open, setOpen] = useState(false);
  const battleManager = useContext(BattleManagerContext);
  const parentRef = useRef(null);
  const buttonRef = useRef(null);
  const items = playerSession ? playerItems : dmItems(battleManager, shareEnabled);

  const [_, setFocusedItem] = useNavigableList({
    items,
    parentRef,
    autoManageFocus: true,
    onNavigate: () => !open && setOpen(true),
  });

  const wrapperId = 'battle-menu-wrapper';
  const close = () => {
    setOpen(false);
    setFocusedItem(null);
  };
  const onEscapeToClose = () => {
    close();
    buttonRef.current.focus();
  };

  useAutoClosable({
    wrapperId,
    onClickToClose: close,
    onTabToClose: close,
    onEscapeToClose,
    onEscapeDeps: [],
  });

  const ariaExpanded = open ? 'true' : 'false';
  const menuDisplay = open ? 'block' : 'none';
  const toggle = () => setOpen(!open);
  const buttonClass = 'battle-menu--button';
  const buttonClasses = open ? `${buttonClass} ${buttonClass}__open` : buttonClass;

  const clickHandler = (onClick) => {
    setOpen(false);
    onClick();
  };

  return (
    <div ref={parentRef} id={wrapperId}>
      <button
        type="button"
        aria-label="Battle Menu"
        title="Battle Menu"
        aria-expanded={ariaExpanded}
        aria-haspopup="true"
        aria-controls="battle-menu"
        id="battle-menu-button"
        onClick={toggle}
        className={buttonClasses}
        ref={buttonRef}
      >
        <OptionsMenuIcon />
      </button>
      <ul
        id="battle-menu"
        role="menu"
        aria-labelledby="battle-menu-button"
        style={{ display: menuDisplay }}
        className="battle-menu"
      >
        {items.map(({
          icon,
          label,
          ref,
          onClick,
        }, i) => (
          <li
            ref={ref}
            key={label}
            role="menuitem"
            className="battle-menu--item"
            tabIndex="-1"
            onFocus={() => setFocusedItem(i)}
            onClick={() => clickHandler(onClick)}
            onKeyDown={({ code }) => code === 'Enter' && clickHandler(onClick)}
          >
            {icon}
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
