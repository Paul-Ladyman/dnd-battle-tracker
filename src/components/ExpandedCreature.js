import React, { Component } from 'react';
import CreatureNoteList from './CreatureNoteList';
import { conditionDescriptions } from '../model/conditions';
import ExternalLink from './ExternalLink';
import RemoveCreatureIcon from './icons/RemoveCreatureIcon';
import ConfirmRemoveCreatureIcon from './icons/ConfirmRemoveCreatureIcon';
import CreatureRemover from './CreatureRemover';

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

    const { removing } = this.state;

    return (
      <>
        <div className={`expanded-creature--columns ${columnClassName}`}>
          <div>
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
        <CreatureRemover
          playerSession={playerSession}
          active={active}
          creature={creature}
          removeCreature={removeCreature}
        />
        {active && <div style={{ height: '43px' }} />}
      </>
    );
  }
}

export default ExpandedCreature;
