import React from 'react';

function BattleToolbar({round, secondsElapsed, combatants, nextCreature, resetBattle}) {
  const minutesElapsed = Math.floor(parseFloat(secondsElapsed) / 60.0);
  const remainingSecondsElapsed = secondsElapsed % 60;
  return (
    <div>
      <button onClick={nextCreature}>Next</button>
      <div>Combatants: {combatants}</div>
      <div> Round: {round}</div>
      <div>Time Elapsed: {minutesElapsed}m {remainingSecondsElapsed}s</div>
      <button onClick={resetBattle}>Reset</button>
    </div>
  );
}

export default BattleToolbar;