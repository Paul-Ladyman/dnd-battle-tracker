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
    alive, healthPoints, maxHealthPoints, temporaryHealthPoints, id, name, initiative,
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
      temporaryHealthPoints={temporaryHealthPoints}
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
  navRef,
  navFunc,
}) {
  const {
    addHealthToCreature,
    addTemporaryHealthToCreature,
  } = creatureManagement;
  const {
    id, name, healthPoints,
  } = creature;

  return [
    <NavigationTool
      key={`${id}-navigation-2-tool`}
      name={name}
      navRef={navRef}
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
      healthPoints={healthPoints}
      addTemporaryHealthToCreature={addTemporaryHealthToCreature}
    />,
  ];
}

function CreatureToolbar({
  creature,
  conditions,
  creatureManagement,
  focused,
}) {
  const [page, setPage] = useState(null);
  const statusToolRef = useRef(null);
  const navRef = useRef(null);
  const toolbarClass = 'creature-toolbar';
  const classes = page ? `${toolbarClass} creature-toolbar__page-${page}` : toolbarClass;
  const isPageOne = page === null || page === 1;
  const isPageTwo = page === 2;

  useLayoutEffect(() => {
    if (focused) {
      if (isPageOne) statusToolRef.current.focus();
      if (isPageTwo) navRef.current.focus();
    }
  }, [focused]);

  useLayoutEffect(() => {
    if (page === 1) statusToolRef.current.focus();
    if (isPageTwo) navRef.current.focus();
  }, [page]);

  return (
    <div className={classes}>
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
        navRef,
        navFunc: () => setPage(1),
      })}
    </div>
  );
}

export default CreatureToolbar;
