import React, {Component} from 'react';
import isHotkey from 'is-hotkey';
import Timer from './Timer';
import StartBattleIcon from './icons/StartBattleIcon';
import NextInitiativeIcon from './icons/NextInitiativeIcon';
import ResetIcon from './icons/ResetIcon';
import { hotkeys } from './hotkeys';

class BattleToolbar extends Component {
  constructor(props) {
    super(props);
    this.nextButton = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('keydown', (e) => {
      if (isHotkey(hotkeys.battlebar, e)) {
        this.nextButton.current.focus();
      }
    });
  }

  render() {
    const {
      initiative,
      round,
      secondsElapsed,
      combatants,
      nextInitiative,
      resetBattle
    } = this.props;

    const buttonClass = 'battle-toolbar--button';
    const buttonClasses = combatants > 0 ? buttonClass : `${buttonClass} ${buttonClass}__disabled`;
    const nextButtonLabel = round === 0 ? <StartBattleIcon /> : <NextInitiativeIcon />;
    const nextButtonTitle = round === 0 ? 'Start battle' : 'Next initiative';
    return (
      <div className="battle-toolbar">
        <button
          title={nextButtonTitle}
          className={buttonClasses}
          onClick={nextInitiative}
          ref={this.nextButton}
        >{nextButtonLabel}</button>
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
}

export default BattleToolbar;