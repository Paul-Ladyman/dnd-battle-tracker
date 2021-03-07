import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import AddHpIcon from '../../icons/AddHpIcon';

export default function TemporaryHealthPointsTool({
  name,
  id,
}) {
  return (
    <CreatureToolbarInput
      integer
      name="creature-toolbar-temphp"
      min={1}
      ariaLabel={`add temp hp ${name}`}
      label="Add Temp HP"
      rightSubmit={(health) => console.log(health)}
      rightControls={{
        rightTitle: 'Add Temp HP',
        RightSubmitIcon: <AddHpIcon />,
      }}
      inputId={`temp-health-${id}`}
    />
  );
}
