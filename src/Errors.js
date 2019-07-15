import React from 'react';
import RemoveIcon from './icons/RemoveIcon';

export default function Errors({ errors }) {
  return (
    <div className="errors">
      {errors.map((error, i) => {
        return (
          <div className="error" key={`error-${i}`}>
            {error}
            <button className="error--button" title="Dismiss error">
              <RemoveIcon fill="black" />
            </button>
          </div>
        );
      })}
    </div>
  );
}