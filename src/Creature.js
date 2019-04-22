import React, { Component } from 'react';
import equal from 'fast-deep-equal';
import CollapsedCreature from './CollapsedCreature';
import ExpandedCreature from './ExpandedCreature';
import ExpandIcon from './icons/ExpandIcon';
import CollapseIcon from './icons/CollapseIcon';

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

  /*
   * Prevent Creature rerendering when nothing it has not been updated.
   * Otherwise we would always scroll to the active creature when another creature
   * is updated.
   */
  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = !equal(nextProps.creature, this.props.creature) ||
      nextProps.active !== this.props.active ||
      nextState.expanded !== this.state.expanded ||
      nextProps.round !== this.props.round;

    return shouldUpdate;
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
    const buttonTitle = this.state.expanded ? 'Collapse creature' : 'Expand creature';
    const buttonIcon = this.state.expanded ? <CollapseIcon /> : <ExpandIcon />;
    const buttonOnClick = this.state.expanded ? this.collapse : this.expand;

    const showExpanded = active || this.state.expanded;

    const { removeCreature, removeNoteFromCreature } = this.props.creatureManagement;

    return (
      <React.Fragment>
        <section className={classes} ref={this.creatureRef} tabIndex='0'>
          {!active && <button className="expand-creature-button" title={buttonTitle} onClick={buttonOnClick}>{buttonIcon}</button>}
          {showExpanded ? 
            <ExpandedCreature
              creature={creature}
              active={active}
              round={this.props.round}
              secondsElapsed={this.props.secondsElapsed}
              removeCreature={removeCreature}
              removeNoteFromCreature={removeNoteFromCreature}
            /> :
            <CollapsedCreature creature={creature} />
          }
        </section>
      </React.Fragment>
    );
  }
}

export default Creature;