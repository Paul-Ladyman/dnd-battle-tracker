import React from 'react';
import CrossIcon from '../icons/CrossIcon';

export default function Errors({ errors, dismissErrors }) {
  return (
    <div className="error-bar" role="alert">
      <div className="error-bar--errors">
        {errors.map((error, i) => {
          const isLast = i === errors.length - 1;
          const classes = isLast ? 'error-bar--error error-bar--error__last' : 'error-bar--error';
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div className={classes} key={`error-${i}`}>
              {error.message || error}
            </div>
          );
        })}
      </div>
      <button
        className="error-bar--dismiss"
        title="Dismiss errors"
        aria-label="Dismiss errors"
        onClick={dismissErrors}
        type="button"
      >
        <CrossIcon fill="black" rotate />
      </button>
    </div>
  );
}
