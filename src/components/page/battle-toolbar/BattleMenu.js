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
      >
        <OptionsMenuIcon />
      </button>
      <ul id="battle-menu" role="menu" aria-labelledby="battle-menu-button" style={{ display: menuDisplay }}>
        <li role="menuitem">
          <SaveLoadIcon />
          Save battle
        </li>
        <li role="menuitem">
          <SaveLoadIcon load />
          Load battle
        </li>
        <li role="menuitem">
          <ShareIcon />
          Share battle
        </li>
        <li role="menuitem">
          <RulesSearchMenuIcon />
          Search rules
        </li>
        <li role="menuitem">
          <RemoveIcon />
          Reset battle
        </li>
      </ul>
    </div>
  );
}
