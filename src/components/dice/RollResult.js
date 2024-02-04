import React from 'react';

function Terms({ terms }) {
  if (terms.length === 1 && terms.findIndex(({ type }) => type === 'dice') === -1) return null;

  return (
    <>
      {' '}
      (
      {terms.map((term) => {
        switch (term.type) {
          case 'operator': return ` ${term.term} `;
          case 'dice': return `[${term.rolls.join(' + ')}]`;
          default: return term.term;
        }
      })}
      )
    </>
  );
}

export default function RollResult({ roll }) {
  if (!Number.isInteger(roll?.result)) return null;
  return <Terms terms={roll.terms} />;
}
