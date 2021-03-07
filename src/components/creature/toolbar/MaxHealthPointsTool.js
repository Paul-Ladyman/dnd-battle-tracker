import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import AddHpIcon from '../../icons/AddHpIcon';

export default function MaxHealthPointsTool({
  name,
  id,
  healthPoints,
  addHealthToCreature,
}) {
  return healthPoints === undefined && (
    <CreatureToolbarInput
      integer
      name="creature-toolbar-maxhp"
      min={1}
      ariaLabel={`add max hp ${name}`}
      label="Add Max HP"
      rightSubmit={(health) => addHealthToCreature(id, health)}
      rightControls={{
        rightTitle: 'Add Max HP',
        RightSubmitIcon: <AddHpIcon />,
      }}
      inputId={`max-health-${id}`}
    />
  );
}
