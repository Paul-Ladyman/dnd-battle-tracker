import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import InitiativeIcon from '../../icons/InitiativeIcon';

export default function InitiativeTool({
  name,
  id,
  initiative,
  addInitiativeToCreature,
  showIfNoInitiative = false,
}) {
  const enabled = initiative === undefined || initiative === null;
  const showTool = showIfNoInitiative || enabled;
  return showTool && (
    <CreatureToolbarInput
      customClasses="creature-toolbar--last"
      integer
      ariaLabel={`add initiative to ${name}`}
      label="Initiative"
      rightSubmit={(initiativeInput) => addInitiativeToCreature(id, initiativeInput)}
      rightControls={{
        rightTitle: 'Add Initiative',
        rightEnabled: enabled,
        RightSubmitIcon: <InitiativeIcon />,
      }}
      inputId={`initiative-${id}`}
    />
  );
}
