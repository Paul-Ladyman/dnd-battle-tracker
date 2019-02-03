import React from 'react';
import Timer from './Timer';

function BattleToolbar({initiative, round, secondsElapsed, combatants, nextButtonLabel, nextButtonFunc, resetBattle}) {
  return (
    <div className="battle-toolbar">
      <button className="battle-toolbar--button" onClick={nextButtonFunc}>{nextButtonLabel}</button>
      <div className="battle-toolbar--stat">
        Initiative:
        <div className="battle-toolbar--stat-value">{initiative}</div>
      </div>
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
        <Timer startTime={secondsElapsed} className="battle-toolbar--stat-value" />
      </div>
      <button className="battle-toolbar--button" onClick={resetBattle}>Reset</button>
    </div>
  );
}

export default BattleToolbar;