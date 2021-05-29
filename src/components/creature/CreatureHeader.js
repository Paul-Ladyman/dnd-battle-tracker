import React from 'react';
import CreatureExpander from '../buttons/CreatureExpander';
import CreatureLocker from '../buttons/CreatureLocker';
import MonsterSearcher from '../buttons/MonsterSearcher';
import CreatureSharer from '../buttons/CreatureSharer';
import CreatureHealthSharer from '../buttons/CreatureHealthSharer';

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
  shared,
  shareHandler,
  shareHpHandler,
  expanded,
  expandHandler,
  focused,
  multiColumn,
}) {
  const {
    alive, name, hitPointsShared,
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

  const creatureSharer = !playerSession && (
    <CreatureSharer
      shared={shared}
      name={name}
      shareHandler={shareHandler}
      disabled={active && shared}
    />
  );

  const creatureHealthSharer = !playerSession && (
    <CreatureHealthSharer
      shared={hitPointsShared}
      name={name}
      shareHandler={shareHpHandler}
      disabled={active && shared}
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
      <div className="creature-header--controls">
        {monsterSearcher}
        {creatureLocker}
        {creatureSharer}
        {creatureHealthSharer}
      </div>
    </div>
  );
}
