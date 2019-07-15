import React from 'react';

export default function Errors({ errors }) {
  return (
    <div className="errors">
      {errors.map((error, i) => {
        return (
          <div className="error" key={`error-${i}`}>{error}</div>
        );
      })}
    </div>
  );
}