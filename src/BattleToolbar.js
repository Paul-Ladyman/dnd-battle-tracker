import React from 'react';
import Timer from './Timer';
import StartBattleIcon from './icons/StartBattleIcon';
import NextInitiativeIcon from './icons/NextInitiativeIcon';
import ResetIcon from './icons/ResetIcon';

function BattleToolbar({
  initiative,
  round,
  secondsElapsed,
  combatants,
  nextInitiative,
  resetBattle
}) {
  const buttonClass = 'battle-toolbar--button';
  const buttonClasses = combatants > 0 ? buttonClass : `${buttonClass} ${buttonClass}__disabled`;
  const nextButtonLabel = round === 0 ? <StartBattleIcon /> : <NextInitiativeIcon />;
  const nextButtonTitle = round === 0 ? 'Start battle' : 'Next initiative';
  return (
    <div className="battle-toolbar">
      <button title={nextButtonTitle} className={buttonClasses} onClick={nextInitiative}>{nextButtonLabel}</button>
      <div className="battle-toolbar--stat">
        Initiative:
        <div className="battle-toolbar--stat-value">{initiative}</div>
      </div>
      <div className="battle-toolbar--stat battle-toolbar--stat__extra2">
        Combatants:
        <div className="battle-toolbar--stat-value">{combatants}</div>
      </div>
      <div className="battle-toolbar--stat battle-toolbar--stat__extra1">
        Round:
        <div className="battle-toolbar--stat-value">{round}</div>
      </div>
      <div className="battle-toolbar--stat battle-toolbar--stat__extra2">
        Time Elapsed:
        <Timer startTime={secondsElapsed} className="battle-toolbar--stat-value" />
      </div>
      <button title="Reset" className={`${buttonClasses} battle-toolbar--button__reset`} onClick={resetBattle}><ResetIcon /></button>
    </div>
  );
}

export default BattleToolbar;