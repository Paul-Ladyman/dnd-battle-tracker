import React, { useRef, useLayoutEffect, useState } from 'react';
import StatusTool from './StatusTool';
import HealthPointsTool from './HealthPointsTool';
import MaxHealthPointsTool from './MaxHealthPointsTool';
import TemporaryHealthPointsTool from './TemporaryHealthPointsTool';
import InitiativeTool from './InitiativeTool';
import ConditionsTool from './ConditionsTool';
import NotesTool from './NotesTool';
import NavigationTool from './NavigationTool';

function toolsPageOne({
  creatureManagement,
  creature,
  conditions,
  statusToolRef,
  navFunc,
}) {
  const {
    killCreature,
    stabalizeCreature,
    damageCreature,
    healCreature,
    addNoteToCreature,
    addInitiativeToCreature,
  } = creatureManagement;
  const {
    alive, healthPoints, maxHealthPoints, id, name, initiative,
  } = creature;

  return [
    <StatusTool
      key={`${id}-status-tool`}
      name={name}
      id={id}
      statusToolRef={statusToolRef}
      alive={alive}
      killCreature={killCreature}
      stabalizeCreature={stabalizeCreature}
    />,
    <HealthPointsTool
      key={`${id}-hitpoints-tool`}
      name={name}
      id={id}
      healthPoints={healthPoints}
      maxHealthPoints={maxHealthPoints}
      damageCreature={damageCreature}
      healCreature={healCreature}
    />,
    <InitiativeTool
      key={`${id}-initiative-tool`}
      name={name}
      id={id}
      initiative={initiative}
      addInitiativeToCreature={addInitiativeToCreature}
    />,
    <ConditionsTool
      key={`${id}-conditions-tool`}
      name={name}
      id={id}
      conditions={conditions}
      addNoteToCreature={addNoteToCreature}
    />,
    <NotesTool
      key={`${id}-notes-tool`}
      name={name}
      id={id}
      addNoteToCreature={addNoteToCreature}
    />,
    <NavigationTool
      key={`${id}-navigation-1-tool`}
      name={name}
      navFunc={navFunc}
    />,
  ];
}

function toolsPageTwo({
  creatureManagement,
  creature,
  navFunc,
}) {
  const {
    addHealthToCreature,
  } = creatureManagement;
  const {
    id, name, healthPoints,
  } = creature;

  return [
    <NavigationTool
      key={`${id}-navigation-2-tool`}
      name={name}
      navFunc={navFunc}
      previous
    />,
    <MaxHealthPointsTool
      key={`${id}-maxhitpoints-tool`}
      name={name}
      id={id}
      healthPoints={healthPoints}
      addHealthToCreature={addHealthToCreature}
    />,
    <TemporaryHealthPointsTool
      key={`${id}-temphitpoints-tool`}
      name={name}
      id={id}
    />,
  ];
}

function CreatureToolbar({
  creature,
  conditions,
  creatureManagement,
  focused,
}) {
  const [page, setPage] = useState(1);
  const statusToolRef = useRef(null);
  const isPageOne = page === 1;
  const isPageTwo = page === 2;

  useLayoutEffect(() => {
    if (focused) {
      statusToolRef.current.focus();
    }
  }, [focused]);

  return (
    <div className="creature-toolbar">
      {isPageOne && toolsPageOne({
        creature,
        conditions,
        creatureManagement,
        statusToolRef,
        navFunc: () => setPage(2),
      })}
      {isPageTwo && toolsPageTwo({
        creature,
        conditions,
        creatureManagement,
        navFunc: () => setPage(1),
      })}
    </div>
  );
}

export default CreatureToolbar;
