import React from 'react';
import KillStabalizeIcon from '../../icons/KillStabalizeIcon';

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
      <KillStabalizeIcon alive={alive} />
    </button>
  );
}
