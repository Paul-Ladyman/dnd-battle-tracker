import React from 'react';
import conditionsData from '../../../../domain/conditions';

export default function ConditionsTool({
  id,
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
        {Object.values(conditionsData).map((condition) => {
          const { text, id: conditionId } = condition;
          const activeCondition = creatureConditions.find(
            (creatureCondition) => creatureCondition.text === text,
          );
          return (
            <li className="condition" key={`${conditionsId}-${conditionId}`}>
              <div
                role="checkbox"
                aria-checked={activeCondition ? 'true' : 'false'}
                tabIndex={0}
                onClick={() => selectCondition(id, text, activeCondition)}
                onKeyDown={onKeyDown(id, text, activeCondition)}
              >
                {text}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
