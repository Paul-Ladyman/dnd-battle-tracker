import React, { Component } from 'react';
import CollapsedCreature from './CollapsedCreature';
import ExpandedCreature from './ExpandedCreature';

class Creature extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: props.active
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
    const classes=`creature-wrapper ${activeModifier} centered__space-between`;
    const buttonSign = this.state.expanded ? 'v' : '^';
    const buttonOnClick = this.state.expanded ? this.collapse : this.expand;

    return (
      <React.Fragment>
        <div className={classes}>
          {this.state.expanded ? 
            <ExpandedCreature creature={creature} /> :
            <CollapsedCreature creature={creature} />
          }
          {!active && <button onClick={buttonOnClick}>{buttonSign}</button>}
        </div>
      </React.Fragment>
    );
  }
}

export default Creature;