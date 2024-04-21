import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import CrossIcon from '../../../icons/CrossIcon';

export default function InitiativeTool({
  active,
  name,
  id,
  addInitiativeToCreature,
}) {
  return (
    <CreatureToolbarInput
      customClasses="creature-toolbar--last"
      integer
      ariaLabel={`add initiative to ${name}`}
      label="Initiative"
      rightSubmit={(initiativeInput) => addInitiativeToCreature(id, initiativeInput)}
      rightControls={{
        rightTitle: 'Add Initiative',
        rightEnabled: !active,
        RightSubmitIcon: <CrossIcon />,
      }}
      inputId={`initiative-${id}`}
    />
  );
}
