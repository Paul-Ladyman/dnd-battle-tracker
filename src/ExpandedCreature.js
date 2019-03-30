import React, { Component } from 'react';
import CreatureNoteList from './CreatureNoteList';
import HealthPoints from './HealthPoints';
import { conditionDescriptions } from './conditions';
import ExternalLink from './ExternalLink';
import RemoveCreatureIcon from './icons/RemoveCreatureIcon';
import ConfirmRemoveCreatureIcon from './icons/ConfirmRemoveCreatureIcon';
import ActiveCreatureIcon from './icons/ActiveCreatureIcon';

class ExpandedCreature extends Component {
  constructor(props) {
    super(props);

    this.state = {
      removing: false
    };

    this.removing = this.removing.bind(this);
  }

  removing() {
    this.setState({ removing: true });
  }

  render () {
    const {
      creature,
      active,
      round,
      secondsElapsed,
      removeCreature,
      removeNoteFromCreature
    } = this.props;
    const { alive, name, maxHealthPoints, healthPoints, initiative, id, conditions, notes } = creature;
    const showHealth = healthPoints !== undefined;
    const showConditions = conditions.length > 0;
    const showNotes = notes.length > 0;

    return (
      <div className="expanded-creature centered__columns">
        <div className="expanded-creature--name">
          {name}
          {active && <ActiveCreatureIcon className="expanded-creature--active-icon" />}
        </div>
        {!alive &&
          <div className="expanded-creature--status">
            <em><ExternalLink url={conditionDescriptions.unconscious} text="Unconscious/dead"/></em>
          </div>
        }
        <div className="expanded-creature--separator" />
        {showHealth &&
          <HealthPoints
            hp={healthPoints}
            maxHp={maxHealthPoints}
            className="expanded-creature--stat"
          />
        }
        <div className="expanded-creature--stat">
          <b>Initiative</b> {initiative}
        </div>
        {showConditions &&
          <React.Fragment>
            <div className="expanded-creature--separator" />
            <CreatureNoteList
              creatureId={id}
              label="Conditions"
              noteList={conditions}
              dismissHandler={(creatureId, note) => removeNoteFromCreature(creatureId, note, true)}
              round={round}
              secondsElapsed={secondsElapsed}
              className="expanded-creature--stat"
            />
          </React.Fragment>
        }
        {showNotes &&
          <React.Fragment>
            {!showConditions && <div className="expanded-creature--separator" /> }
            <CreatureNoteList
              creatureId={id}
              label="Notes"
              noteList={notes}
              dismissHandler={(creatureId, note) => removeNoteFromCreature(creatureId, note, false)}
              round={round}
              secondsElapsed={secondsElapsed}
              className="expanded-creature--stat"
            />
          </React.Fragment>
        }
        {!active && <div className="expanded-creature--separator" /> }
        {!active && !this.state.removing &&
          <button title="Remove creature" className="expanded-creature--remove-button" onClick={this.removing}>
            <RemoveCreatureIcon />
          </button>
        }
        {!active && this.state.removing &&
          <button title="Confirm remove creature" className="expanded-creature--confirm-remove-button" onClick={() => removeCreature(id)}>
              <ConfirmRemoveCreatureIcon />
          </button>
        }
      </div>
    );
  }
}

export default ExpandedCreature;