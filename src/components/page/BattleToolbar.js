import React, { useEffect, useRef, useState } from 'react';
import isHotkey from 'is-hotkey';
import Timer from './Timer';
import StartBattleIcon from '../icons/StartBattleIcon';
import NextInitiativeIcon from '../icons/NextInitiativeIcon';
import OptionsMenuIcon from '../icons/OptionsMenuIcon';
import SaveLoadIcon from '../icons/SaveLoadIcon';
import ResetIcon from '../icons/ResetIcon';
import ShareEnabledIcon from '../icons/ShareEnabledIcon';
import ShareDisabledIcon from '../icons/ShareDisabledIcon';
import { hotkeys } from '../../hotkeys/hotkeys';
import { isSaveLoadSupported } from '../../state/AppManager';

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

  const buttonClass = 'battle-toolbar--button';
  const creaturesAdded = creatureCount > 0;
  const buttonClasses = creaturesAdded ? buttonClass : `${buttonClass} button__disabled`;
  const nextButtonLabel = round === 0 ? <StartBattleIcon /> : <NextInitiativeIcon />;
  const nextButtonTitle = round === 0 ? 'Start battle' : 'Next initiative';
  const optionsClass = optionsExpanded ? 'battle-toolbar--options-dropdown' : 'hidden';

  const ResetButton = () => (
    <button
      title="Reset Battle"
      className={`${buttonClasses} ${buttonClass}__option`}
      onClick={() => { toggleOptions(); resetBattle(); }}
      disabled={!creaturesAdded}
      type="button"
    >
      <ResetIcon />
    </button>
  );

  const ShareButton = () => {
    const Icon = shareEnabled ? ShareEnabledIcon : ShareDisabledIcon;
    const title = shareEnabled ? 'Disable share' : 'Enable share';
    return (
      <button
        title={title}
        className={`${buttonClass} ${buttonClass}__option`}
        onClick={() => { toggleOptions(); toggleShare(); }}
        type="button"
      >
        <Icon />
      </button>
    );
  };

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
        <div className="battle-toolbar--stat-value">{initiative}</div>
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
      { !playerSession && isSaveLoadSupported()
        && (
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
            <ShareButton />
            <ResetButton />
          </div>
        </div>
        )}
      { !playerSession && !isSaveLoadSupported() && <ResetButton /> }
    </header>
  );
}

export default BattleToolbar;
