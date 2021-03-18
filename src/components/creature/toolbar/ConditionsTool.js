import React from 'react';

export default function ConditionsTool({
  name,
  id,
  conditions,
  addNoteToCreature,
}) {
  const conditionsClasses = 'form--input creature-toolbar--select creature-toolbar--dropdown';
  const conditionsId = `conditions-${id}`;
  const enableConditions = conditions.length > 0;
  return (
    <div className="creature-toolbar--dropdown">
      <label htmlFor={conditionsId} aria-label={`add condition to ${name}`}>
        <div className="form--label">Add Condition</div>
        <select
          id={conditionsId}
          className={conditionsClasses}
          disabled={!enableConditions}
          value=""
          name="creature-toolbar-conditions"
          onChange={(event) => addNoteToCreature(id, event.target.value, true)}
        >
          <option>--</option>
          {conditions.map((condition) => (
            <option key={`${conditionsId}-${condition}`} value={condition}>
              {condition}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
