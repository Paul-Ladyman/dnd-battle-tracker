import React, { Component } from 'react';
import isHotkey from 'is-hotkey';
import Timer from './Timer';
import StartBattleIcon from './icons/StartBattleIcon';
import NextInitiativeIcon from './icons/NextInitiativeIcon';
import OptionsMenuClosedIcon from './icons/OptionsMenuClosedIcon';
import OptionsMenuOpenIcon from './icons/OptionsMenuOpenIcon';
import SaveIcon from './icons/SaveIcon';
import LoadIcon from './icons/LoadIcon';
import ResetIcon from './icons/ResetIcon';
import ShareEnabledIcon from './icons/ShareEnabledIcon';
import ShareDisabledIcon from './icons/ShareDisabledIcon';
import { hotkeys } from '../hotkeys/hotkeys';
import { isSaveLoadSupported } from '../state/AppManager';

class BattleToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = { optionsExpanded: false };
    this.nextButton = React.createRef();
    this.optionsButton = React.createRef();
    this.fileSelector = React.createRef();

    this.toggleOptions = this.toggleOptions.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentDidMount() {
    const { playerSession } = this.props;
    window.addEventListener('keydown', (e) => {
      if (!playerSession && isHotkey(hotkeys.battlebar, e)) {
        const { disabled: nextButtonDisabled } = this.nextButton.current.attributes;
        if (nextButtonDisabled) {
          this.optionsButton.current.focus();
        } else {
          this.nextButton.current.focus();
        }
      }
    });
  }

  handleUpload(loadBattle) {
    const file = this.fileSelector.current.files[0];
    loadBattle(file);
  }

  toggleOptions() {
    const { optionsExpanded } = this.state;
    this.setState({ optionsExpanded: !optionsExpanded });
  }

  render() {
    const {
      initiative,
      round,
      secondsElapsed,
      creatures,
      nextInitiative,
      resetBattle,
      saveBattle,
      loadBattle,
      playerSession,
      shareEnabled,
      toggleShare,
    } = this.props;

    const buttonClass = 'battle-toolbar--button';
    const creaturesAdded = creatures > 0;
    const buttonClasses = creaturesAdded ? buttonClass : `${buttonClass} ${buttonClass}__disabled`;
    const nextButtonLabel = round === 0 ? <StartBattleIcon /> : <NextInitiativeIcon />;
    const nextButtonTitle = round === 0 ? 'Start battle' : 'Next initiative';
    const { optionsExpanded } = this.state;
    const optionsMenuIcon = optionsExpanded ? <OptionsMenuOpenIcon /> : <OptionsMenuClosedIcon />;
    const optionsClass = optionsExpanded ? 'battle-toolbar--options-dropdown' : 'hidden';

    const ResetButton = () => (
      <button
        title="Reset Battle"
        className={`${buttonClasses} ${buttonClass}__reset`}
        onClick={() => { this.toggleOptions(); resetBattle(); }}
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
          className={buttonClass}
          onClick={() => { this.toggleOptions(); toggleShare(); }}
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
          className={`${buttonClasses} battle-toolbar--button__progress`}
          onClick={nextInitiative}
          ref={this.nextButton}
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
          <div className="battle-toolbar--stat-value">{creatures}</div>
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
              className={`battle-toolbar--button__toggle battle-toolbar--button__options`}
              onClick={this.toggleOptions}
              ref={this.optionsButton}
              type="button"
            >
              {optionsMenuIcon}
            </button>
            <div className={optionsClass}>
              <button
                title="Save Battle"
                className={`${buttonClass} battle-toolbar--button__top`}
                onClick={() => { this.toggleOptions(); saveBattle(); }}
                type="button"
              >
                <SaveIcon />
              </button>
              <input
                type="file"
                className="hidden"
                accept="application/json"
                ref={this.fileSelector}
                onChange={() => this.handleUpload(loadBattle)}
                value=""
              />
              <button
                title="Load Battle"
                className={`${buttonClass} ${buttonClass}__load`}
                onClick={() => { this.toggleOptions(); this.fileSelector.current.click(); }}
                type="button"
              >
                <LoadIcon />
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
}

export default BattleToolbar;
