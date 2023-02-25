import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import InitiativeIcon from '../../icons/InitiativeIcon';

export default function InitiativeTool({
  name,
  id,
  initiative,
  addInitiativeToCreature,
}) {
  return initiative === null && (
    <CreatureToolbarInput
      customClasses="creature-toolbar--last"
      integer
      ariaLabel={`add initiative to ${name}`}
      label="Initiative"
      rightSubmit={(initiativeInput) => addInitiativeToCreature(id, initiativeInput)}
      rightControls={{
        rightTitle: 'Initiative',
        RightSubmitIcon: <InitiativeIcon />,
      }}
      inputId={`initiative-${id}`}
    />
  );
}
