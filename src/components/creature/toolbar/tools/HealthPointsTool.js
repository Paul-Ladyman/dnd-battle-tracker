import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import CrossIcon from '../../../icons/CrossIcon';
import MinusIcon from '../../../icons/MinusIcon';
import { hotkeys } from '../../../../hotkeys/hotkeys';

export default function HealthPointsTool({
  name,
  id,
  healthPoints,
  maxHealthPoints,
  temporaryHealthPoints,
  damageCreature,
  healCreature,
  showIfNoHp = false,
}) {
  const enableHealthTool = showIfNoHp || (healthPoints !== undefined && healthPoints !== null);
  const enableDamage = healthPoints > 0 || temporaryHealthPoints > 0;
  const enableHeal = healthPoints < maxHealthPoints;

  return enableHealthTool && (
    <CreatureToolbarInput
      integer
      min={1}
      enabled={enableDamage}
      ariaLabel={`damage or heal ${name}`}
      label="Damage/Heal"
      leftSubmit={(damage) => damageCreature(id, damage)}
      leftHotkey={hotkeys.damageCreature}
      leftControls={{
        leftTitle: 'Damage',
        leftEnabled: enableDamage,
        LeftSubmitIcon: <MinusIcon />,
      }}
      rightSubmit={(health) => healCreature(id, health)}
      rightHotkey={hotkeys.healCreature}
      rightControls={{
        rightTitle: 'Heal',
        rightEnabled: enableHeal,
        RightSubmitIcon: <CrossIcon />,
      }}
      inputId={`damage-${id}`}
    />
  );
}
