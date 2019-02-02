import React, { Component } from 'react';
import CollapsedCreature from './CollapsedCreature';
import ExpandedCreature from './ExpandedCreature';

class Creature extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
  }

  expand() {
    this.setState({...this.state, expanded: true});
  }

  collapse() {
    this.setState({...this.state, expanded: false});
  }

  render () {
    const { creature, active } = this.props;
    const activeModifier = active ? 'creature-wrapper__active ' : '';
    const aliveModifier = creature.alive ? '' : 'creature-wrapper__dead';
    const classes=`creature-wrapper ${activeModifier} ${aliveModifier} centered__space-between`;
    const buttonSign = this.state.expanded ? 'v' : '^';
    const buttonOnClick = this.state.expanded ? this.collapse : this.expand;

    const showExpanded = active || this.state.expanded;

    return (
      <React.Fragment>
        <div className={classes}>
          {showExpanded ? 
            <ExpandedCreature
              creature={creature}
              active={active}
              round={this.props.round}
              secondsElapsed={this.props.secondsElapsed}
              removeCreature={this.props.removeCreature}
              removeNoteFromCreature={this.props.removeNoteFromCreature}
            /> :
            <CollapsedCreature creature={creature} />
          }
          {!active && <button onClick={buttonOnClick}>{buttonSign}</button>}
        </div>
      </React.Fragment>
    );
  }
}

export default Creature;