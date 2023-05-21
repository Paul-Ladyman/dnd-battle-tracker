import React from 'react';
import OptionsMenuIcon from '../../../icons/OptionsMenuIcon';
import StatBlockLink from '../tools/StatBlockLink';
import MonsterSearcher from '../tools/MonsterSearcher';
import CreatureLocker from '../tools/CreatureLocker';
import CreatureSharer from '../tools/CreatureSharer';

export function CreatureMenuToolMenu({ creature, creatureManagement, active }) {
  const {
    statBlock,
    name,
  } = creature;
  const { toggleCreatureLock, toggleCreatureShare } = creatureManagement;

  return (
    <div className="new-creature-toolbar">
      { !statBlock && <MonsterSearcher search={name} /> }
      { statBlock && <StatBlockLink url={statBlock} /> }
      <CreatureLocker creature={creature} toggleCreatureLock={toggleCreatureLock} />
      <CreatureSharer
        creature={creature}
        toggleCreatureShare={toggleCreatureShare}
        active={active}
      />
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
