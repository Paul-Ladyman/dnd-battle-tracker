import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import CrossIcon from '../../../icons/CrossIcon';

export default function MaxHitPointsTool({
  name,
  id,
  addArmorClassToCreature,
}) {
  return (
    <CreatureToolbarInput
      integer
      name="creature-toolbar-ac"
      min={1}
      ariaLabel={`add/edit AC ${name}`}
      label="Armor Class"
      rightSubmit={(hitPoints) => addArmorClassToCreature(id, hitPoints)}
      rightControls={{
        rightTitle: 'Add/Edit AC',
        RightSubmitIcon: <CrossIcon />,
      }}
      inputId={`ac-${id}`}
    />
  );
}
