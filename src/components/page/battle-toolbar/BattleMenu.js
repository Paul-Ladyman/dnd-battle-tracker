import React, { useState } from 'react';
import OptionsMenuIcon from '../../icons/OptionsMenuIcon';
import SaveLoadIcon from '../../icons/SaveLoadIcon';
import ShareIcon from '../../icons/ShareIcon';
import RulesSearchMenuIcon from '../../icons/RulesSearchMenuIcon';
import RemoveIcon from '../../icons/RemoveIcon';

export default function BattleMenu() {
  const [open, setOpen] = useState(false);
  const ariaExpanded = open ? 'true' : 'false';
  const menuDisplay = open ? 'block' : 'none';
  const toggle = () => setOpen(!open);
  const buttonClass = 'battle-menu--button';
  const buttonClasses = open ? `${buttonClass} ${buttonClass}__open` : buttonClass;

  return (
    <div>
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
        <li role="menuitem" className="battle-menu--item">
          <RulesSearchMenuIcon />
          Search rules
        </li>
        <li role="menuitem" className="battle-menu--item">
          <ShareIcon />
          Share battle
        </li>
        <li role="menuitem" className="battle-menu--item">
          <RemoveIcon />
          Reset battle
        </li>
        <li role="menuitem" className="battle-menu--item">
          <SaveLoadIcon />
          Save battle
        </li>
        <li role="menuitem" className="battle-menu--item">
          <SaveLoadIcon load />
          Load battle
        </li>
      </ul>
    </div>
  );
}
