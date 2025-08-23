import React, {
  useRef,
  useState,
  useContext,
  useEffect,
} from 'react';
import isHotkey from 'is-hotkey';
import OptionsMenuIcon from '../../icons/OptionsMenuIcon';
import useNavigableList from '../../widgets/useNavigableList';
import useAutoClosable from '../../widgets/useAutoClosable';
import BattleManagerContext from '../../app/BattleManagerContext';
import { playerItems, dmItems } from './menuItems';
import { hotkeys } from '../../../hotkeys/hotkeys';
import AlertDialog from '../../widgets/AlertDialog';

export default function BattleMenu({
  playerSession,
  shareEnabled,
  rulesSearchOpen,
  toggleRulesSearch,
}) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const battleManager = useContext(BattleManagerContext);
  const parentRef = useRef(null);
  const buttonRef = useRef(null);
  const fileSelector = useRef(null);
  const items = playerSession
    ? playerItems(rulesSearchOpen, toggleRulesSearch)
    : dmItems(battleManager, shareEnabled, rulesSearchOpen, toggleRulesSearch, fileSelector);

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

  const hotKeyHandler = (e) => {
    if (isHotkey(hotkeys.battlebar, e)) buttonRef.current.focus();
  };

  useEffect(() => {
    window.addEventListener('keydown', hotKeyHandler);
    return () => window.removeEventListener('keydown', hotKeyHandler);
  }, []);

  const ariaExpanded = open ? 'true' : 'false';
  const menuDisplay = open ? 'block' : 'none';
  const toggle = () => setOpen(!open);
  const buttonClass = 'battle-menu--button';
  const buttonClasses = open ? `${buttonClass} ${buttonClass}__open` : buttonClass;

  const clickHandler = (onClick, confirm, message, currentItem) => {
    const handleClick = () => {
      setOpen(false);
      onClick();
    };

    if (!confirm) return handleClick();

    setFocusedItem(null);
    return setConfirming({
      onNo: () => {
        setConfirming(null);
        setFocusedItem(currentItem);
      },
      onYes: () => {
        setConfirming(null);
        handleClick();
      },
      message,
    });
  };

  const handleUpload = () => {
    const file = fileSelector.current.files[0];
    battleManager.loadBattle(file);
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
          confirm,
          message,
        }, i) => (
          <li
            ref={ref}
            key={label}
            role="menuitem"
            className="battle-menu--item"
            tabIndex="-1"
            onFocus={() => setFocusedItem(i)}
            onClick={() => clickHandler(onClick, confirm, message, i)}
            onKeyDown={({ code }) => code === 'Enter' && clickHandler(onClick, confirm, message, i)}
          >
            {icon}
            {label}
          </li>
        ))}
      </ul>
      <input
        data-testid="load-battle"
        type="file"
        className="hidden"
        accept="application/json"
        ref={fileSelector}
        onChange={handleUpload}
        value=""
      />
      <AlertDialog
        show={confirming}
        message={confirming?.message}
        onYes={confirming?.onYes}
        onNo={confirming?.onNo}
      />
    </div>
  );
}
