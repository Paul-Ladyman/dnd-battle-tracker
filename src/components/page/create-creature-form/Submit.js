import React from 'react';
import CrossIcon from '../../icons/CrossIcon';

export default function Submit({
  createCreature,
}) {
  return (
    <div className="create-creature-form--item__submit">
      <button
        type="button"
        className="create-creature-form--submit"
        title="Add creature"
        aria-label="Add creature"
        onClick={createCreature}
      >
        <CrossIcon />
      </button>
    </div>
  );
}
