import React, { useState } from 'react';
import RemoveCreatureIcon from './icons/RemoveCreatureIcon';
import ConfirmRemoveCreatureIcon from './icons/ConfirmRemoveCreatureIcon';

export default function CreatureRemover({
  playerSession,
  active,
  creature,
  removeCreature,
}) {
  const [removing, setRemoving] = useState(false);
  const { name, id } = creature;

  return (
    <>
      {!playerSession && !active && !removing
      && (
      <button
        aria-label={`remove ${name}`}
        title="Remove creature"
        className="expanded-creature--remove-button"
        onClick={() => setRemoving(true)}
        type="button"
      >
        <RemoveCreatureIcon />
      </button>
      )}
      {!playerSession && !active && removing
      && (
      <button
        aria-label={`confirm remove ${creature.name}`}
        title="Confirm remove creature"
        className="expanded-creature--confirm-remove-button"
        onClick={() => removeCreature(id)}
        type="button"
      >
        <ConfirmRemoveCreatureIcon />
      </button>
      )}
    </>
  );
}
