import React from 'react';
import KillStabalizeIcon from '../../icons/KillStabalizeIcon';

export default function StatusTool({
  name,
  id,
  statusToolRef,
  alive,
  killCreature,
  stabalizeCreature,
  classes,
}) {
  const statusToolFunc = alive ? killCreature : stabalizeCreature;
  const statusToolTitle = alive ? 'Kill/Make unconscious' : 'Stabalize';
  const statusToolClass = 'creature-toolbar--button';

  const statusToolClasses = alive ? statusToolClass : `${statusToolClass} ${statusToolClass}__dead`;
  const finalClasses = `${statusToolClasses} ${classes}`;

  return (
    <button
      className={finalClasses}
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
