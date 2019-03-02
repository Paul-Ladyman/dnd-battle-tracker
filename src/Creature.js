import React, { Component } from 'react';
import CollapsedCreature from './CollapsedCreature';
import ExpandedCreature from './ExpandedCreature';

class Creature extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };

    this.creatureRef = React.createRef();

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

    if (active) {
      this.creatureRef.current.scrollIntoView({ block: 'center' });
    }

    const activeModifier = active ? 'creature-wrapper__active ' : '';
    const aliveModifier = creature.alive ? '' : 'creature-wrapper__dead';
    const expandedModifier = this.state.expanded ? 'creature-wrapper__expanded' : 'creature-wrapper__collapsed';
    const classes=`creature-wrapper ${activeModifier} ${aliveModifier} ${expandedModifier}`;
    const buttonSign = this.state.expanded ? 'v' : '^';
    const buttonOnClick = this.state.expanded ? this.collapse : this.expand;

    const showExpanded = active || this.state.expanded;

    return (
      <React.Fragment>
        <div className={classes} ref={this.creatureRef}>
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
          {!active && <button className="expand-creature-button" onClick={buttonOnClick}>{buttonSign}</button>}
        </div>
      </React.Fragment>
    );
  }
}

export default Creature;