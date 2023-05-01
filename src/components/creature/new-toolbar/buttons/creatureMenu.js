import React from 'react';
import OptionsMenuIcon from '../../../icons/OptionsMenuIcon';
import StatBlockLink from '../../../buttons/StatBlockLink';
import MonsterSearcher from '../../../buttons/MonsterSearcher';

export function CreatureMenuToolMenu({ creature }) {
  const { statBlock, name } = creature;
  return (
    <>
      { !statBlock && <MonsterSearcher search={name} /> }
      { statBlock && <StatBlockLink url={statBlock} /> }
    </>
  );
}

export function CreatureMenuButton({
  onFocus,
  onClick,
  tabIndex,
  buttonRef,
  toolMenuId,
  toolMenuExpanded,
}) {
  const toolbarClass = 'new-creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  return (
    <button
      title="Creature Menu"
      className={buttonClass}
      type="button"
      ref={buttonRef}
      onFocus={onFocus}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-haspopup="true"
      aria-controls={toolMenuId}
      aria-expanded={toolMenuExpanded}
    >
      <OptionsMenuIcon />
    </button>
  );
}
