import React from 'react';
import CrossIcon from '../../icons/CrossIcon';

export default function Submit() {
  return (
    <div className="create-creature-form--item__submit">
      <button
        type="submit"
        className="create-creature-form--submit"
        title="Add creature"
        aria-label="Add creature"
      >
        <CrossIcon />
      </button>
    </div>
  );
}
