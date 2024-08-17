import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import CrossIcon from '../../../icons/CrossIcon';

export default function TieBreakerTool({
  active,
  name,
  id,
  addTieBreakerToCreature,
}) {
  return (
    <CreatureToolbarInput
      customClasses="creature-toolbar--last"
      integer
      ariaLabel={`add initiative to ${name}`}
      label="Tie Breaker"
      rightSubmit={(tieBreaker) => addTieBreakerToCreature(id, tieBreaker)}
      rightControls={{
        rightTitle: 'Add Tie Breaker',
        rightEnabled: !active,
        RightSubmitIcon: <CrossIcon />,
      }}
      inputId={`tie-breaker-${id}`}
    />
  );
}
