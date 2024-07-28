import React from 'react';
import CreatureExpander from './CreatureExpander';

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
  expanded,
  expandHandler,
  focused,
  multiColumn,
}) {
  const {
    alive, name,
  } = creature;
  const expandedOrActive = expanded || active;

  const nameClass = 'creature-name';
  const nameModifier = alive ? '' : 'collapsed-creature--name__dead';
  const collapsedNameClasses = `${nameClass} ${nameModifier}`;
  const classes = expandedOrActive ? nameClass : collapsedNameClasses;

  const titleClass = 'creature-title';

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

  return (
    <div className={titleClass}>
      <h2 className="creature-header">{creatureExpander}</h2>
    </div>
  );
}
