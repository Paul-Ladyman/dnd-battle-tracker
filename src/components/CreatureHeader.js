import React from 'react';
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
  focused,
}) {
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
