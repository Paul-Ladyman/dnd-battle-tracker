import React from 'react';
import { isCreatureStable } from '../../state/CreatureManager';

export default function CreatureStatus({ creature, shared }) {
  const { alive } = creature;
  const stable = isCreatureStable(creature);
  const dyingMessage = alive ? [] : ['Dying/dead'];
  const stableMessage = stable ? ['Stable'] : [];
  const sharedMessage = shared ? [] : ['Not shared'];
  const messages = dyingMessage.concat(stableMessage, sharedMessage);
  const renderStatus = messages.length > 0;

  return (renderStatus && (
    <div className="expanded-creature--status">
      <em>{messages.join(', ')}</em>
    </div>
  ));
}
