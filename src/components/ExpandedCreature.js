import React, { Component } from 'react';
import CreatureNoteList from './CreatureNoteList';
import HealthPoints from './HealthPoints';
import { conditionDescriptions } from '../model/conditions';
import ExternalLink from './ExternalLink';
import MonsterSearcher from './MonsterSearcher';
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
      removeNoteFromCreature,
      creatureExpander
    } = this.props;
    const { alive, name, rawName, maxHealthPoints, healthPoints, initiative, id, conditions, notes } = creature;
    const showInitiative = initiative !== undefined;
    const showHealth = healthPoints !== undefined;
    const showConditions = conditions.length > 0;
    const showNotes = notes.length > 0;
    const multiColumn = showConditions || showNotes;
    const columnClassName = multiColumn ? 'expanded-creature--columns__wide' : 'expanded-creature--columns__normal';
    const firstColumnClassModifier = showHealth && !alive ? '__tall' : '__short';
    const nameClass = 'expanded-creature--name';
    const nameClasses = multiColumn ? `${nameClass} ${nameClass}__one-line` : nameClass;

    return (
      <div className="expanded-creature">
        <div className={`expanded-creature--columns ${columnClassName}`}>
          <div className={`expanded-creature--first-column${firstColumnClassModifier}`}>
            <div className="creature-title">
              <h2 className={nameClasses}>{name}</h2>
              <MonsterSearcher search={rawName} />
              {creatureExpander}
              {active && <ActiveCreatureIcon className="expanded-creature--active-icon" />}
            </div>
            {!alive &&
              <div className="expanded-creature--status">
                <em><ExternalLink url={conditionDescriptions.Unconscious} >Unconscious/dead</ExternalLink></em>
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
            {showInitiative &&
              <div className="expanded-creature--stat">
                <b>Initiative</b> {initiative}
              </div>
            }
            { (showHealth || showInitiative) && <div className="expanded-creature--separator" /> }
          </div>
          {showConditions &&
            <CreatureNoteList
              creatureId={id}
              label="Conditions"
              noteList={conditions}
              dismissHandler={(creatureId, note) => removeNoteFromCreature(creatureId, note, true)}
              round={round}
              secondsElapsed={secondsElapsed}
            />
          }
          {showNotes &&
            <CreatureNoteList
              creatureId={id}
              label="Notes"
              noteList={notes}
              dismissHandler={(creatureId, note) => removeNoteFromCreature(creatureId, note, false)}
              round={round}
              secondsElapsed={secondsElapsed}
            />
          }
        </div>
        {!active && !this.state.removing &&
          <button
            aria-label={`remove ${creature.name}`}
            title="Remove creature"
            className="expanded-creature--remove-button"
            onClick={this.removing}
          >
            <RemoveCreatureIcon />
          </button>
        }
        {!active && this.state.removing &&
          <button
            aria-label={`confirm remove ${creature.name}`}
            title="Confirm remove creature"
            className="expanded-creature--confirm-remove-button"
            onClick={() => removeCreature(id)}
          >
            <ConfirmRemoveCreatureIcon />
          </button>
        }
        {active && <div style={{height: '43px'}}></div>}
      </div>
    );
  }
}

export default ExpandedCreature;