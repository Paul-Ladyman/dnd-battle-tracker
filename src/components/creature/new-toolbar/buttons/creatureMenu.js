import React from 'react';
import OptionsMenuIcon from '../../../icons/OptionsMenuIcon';
import StatBlockLink from '../tools/StatBlockLink';
import MonsterSearcher from '../tools/MonsterSearcher';
import CreatureLocker from '../tools/CreatureLocker';

export function CreatureMenuToolMenu({ creature, creatureManagement }) {
  const {
    statBlock,
    name,
    locked,
    id,
  } = creature;
  const { toggleCreatureLock } = creatureManagement;

  return (
    <div className="new-creature-toolbar">
      { !statBlock && <MonsterSearcher search={name} /> }
      { statBlock && <StatBlockLink url={statBlock} /> }
      <CreatureLocker locked={locked} name={name} lockHandler={() => toggleCreatureLock(id)} />
    </div>
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
