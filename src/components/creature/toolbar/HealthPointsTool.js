import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import HealIcon from '../../icons/HealIcon';
import DamageIcon from '../../icons/DamageIcon';
import { hotkeys } from '../../../hotkeys/hotkeys';

export default function HealthPointsTool({
  name,
  id,
  healthPoints,
  maxHealthPoints,
  temporaryHealthPoints,
  damageCreature,
  healCreature,
}) {
  const enableHealthTool = healthPoints !== undefined && healthPoints !== null;
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
        LeftSubmitIcon: <DamageIcon />,
      }}
      rightSubmit={(health) => healCreature(id, health)}
      rightHotkey={hotkeys.healCreature}
      rightControls={{
        rightTitle: 'Heal',
        rightEnabled: enableHeal,
        RightSubmitIcon: <HealIcon />,
      }}
      inputId={`damage-${id}`}
    />
  );
}
