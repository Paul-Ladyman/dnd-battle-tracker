import React, { Component } from 'react';
import CreatureNoteList from './CreatureNoteList';
import { conditionDescriptions } from '../model/conditions';
import ExternalLink from './ExternalLink';
import RemoveCreatureIcon from './icons/RemoveCreatureIcon';
import ConfirmRemoveCreatureIcon from './icons/ConfirmRemoveCreatureIcon';

class ExpandedCreature extends Component {
  constructor(props) {
    super(props);

    this.state = {
      removing: false,
    };

    this.removing = this.removing.bind(this);
  }

  removing() {
    this.setState({ removing: true });
  }

  render() {
    const {
      creature,
      active,
      round,
      secondsElapsed,
      removeCreature,
      removeNoteFromCreature,
      healthPoints,
      showHealth,
      playerSession,
    } = this.props;
    const {
      alive, initiative, id, conditions, notes,
    } = creature;
    const showInitiative = initiative !== undefined && initiative !== null;
    const showConditions = conditions.length > 0;
    const showNotes = notes.length > 0;
    const multiColumn = showConditions || showNotes;
    const columnClassName = multiColumn ? 'expanded-creature--columns__wide' : 'expanded-creature--columns__normal';
    const nameClass = 'expanded-creature--name';
    const nameClasses = multiColumn ? `${nameClass} ${nameClass}__one-line` : nameClass;

    const { removing } = this.state;

    return (
      <div className="expanded-creature">
        <div className={`expanded-creature--columns ${columnClassName}`}>
          <div>
            {/* {header(nameClasses)} */}
            {!alive
              && (
              <div className="expanded-creature--status">
                <em>
                  <ExternalLink url={conditionDescriptions.Unconscious}>
                    Unconscious/dead
                  </ExternalLink>
                </em>
              </div>
              )}
            <div className="expanded-creature--separator" />
            {showHealth && healthPoints}
            {showInitiative
              && (
              <div className="expanded-creature--stat">
                <b>Initiative</b>
                {' '}
                {initiative}
              </div>
              )}
            { (showHealth || showInitiative) && <div className="expanded-creature--separator" /> }
          </div>
          {showConditions
            && (
            <CreatureNoteList
              creatureId={id}
              label="Conditions"
              noteList={conditions}
              dismissHandler={(creatureId, note) => removeNoteFromCreature(creatureId, note, true)}
              round={round}
              secondsElapsed={secondsElapsed}
              playerSession={playerSession}
            />
            )}
          {showNotes
            && (
            <CreatureNoteList
              creatureId={id}
              label="Notes"
              noteList={notes}
              dismissHandler={(creatureId, note) => removeNoteFromCreature(creatureId, note, false)}
              round={round}
              secondsElapsed={secondsElapsed}
              playerSession={playerSession}
            />
            )}
        </div>
        {!playerSession && !active && !removing
          && (
          <button
            aria-label={`remove ${creature.name}`}
            title="Remove creature"
            className="expanded-creature--remove-button"
            onClick={this.removing}
            type="button"
          >
            <RemoveCreatureIcon />
          </button>
          )}
        {!playerSession && !active && removing
          && (
          <button
            aria-label={`confirm remove ${creature.name}`}
            title="Confirm remove creature"
            className="expanded-creature--confirm-remove-button"
            onClick={() => removeCreature(id)}
            type="button"
          >
            <ConfirmRemoveCreatureIcon />
          </button>
          )}
        {active && <div style={{ height: '43px' }} />}
      </div>
    );
  }
}

export default ExpandedCreature;
