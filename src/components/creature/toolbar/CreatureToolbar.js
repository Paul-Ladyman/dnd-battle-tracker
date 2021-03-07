import React, { useRef, useLayoutEffect } from 'react';
import StatusTool from './StatusTool';
import HealthPointsTool from './HealthPointsTool';
import MaxHealthPointsTool from './MaxHealthPointsTool';
import InitiativeTool from './InitiativeTool';
import ConditionsTool from './ConditionsTool';
import NotesTool from './NotesTool';

function toolsPageOne({
  creatureManagement,
  creature,
  conditions,
  statusToolRef,
}) {
  const {
    killCreature,
    stabalizeCreature,
    damageCreature,
    healCreature,
    addNoteToCreature,
    addHealthToCreature,
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
    <MaxHealthPointsTool
      key={`${id}-maxhitpoints-tool`}
      name={name}
      id={id}
      healthPoints={healthPoints}
      addHealthToCreature={addHealthToCreature}
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
  ];
}

function CreatureToolbar({
  creature,
  conditions,
  creatureManagement,
  focused,
}) {
  const statusToolRef = useRef(null);

  useLayoutEffect(() => {
    if (focused) {
      statusToolRef.current.focus();
    }
  }, [focused]);

  return (
    <div className="creature-toolbar">
      {toolsPageOne({
        creature,
        conditions,
        creatureManagement,
        statusToolRef,
      })}
    </div>
  );
}

export default CreatureToolbar;
