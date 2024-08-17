import React from 'react';
import StartBattleIcon from '../icons/StartBattleIcon';

export default function Welcome() {
  return (
    <div className="welcome">
      <p>
        The initiative order will be displayed here.
        {' '}
        Add some creatures above and hit
        {' '}
        <StartBattleIcon />
        {' '}
        to start combat!
      </p>
    </div>
  );
}
