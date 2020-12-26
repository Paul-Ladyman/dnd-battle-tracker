import React from 'react';
import CreatureExpander from './CreatureExpander';
import CreatureLocker from './CreatureLocker';
import MonsterSearcher from './MonsterSearcher';

export default function CreatureHeader({
  creature,
  active,
  playerSession,
  locked,
  lockHandler,
  expanded,
  expandHandler,
  focused,
}) {
  const {
    alive, conditions, notes, name,
  } = creature;
  const nameClass = 'creature-name';
  const nameModifier = alive ? '' : 'collapsed-creature--name__dead';
  const collapsedNameClasses = `${nameClass} ${nameModifier}`;

  const showConditions = conditions.length > 0;
  const showNotes = notes.length > 0;
  const multiColumn = showConditions || showNotes;
  const expandedNameClasses = multiColumn ? `${nameClass} ${nameClass}__one-line` : nameClass;

  const classes = expanded ? expandedNameClasses : collapsedNameClasses;

  const creatureExpander = (
    <CreatureExpander
      classes={classes}
      active={active}
      expanded={expanded}
      name={name}
      expandHandler={expandHandler}
      focused={focused && !active}
    />
  );
  const creatureLocker = !playerSession && (
  <CreatureLocker
    locked={locked}
    name={name}
    lockHandler={lockHandler}
  />
  );
  const monsterSearcher = !playerSession && (
    <MonsterSearcher
      search={name}
      focused={focused && active}
    />
  );

  return (
    <div className="creature-title">
      <h2 className="creature-header">{creatureExpander}</h2>
      {monsterSearcher}
      {creatureLocker}
    </div>
  );
}
