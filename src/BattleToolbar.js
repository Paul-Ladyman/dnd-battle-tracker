import React, {Component} from 'react';
import isHotkey from 'is-hotkey';
import Timer from './Timer';
import StartBattleIcon from './icons/StartBattleIcon';
import NextInitiativeIcon from './icons/NextInitiativeIcon';
import OptionsMenuClosedIcon from './icons/OptionsMenuClosedIcon';
import OptionsMenuOpenIcon from './icons/OptionsMenuOpenIcon';
import SaveIcon from './icons/SaveIcon';
import LoadIcon from './icons/LoadIcon';
import ResetIcon from './icons/ResetIcon';
import { hotkeys } from './hotkeys';

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
    window.addEventListener('keydown', (e) => {
      console.log(this.nextButton.current.attributes.disabled)
      if (isHotkey(hotkeys.battlebar, e)) {
        const { disabled: nextButtonDisabled } = this.nextButton.current.attributes;
        if (nextButtonDisabled) {
          this.optionsButton.current.focus();
        } else {
          this.nextButton.current.focus();
        }
      }
    });
  }

  toggleOptions() {
    this.setState({ optionsExpanded: !this.state.optionsExpanded });
  }

  handleUpload(loadBattle) {
    const file = this.fileSelector.current.files[0];
    loadBattle(file);
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
      loadBattle
    } = this.props;

    const buttonClass = 'battle-toolbar--button';
    const creaturesAdded = creatures > 0;
    const buttonClasses = creaturesAdded ? buttonClass : `${buttonClass} ${buttonClass}__disabled`;
    const nextButtonLabel = round === 0 ? <StartBattleIcon /> : <NextInitiativeIcon />;
    const nextButtonTitle = round === 0 ? 'Start battle' : 'Next initiative';
    const optionsMenuIcon = this.state.optionsExpanded ? <OptionsMenuOpenIcon /> : <OptionsMenuClosedIcon />;
    const optionsClass = this.state.optionsExpanded ? 'battle-toolbar--options-dropdown' : 'hidden';
    return (
      <header className="battle-toolbar">
        <button
          title={nextButtonTitle}
          className={buttonClasses}
          onClick={nextInitiative}
          ref={this.nextButton}
          disabled={!creaturesAdded}
        >{nextButtonLabel}</button>
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
        <div className="battle-toolbar--options-container">
          <button
            title="Options Menu"
            className={`${buttonClass} battle-toolbar--button__options`}
            onClick={this.toggleOptions}
            ref={this.optionsButton}
          >{optionsMenuIcon}</button>
          <div className={optionsClass}>
            <button
              title="Save Battle"
              className={buttonClass}
              onClick={() => {this.toggleOptions(); saveBattle();}}
            ><SaveIcon /></button>
            <input
              type='file'
              class="hidden"
              accept="application/json"
              ref={this.fileSelector}
              onChange={() => this.handleUpload(loadBattle)}
            />
            <button
              title="Load Battle"
              className={buttonClass}
              onClick={() => {this.toggleOptions(); this.fileSelector.current.click();}}
            ><LoadIcon /></button>
            <button
              title="Reset Battle"
              className={buttonClasses}
              onClick={() => {this.toggleOptions(); resetBattle();}}
              disabled={!creaturesAdded}
            ><ResetIcon /></button>
          </div>
        </div>
      </header>
    );
  }
}

export default BattleToolbar;
