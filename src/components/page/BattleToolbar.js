import React, { useEffect, useRef, useState } from 'react';
import isHotkey from 'is-hotkey';
import Timer from './Timer';
import StartBattleIcon from '../icons/StartBattleIcon';
import NextInitiativeIcon from '../icons/NextInitiativeIcon';
import OptionsMenuIcon from '../icons/OptionsMenuIcon';
import SaveLoadIcon from '../icons/SaveLoadIcon';
import ResetIcon from '../icons/ResetIcon';
import ShareIcon from '../icons/ShareIcon';
import RulesSearchMenuIcon from '../icons/RulesSearchMenuIcon';
import { hotkeys } from '../../hotkeys/hotkeys';
import { isSaveLoadSupported } from '../../state/AppManager';

function ResetButton({
  className,
  toggleOptions,
  resetBattle,
  creaturesAdded,
}) {
  return (
    <button
      title="Reset Battle"
      className={className}
      onClick={() => { toggleOptions(); resetBattle(); }}
      disabled={!creaturesAdded}
      type="button"
    >
      <ResetIcon />
    </button>
  );
}

function ShareButton({
  shareEnabled,
  className,
  toggleOptions,
  toggleShare,
}) {
  const title = shareEnabled ? 'Disable share' : 'Enable share';
  return (
    <button
      title={title}
      className={className}
      onClick={() => { toggleOptions(); toggleShare(); }}
      type="button"
    >
      <ShareIcon enabled={shareEnabled} />
    </button>
  );
}

function RulesSearchButton({
  rulesSearchOpen,
  inMenu,
  className,
  toggleOptions,
  toggleRulesSearch,
}) {
  const title = rulesSearchOpen ? 'Close rules search bar' : 'Open rules search bar';
  const onClick = () => {
    if (inMenu) {
      toggleOptions();
    }
    toggleRulesSearch();
  };
  return (
    <button
      title={title}
      className={className}
      onClick={onClick}
      type="button"
    >
      <RulesSearchMenuIcon opened={rulesSearchOpen} />
    </button>
  );
}

function BattleToolbar({
  initiative,
  round,
  secondsElapsed,
  creatureCount,
  nextInitiative,
  resetBattle,
  saveBattle,
  loadBattle,
  playerSession,
  shareEnabled,
  toggleShare,
  rulesSearchOpen,
  toggleRulesSearch,
  onScrollActiveInitiative,
}) {
  const [optionsExpanded, setOptionsExpanded] = useState(false);
  const nextButton = useRef(null);
  const optionsButton = useRef(null);
  const fileSelector = useRef(null);

  const hotKeyHandler = (e) => {
    if (!playerSession && isHotkey(hotkeys.battlebar, e)) {
      const { disabled: nextButtonDisabled } = nextButton.current.attributes;
      if (nextButtonDisabled) {
        optionsButton.current.focus();
      } else {
        nextButton.current.focus();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', hotKeyHandler);
    return () => window.removeEventListener('keydown', hotKeyHandler);
  }, []);

  const handleUpload = () => {
    const file = fileSelector.current.files[0];
    loadBattle(file);
  };

  const toggleOptions = () => {
    setOptionsExpanded((prevOptionsExpanded) => !prevOptionsExpanded);
  };

  const showSaveLoadButtons = isSaveLoadSupported();

  const round0 = round === 0;
  const buttonClass = 'battle-toolbar--button';
  const creaturesAdded = creatureCount > 0;
  const buttonClasses = creaturesAdded ? buttonClass : `${buttonClass} button__disabled`;
  const resetButtonClasses = `${buttonClasses} ${buttonClass}__option`;
  const shareButtonClasses = `${buttonClass} ${buttonClass}__option`;
  const rulesSearchButtonClasses = showSaveLoadButtons ? `${buttonClass} ${buttonClass}__option` : buttonClass;
  const nextButtonLabel = round0 ? <StartBattleIcon /> : <NextInitiativeIcon />;
  const nextButtonTitle = round0 ? 'Start battle' : 'Next initiative';
  const optionsClass = optionsExpanded ? 'battle-toolbar--options-dropdown' : 'hidden';
  const currentTurnDefaultClasses = 'battle-toolbar--stat-value battle-toolbar--stat-value__button';
  const currentTurnClasses = round0 ? `${currentTurnDefaultClasses} battle-toolbar--stat-value__button-disabled` : `${currentTurnDefaultClasses} battle-toolbar--stat-value__button-enabled`;

  return (
    <header className="battle-toolbar">
      {!playerSession && (
      <button
        title={nextButtonTitle}
        className={buttonClasses}
        onClick={nextInitiative}
        ref={nextButton}
        disabled={!creaturesAdded}
        type="button"
      >
        {nextButtonLabel}
      </button>
      )}
      <div className="battle-toolbar--stat">
        Initiative:
        <button
          type="button"
          onClick={onScrollActiveInitiative}
          className={currentTurnClasses}
          title="Current Turn"
          aria-label="Current Turn"
          disabled={round0}
        >
          {round0 ? '...' : initiative}
        </button>
      </div>
      <div className="battle-toolbar--stat battle-toolbar--stat__extra2">
        Creatures:
        <div className="battle-toolbar--stat-value">{creatureCount}</div>
      </div>
      <div className="battle-toolbar--stat battle-toolbar--stat__extra1">
        Round:
        <div className="battle-toolbar--stat-value">{round}</div>
      </div>
      <div className="battle-toolbar--stat battle-toolbar--stat__extra2">
        Time Elapsed:
        <Timer startTime={secondsElapsed} className="battle-toolbar--stat-value" />
      </div>
      { !playerSession && (
        <div className="battle-toolbar--options-container">
          <button
            title="Options Menu"
            className={buttonClass}
            onClick={toggleOptions}
            ref={optionsButton}
            type="button"
          >
            <OptionsMenuIcon open={optionsExpanded} />
          </button>
          <div className={optionsClass}>
            {showSaveLoadButtons && (
              <>
                <button
                  title="Save Battle"
                  className={buttonClass}
                  onClick={() => { toggleOptions(); saveBattle(); }}
                  type="button"
                >
                  <SaveLoadIcon />
                </button>
                <input
                  type="file"
                  className="hidden"
                  accept="application/json"
                  ref={fileSelector}
                  onChange={() => handleUpload(loadBattle)}
                  value=""
                />
                <button
                  title="Load Battle"
                  className={`${buttonClass} ${buttonClass}__option`}
                  onClick={() => { toggleOptions(); fileSelector.current.click(); }}
                  type="button"
                >
                  <SaveLoadIcon load />
                </button>
              </>
            )}
            <ShareButton
              shareEnabled={shareEnabled}
              className={shareButtonClasses}
              toggleOptions={toggleOptions}
              toggleShare={toggleShare}
            />
            <RulesSearchButton
              rulesSearchOpen={rulesSearchOpen}
              inMenu
              className={rulesSearchButtonClasses}
              toggleOptions={toggleOptions}
              toggleRulesSearch={toggleRulesSearch}
            />
            <ResetButton
              className={resetButtonClasses}
              toggleOptions={toggleOptions}
              resetBattle={resetBattle}
              creaturesAdded={creaturesAdded}
            />
          </div>
        </div>
      )}
      { playerSession && (
        <RulesSearchButton
          rulesSearchOpen={rulesSearchOpen}
          toggleRulesSearch={toggleRulesSearch}
        />
      )}
    </header>
  );
}

export default BattleToolbar;
