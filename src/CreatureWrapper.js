import React, { Component } from 'react';
import equal from 'fast-deep-equal';
import isHotkey from 'is-hotkey';
import CollapsedCreature from './CollapsedCreature';
import ExpandedCreature from './ExpandedCreature';
import ExpandIcon from './icons/ExpandIcon';
import CollapseIcon from './icons/CollapseIcon';
import CreatureToolbar from './CreatureToolbar';
import { hotkeys } from './hotkeys';

function getAvailableConditions(allConditions, creatureConditions) {
  return allConditions.filter((condition) => {
    const activeConditionIndex = creatureConditions.findIndex((activeCondition) => {
      return activeCondition.text === condition;
    });
    return activeConditionIndex === -1;
  });
}

function getCreatureAriaLabel(creature, active, expanded) {
  const { name } = creature;
  let label = name;
  if (active) {
    label = `active creature ${label}`;
  }

  if (expanded && !active) {
    label = `${label} expanded`;
  }

  return label;
}

class CreatureWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };

    this.creatureRef = React.createRef();
    this.creatureToolbarRef = React.createRef();

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.creatureKeyHandler = this.creatureKeyHandler.bind(this);
    this.creatureToolbarKeyHandler = this.creatureToolbarKeyHandler.bind(this);
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


  creatureKeyHandler(event) {
    const targetId = event.target.getAttribute('id');
    if (event.keyCode === 13 && targetId === 'creature-wrapper') {
      this.getExpandCollapseFunc()();
    }

    if (isHotkey(hotkeys.focusCreatureToolbar, event)) {
      this.creatureToolbarRef.current.focus();
    }
  }

  creatureToolbarKeyHandler(event) {
    if (isHotkey(hotkeys.focusCreature, event)) {
      this.creatureRef.current.focus();
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

  componentDidUpdate() {
    const { focused } = this.props;
    if (focused) {
      this.creatureRef.current.focus();
    }
  }

  render () {
    const { creature, active, conditions, creatureManagement } = this.props;

    const activeModifier = active ? 'creature-wrapper__active ' : '';
    const aliveModifier = creature.alive ? '' : 'creature-wrapper__dead';
    const expandedModifier = this.state.expanded ? 'creature-wrapper__expanded' : 'creature-wrapper__collapsed';
    const classes=`creature-wrapper ${activeModifier} ${aliveModifier} ${expandedModifier}`;
    const buttonTitle = this.state.expanded ? 'Collapse creature' : 'Expand creature';
    const buttonIcon = this.state.expanded ? <CollapseIcon /> : <ExpandIcon />;
    const buttonAriaLabel = this.state.expanded ? `collapse ${creature.name}` : `expand ${creature.name}`;

    const showExpanded = creature.id === 1;//active || this.state.expanded;

    const creatureAriaLabel = getCreatureAriaLabel(creature, active, this.state.expanded);

    const { removeCreature, removeNoteFromCreature } = creatureManagement;

    return (
      <React.Fragment>
        <section
          className={classes}
          id="creature-wrapper"
          ref={this.creatureRef}
          tabIndex='0'
          aria-label={creatureAriaLabel}
          onKeyDown={this.creatureKeyHandler}
          onFocus={this.focusHandler}
        >
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
          {!active && 
            <button
              aria-label={buttonAriaLabel}
              className="expand-creature-button"
              title={buttonTitle}
              onClick={this.expandCreatureHandler}>
                {buttonIcon}
            </button>
          }
        </section>
        <section
          tabIndex="0"
          aria-label={`${creature.name} toolbar`}
          ref={this.creatureToolbarRef}
          onKeyDown={this.creatureToolbarKeyHandler}
        >
          <CreatureToolbar
            creature={creature}
            conditions={getAvailableConditions(conditions, creature.conditions)}
            creatureManagement={creatureManagement}
          />
        </section>
      </React.Fragment>
    );
  }
}

export default CreatureWrapper;