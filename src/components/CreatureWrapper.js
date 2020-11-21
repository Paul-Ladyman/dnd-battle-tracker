import React, { Component } from 'react';
import equal from 'fast-deep-equal';
import isHotkey from 'is-hotkey';
import findIndex from 'lodash.findindex';
import CollapsedCreature from './CollapsedCreature';
import ExpandedCreature from './ExpandedCreature';
import CreatureToolbar from './CreatureToolbar';
import { hotkeys } from '../hotkeys/hotkeys';
import CreatureExpander from './CreatureExpander';
import CreatureLocker from './CreatureLocker';
import MonsterSearcher from './MonsterSearcher';
import HealthPoints from './HealthPoints';

function getAvailableConditions(allConditions, creatureConditions) {
  return allConditions.filter((condition) => {
    const activeConditionIndex = findIndex(creatureConditions, (activeCondition) => {
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
    
    const { playerSession } = this.props;

    if (!playerSession && isHotkey(hotkeys.focusCreatureToolbar, event)) {
      this.creatureToolbarRef.current.focus();
    }
  }

  creatureToolbarKeyHandler(event) {
    const { playerSession } = this.props;
    if (!playerSession && isHotkey(hotkeys.focusCreature, event)) {
      this.creatureRef.current.focus();
    }
  }

  expandCreatureHandler() {
    this.getExpandCollapseFunc()();
    const { playerSession } = this.props;
    if (playerSession) {
      this.creatureRef.current.focus();
    }
    else {
      const { setFocus, creature } = this.props;
      setFocus(creature);
    }
  }

  focusHandler(event) {
    const targetId = event.target.getAttribute('id');
    const { playerSession } = this.props;
    if (!playerSession && targetId === 'creature-wrapper') {
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
    const { creature, active, conditions, creatureManagement, playerSession } = this.props;
    const { name, id, locked, alive, healthPoints: creatureHealthPoints, maxHealthPoints } = creature;

    const activeModifier = active ? 'creature-wrapper__active ' : '';
    const aliveModifier = alive ? '' : 'creature-wrapper__dead';
    const expandedModifier = this.state.expanded ? 'creature-wrapper__expanded' : 'creature-wrapper__collapsed';
    const classes=`creature-wrapper ${activeModifier} ${aliveModifier} ${expandedModifier}`;
    const showExpanded = active || this.state.expanded;
    const creatureAriaLabel = getCreatureAriaLabel(creature, active, this.state.expanded);
    const { removeCreature, removeNoteFromCreature } = creatureManagement;
    const creatureExpander = <CreatureExpander
      active={active}
      expanded={this.state.expanded}
      name={name}
      expandHandler={this.expandCreatureHandler}
    />
    const creatureLocker = !playerSession && <CreatureLocker
      locked={locked}
      name={name}
      lockHandler={() => creatureManagement.toggleCreatureLock(id)}
    />
    const monsterSearcher = !playerSession && <MonsterSearcher search={name} />
    const healthPoints = <HealthPoints
       short={!showExpanded}
       hp={creatureHealthPoints}
       maxHp={maxHealthPoints}
       className={showExpanded ? "expanded-creature--stat" : "collapsed-creature--health-points"}
       playerSession={playerSession}
     />
     const showHealth = creatureHealthPoints !== undefined && creatureHealthPoints !== null;
          
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
              creatureExpander={creatureExpander}
              creatureLocker={creatureLocker}
              monsterSearcher={monsterSearcher}
              healthPoints={healthPoints}
              showHealth={showHealth}
              playerSession={playerSession}
            /> :
            <CollapsedCreature
              creature={creature}
              creatureExpander={creatureExpander}
              creatureLocker={creatureLocker}
              monsterSearcher={monsterSearcher}
              healthPoints={healthPoints}
              showHealth={showHealth}
            />
          }
        </section>
        { !playerSession && <section
            tabIndex="0"
            aria-label={`${name} toolbar`}
            ref={this.creatureToolbarRef}
            onKeyDown={this.creatureToolbarKeyHandler}
          >
            <CreatureToolbar
              creature={creature}
              conditions={getAvailableConditions(conditions, creature.conditions)}
              creatureManagement={creatureManagement}
            />
          </section>
        }
      </React.Fragment>
    );
  }
}

export default CreatureWrapper;