import React from 'react';
import RemoveIcon from './icons/RemoveIcon';

export default function Errors({ errors }) {
  return (
    <div className="error-bar">
      <div className="error-bar--errors">
        {errors.map((error, i) => {
          const isLast = i === errors.length - 1;
          const classes = isLast ? 'error-bar--error error-bar--error__last' : 'error-bar--error'
          return (
            <div className={classes} key={`error-${i}`}>
              {error}
            </div>
          );
        })}
      </div>
      <button className="error-bar--dismiss" title="Dismiss errors">
        <RemoveIcon fill="black" />
      </button>
    </div>
  );
}