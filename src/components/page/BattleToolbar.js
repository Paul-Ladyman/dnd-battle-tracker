import React, { useRef } from 'react';
import Timer from './Timer';
import StartBattleIcon from '../icons/StartBattleIcon';
import PageNavigationIcon from '../icons/PageNavigationIcon';
import BattleMenu from './battle-toolbar/BattleMenu';
import CheckedIcon from '../icons/CheckedIcon';

function BattleToolbar({
  initiative,
  round,
  secondsElapsed,
  creatureCount,
  nextInitiative,
  playerSession,
  shareEnabled,
  rulesSearchOpen,
  toggleRulesSearch,
  onScrollActiveInitiative,
  selectedCreatureCount,
  unselectAll,
}) {
  const nextButton = useRef(null);
  const selectedCreatures = selectedCreatureCount > 0;
  const round0 = round === 0;
  const currentTurnLabel = round0 ? '...' : initiative;
  const buttonClass = 'battle-toolbar--button';
  const creaturesAdded = creatureCount > 0;
  const buttonClasses = creaturesAdded ? buttonClass : `${buttonClass} button__disabled`;
  const nextButtonLabel = round0 ? <StartBattleIcon /> : <PageNavigationIcon />;
  const nextButtonTitle = round0 ? 'Start battle' : 'Next turn';
  const currentTurnDefaultClasses = 'battle-toolbar--stat-value battle-toolbar--stat-value__button';
  const currentTurnClasses = round0 ? `${currentTurnDefaultClasses} battle-toolbar--stat-value__button-disabled` : `${currentTurnDefaultClasses} battle-toolbar--stat-value__button-enabled`;

  const nextOnClick = () => {
    if (creaturesAdded) nextInitiative();
  };

  const turnOnClick = () => {
    if (!round0) onScrollActiveInitiative();
  };

  return (
    <header className="battle-toolbar">
      <BattleMenu
        playerSession={playerSession}
        shareEnabled={shareEnabled}
        rulesSearchOpen={rulesSearchOpen}
        toggleRulesSearch={toggleRulesSearch}
      />
      {!selectedCreatures && (
        <section aria-label="turn" className="battle-toolbar--stat">
          Turn:
          <button
            type="button"
            onClick={turnOnClick}
            className={currentTurnClasses}
            title="Current Turn"
            aria-label={currentTurnLabel}
            aria-disabled={round0}
          >
            {currentTurnLabel}
          </button>
        </section>
      )}
      {!selectedCreatures && (
        <section aria-label="creatures" className="battle-toolbar--stat battle-toolbar--stat__extra2">
          Creatures:
          <div className="battle-toolbar--stat-value">{creatureCount}</div>
        </section>
      )}
      {!selectedCreatures && (
        <section aria-label="round" className="battle-toolbar--stat battle-toolbar--stat__extra1">
          Round:
          <div className="battle-toolbar--stat-value">{round}</div>
        </section>
      )}
      {!selectedCreatures && (
        <section aria-label="time elapsed" className="battle-toolbar--stat battle-toolbar--stat__extra2">
          Time Elapsed:
          <Timer startTime={secondsElapsed} className="battle-toolbar--stat-value" />
        </section>
      )}
      {selectedCreatures && (
        <section aria-label="selected creatures" className="battle-toolbar--stat battle-toolbar--stat__wide">
          Selected Creatures:
          <div className="battle-toolbar--stat-value">{selectedCreatureCount}</div>
        </section>
      )}
      {!playerSession && !selectedCreatures && (
        <button
          title={nextButtonTitle}
          className={buttonClasses}
          onClick={nextOnClick}
          ref={nextButton}
          aria-disabled={!creaturesAdded}
          type="button"
        >
          {nextButtonLabel}
        </button>
      )}
      {selectedCreatures && (
        <button
          title="Unselect all"
          aria-label="Unselect all"
          className={buttonClasses}
          onClick={unselectAll}
          type="button"
        >
          <CheckedIcon />
        </button>
      )}
    </header>
  );
}

export default BattleToolbar;
