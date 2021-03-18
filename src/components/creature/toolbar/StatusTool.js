import React from 'react';
import StabalizeIcon from '../../icons/StabalizeIcon';
import KillIcon from '../../icons/KillIcon';

export default function StatusTool({
  name,
  id,
  statusToolRef,
  alive,
  killCreature,
  stabalizeCreature,
}) {
  const statusToolFunc = alive ? killCreature : stabalizeCreature;
  const statusToolTitle = alive ? 'Kill/Make unconscious' : 'Stabalize';
  const statusToolIcon = alive ? <KillIcon /> : <StabalizeIcon />;
  const statusToolClass = 'creature-toolbar--button';

  const statusToolClasses = alive ? statusToolClass : `${statusToolClass} ${statusToolClass}__dead`;

  return (
    <button
      className={statusToolClasses}
      aria-label={`${statusToolTitle} ${name}`}
      title={statusToolTitle}
      onClick={() => statusToolFunc(id)}
      type="button"
      ref={statusToolRef}
    >
      {statusToolIcon}
    </button>
  );
}
