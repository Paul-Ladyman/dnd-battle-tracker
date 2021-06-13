import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import AddHpIcon from '../../icons/AddHpIcon';

export default function MaxHealthPointsTool({
  name,
  id,
  addHealthToCreature,
}) {
  return (
    <CreatureToolbarInput
      integer
      name="creature-toolbar-maxhp"
      min={1}
      ariaLabel={`add/edit max hp ${name}`}
      label="Max HP"
      rightSubmit={(health) => addHealthToCreature(id, health)}
      rightControls={{
        rightTitle: 'Add/Edit Max HP',
        RightSubmitIcon: <AddHpIcon />,
      }}
      inputId={`max-health-${id}`}
    />
  );
}
