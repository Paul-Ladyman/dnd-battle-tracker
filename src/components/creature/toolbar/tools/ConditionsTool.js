import React from 'react';

export default function ConditionsTool({
  id,
  conditions,
  creatureConditions,
  addNoteToCreature,
  removeNoteFromCreature,
  toolMenuId,
}) {
  const conditionsId = `conditions-${id}`;

  const selectCondition = (creatureId, condition, activeCondition) => {
    if (activeCondition) removeNoteFromCreature(creatureId, activeCondition, true);
    else addNoteToCreature(creatureId, condition, true);
  };

  const onKeyDown = (creatureId, condition, active) => (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      selectCondition(creatureId, condition, active);
    }
  };

  const labelledBy = `${toolMenuId}-conditions`;

  return (
    <div role="group" aria-labelledby={labelledBy}>
      <ul className="conditions">
        {conditions.map((condition) => {
          const activeCondition = creatureConditions.find(
            (creatureCondition) => creatureCondition.text === condition,
          );
          return (
            <li className="condition" key={`${conditionsId}-${condition}`}>
              <div
                role="checkbox"
                aria-checked={activeCondition ? 'true' : 'false'}
                tabIndex={0}
                onClick={() => selectCondition(id, condition, activeCondition)}
                onKeyDown={onKeyDown(id, condition, activeCondition)}
              >
                {condition}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
