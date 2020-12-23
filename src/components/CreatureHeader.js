import React from 'react';
import ActiveCreatureIcon from './icons/ActiveCreatureIcon';
import CreatureExpander from './CreatureExpander';
import CreatureLocker from './CreatureLocker';
import MonsterSearcher from './MonsterSearcher';

export default function CreatureHeader({
  classes,
  name,
  active,
  playerSession,
  locked,
  lockHandler,
  expanded,
  expandHandler,

}) {
  const creatureExpander = (
    <CreatureExpander
      active={active}
      expanded={expanded}
      name={name}
      expandHandler={expandHandler}
    />
  );
  const creatureLocker = !playerSession && (
  <CreatureLocker
    locked={locked}
    name={name}
    lockHandler={lockHandler}
  />
  );
  const monsterSearcher = !playerSession && <MonsterSearcher search={name} />;

  return (
    <div className="creature-title">
      <h2 className={classes}>{name}</h2>
      {monsterSearcher}
      {creatureLocker}
      {creatureExpander}
      {active && <ActiveCreatureIcon className="expanded-creature--active-icon" />}
    </div>
  );
}
