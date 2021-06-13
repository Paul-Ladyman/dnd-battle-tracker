import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import AddHpIcon from '../../icons/AddHpIcon';

export default function MaxHitPointsTool({
  name,
  id,
  addHitPointsToCreature,
}) {
  return (
    <CreatureToolbarInput
      integer
      name="creature-toolbar-maxhp"
      min={1}
      ariaLabel={`add/edit max hp ${name}`}
      label="Max HP"
      rightSubmit={(hitPoints) => addHitPointsToCreature(id, hitPoints)}
      rightControls={{
        rightTitle: 'Add/Edit Max HP',
        RightSubmitIcon: <AddHpIcon />,
      }}
      inputId={`max-hp-${id}`}
    />
  );
}
