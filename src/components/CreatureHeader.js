import React from 'react';
import CreatureExpander from './CreatureExpander';
import CreatureLocker from './CreatureLocker';
import MonsterSearcher from './MonsterSearcher';

function getName(expanded, active, name, multiColumn) {
  const maxLength = 22;
  if ((!expanded && !active) || !multiColumn || name.length < maxLength) {
    return name;
  }

  return `${name.slice(0, maxLength)} ...`;
}

export default function CreatureHeader({
  creature,
  active,
  playerSession,
  locked,
  lockHandler,
  expanded,
  expandHandler,
  focused,
  multiColumn,
}) {
  const {
    alive, name,
  } = creature;
  const nameClass = 'creature-name';
  const nameModifier = alive ? '' : 'collapsed-creature--name__dead';
  const collapsedNameClasses = `${nameClass} ${nameModifier}`;

  const classes = (expanded || active) ? nameClass : collapsedNameClasses;

  const creatureExpander = (
    <CreatureExpander
      classes={classes}
      active={active}
      expanded={expanded}
      name={getName(expanded, active, name, multiColumn)}
      expandHandler={expandHandler}
      focused={focused}
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
