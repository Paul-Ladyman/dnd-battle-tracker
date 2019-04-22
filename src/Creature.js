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
    this.keyHandler = this.keyHandler.bind(this);
    this.getExpandCollapseFunc = this.getExpandCollapseFunc.bind(this);
    this.expandCreatureHandler = this.expandCreatureHandler.bind(this);
    this.focusHandler = this.focusHandler.bind(this);
  }

  expand() {
    this.setState({...this.state, expanded: true});
  }

  collapse() {
    this.setState({...this.state, expanded: false});
  }

  /*
   * Prevent Creature rerendering when it has not been updated.
   * Otherwise we would always scroll to the active creature when another creature
   * is updated.
   */
  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = !equal(nextProps.creature, this.props.creature) ||
      nextProps.active !== this.props.active ||
      nextProps.focused !== this.props.focused ||
      nextState.expanded !== this.state.expanded ||
      nextProps.round !== this.props.round;

    return shouldUpdate;
  }

  getExpandCollapseFunc() {
    return this.state.expanded ? this.collapse : this.expand;
  }


  keyHandler(event) {
    const targetId = event.target.getAttribute('id');
    if (event.keyCode === 13 && targetId === 'creature-wrapper') {
      this.getExpandCollapseFunc()();
    }
  }

  expandCreatureHandler() {
    this.getExpandCollapseFunc()();
  }

  focusHandler(event) {
    const targetId = event.target.getAttribute('id');
    if (targetId === 'creature-wrapper') {
      const { setFocus, creature } = this.props;
      setFocus(creature);
    }
  }

  render () {
    const { creature, active, focused } = this.props;
    if (focused) {
      this.creatureRef.current.focus();
    }

    const activeModifier = active ? 'creature-wrapper__active ' : '';
    const aliveModifier = creature.alive ? '' : 'creature-wrapper__dead';
    const expandedModifier = this.state.expanded ? 'creature-wrapper__expanded' : 'creature-wrapper__collapsed';
    const classes=`creature-wrapper ${activeModifier} ${aliveModifier} ${expandedModifier}`;
    const buttonTitle = this.state.expanded ? 'Collapse creature' : 'Expand creature';
    const buttonIcon = this.state.expanded ? <CollapseIcon /> : <ExpandIcon />;

    const showExpanded = active || this.state.expanded;

    const { removeCreature, removeNoteFromCreature } = this.props.creatureManagement;

    return (
      <React.Fragment>
        <section
          className={classes}
          id="creature-wrapper"
          ref={this.creatureRef}
          tabIndex='0'
          onKeyDown={this.keyHandler}
          onFocus={this.focusHandler}
        >
          {!active && 
            <button
              className="expand-creature-button"
              title={buttonTitle}
              onClick={this.expandCreatureHandler}>
                {buttonIcon}
            </button>
          }
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