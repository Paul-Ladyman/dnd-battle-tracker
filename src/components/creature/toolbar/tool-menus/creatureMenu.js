import React from 'react';
import StatBlockLink from '../tools/StatBlockLink';
import MonsterSearcher from '../tools/MonsterSearcher';
import CreatureLocker from '../tools/CreatureLocker';
import CreatureSharer from '../tools/CreatureSharer';
import CreatureHitPointsSharer from '../tools/CreatureHitPointsSharer';
import CreatureRemover from '../tools/CreatureRemover';
import CreatureMenuIcon from '../../../icons/CreatureMenuIcon';

export function CreatureMenuToolMenu({ creature, creatureManagement, active }) {
  const {
    statBlock,
    name,
  } = creature;
  const {
    toggleCreatureLock,
    toggleCreatureShare,
    toggleCreatureHitPointsShare,
    removeCreature,
  } = creatureManagement;

  return (
    <div className="creature-toolbar--grid creature-toolbar--grid__buttons-only creature-toolbar--entrance">
      { !statBlock && <MonsterSearcher search={name} /> }
      { statBlock && <StatBlockLink url={statBlock} /> }
      <CreatureLocker creature={creature} toggleCreatureLock={toggleCreatureLock} />
      <CreatureSharer
        creature={creature}
        toggleCreatureShare={toggleCreatureShare}
        active={active}
      />
      <CreatureHitPointsSharer
        creature={creature}
        toggleCreatureHitPointsShare={toggleCreatureHitPointsShare}
      />
      <CreatureRemover
        creature={creature}
        removeCreature={removeCreature}
        disabled={active}
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
  focused,
}) {
  const toolbarClass = 'creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const focusedButtonClass = focused ? `${buttonClass}__focused` : '';
  return (
    <button
      title="Creature Menu"
      aria-label="Creature Menu"
      className={`${buttonClass} ${focusedButtonClass}`}
      type="button"
      ref={buttonRef}
      onFocus={onFocus}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-haspopup="true"
      aria-controls={toolMenuId}
      aria-expanded={toolMenuExpanded}
    >
      <CreatureMenuIcon />
    </button>
  );
}
