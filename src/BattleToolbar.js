import React from 'react';

function BattleToolbar({round, secondsElapsed, combatants, nextCreature, resetBattle}) {
  const minutesElapsed = Math.floor(parseFloat(secondsElapsed) / 60.0);
  const remainingSecondsElapsed = secondsElapsed % 60;
  return (
    <div className="battle-toolbar">
      <button className="battle-toolbar--button" onClick={nextCreature}>>></button>
      <div className="battle-toolbar--stat">
        Combatants:
        <div className="battle-toolbar--stat-value">{combatants}</div>
      </div>
      <div className="battle-toolbar--stat">
        Round:
        <div className="battle-toolbar--stat-value">{round}</div>
      </div>
      <div className="battle-toolbar--stat">
        Time Elapsed:
        <div className="battle-toolbar--stat-value">{minutesElapsed}m {remainingSecondsElapsed}s</div>
      </div>
      <button className="battle-toolbar--button" onClick={resetBattle}>Reset</button>
    </div>
  );
}

export default BattleToolbar;