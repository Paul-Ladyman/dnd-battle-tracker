import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import TempHpIcon from '../../icons/TempHpIcon';

export default function TemporaryHealthPointsTool({
  name,
  id,
  healthPoints,
  addTemporaryHealthToCreature,
}) {
  return healthPoints !== undefined && (
    <CreatureToolbarInput
      integer
      name="creature-toolbar-temphp"
      min={1}
      ariaLabel={`add/edit temp hp ${name}`}
      label="Temp HP"
      rightSubmit={(health) => addTemporaryHealthToCreature(id, health)}
      rightControls={{
        rightTitle: 'Add/Edit Temp HP',
        RightSubmitIcon: <TempHpIcon />,
      }}
      inputId={`temp-health-${id}`}
    />
  );
}
