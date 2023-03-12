import React from 'react';
import CreatureExpander from '../buttons/CreatureExpander';
import CreatureLocker from '../buttons/CreatureLocker';
import StatBlockLink from '../buttons/StatBlockLink';
import MonsterSearcher from '../buttons/MonsterSearcher';
import CreatureSharer from '../buttons/CreatureSharer';
import CreatureHitPointsSharer from '../buttons/CreatureHitPointsSharer';

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
  lockHandler,
  shareHandler,
  shareHitPointsHandler,
  expanded,
  expandHandler,
  focused,
  multiColumn,
}) {
  const {
    alive, name, hitPointsShared, locked, shared, statBlock,
  } = creature;
  const expandedOrActive = expanded || active;

  const nameClass = 'creature-name';
  const nameModifier = alive ? '' : 'collapsed-creature--name__dead';
  const collapsedNameClasses = `${nameClass} ${nameModifier}`;
  const classes = expandedOrActive ? nameClass : collapsedNameClasses;

  const titleClass = 'creature-title';
  const titleClasses = expandedOrActive && multiColumn ? `${titleClass} ${titleClass}__multicolumn` : titleClass;
  const controlsClass = 'creature-header--controls';
  const controlsClasses = expandedOrActive && multiColumn ? `${controlsClass} ${controlsClass}__multicolumn` : controlsClass;

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

  const creatureHitPointsSharer = !playerSession && (
    <CreatureHitPointsSharer
      shared={hitPointsShared}
      name={name}
      shareHandler={shareHitPointsHandler}
    />
  );

  const monsterSearcher = !playerSession && !statBlock && (
    <MonsterSearcher
      search={name}
    />
  );

  const statBlockLink = !playerSession && statBlock && (
    <StatBlockLink
      url={statBlock}
    />
  );

  return (
    <div className={titleClasses}>
      <h2 className="creature-header">{creatureExpander}</h2>
      <div className={controlsClasses}>
        {monsterSearcher}
        {statBlockLink}
        {creatureLocker}
        {creatureSharer}
        {creatureHitPointsSharer}
      </div>
    </div>
  );
}
