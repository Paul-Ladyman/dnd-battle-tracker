import React, { Component } from 'react';
import CollapsedCreature from './CollapsedCreature';
import ExpandedCreature from './ExpandedCreature';
import CreatureToolbar from './CreatureToolbar';
import HealthPoints from './HealthPoints';
import CreatureHeader from './CreatureHeader';
import CreatureRemover from './CreatureRemover';
import { getAvailableConditions } from '../state/ConditionsManager';

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

function getColumnClasses(showExpanded, multiColumn) {
  if (!showExpanded) {
    return '';
  }

  const baseClass = 'expanded-creature--columns';
  return multiColumn ? `${baseClass} ${baseClass}__wide` : `${baseClass} ${baseClass}__normal`;
}

class CreatureWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.expandCreatureHandler = this.expandCreatureHandler.bind(this);
    this.focusHandler = this.focusHandler.bind(this);
    this.hasBrowserFocus = this.hasBrowserFocus.bind(this);
  }

  /*
   * Prevent Creature rerendering when it has not been updated.
   * Otherwise we would always scroll to the active creature when another creature
   * is updated.
   */
  shouldComponentUpdate(nextProps, nextState) {
    const {
      creature,
      active,
      focused,
      toolbarFocused,
      round,
    } = this.props;

    const {
      expanded,
    } = this.state;

    const shouldUpdate = JSON.stringify(nextProps.creature) !== JSON.stringify(creature)
      || nextProps.active !== active
      || nextProps.focused !== focused
      || nextProps.toolbarFocused !== toolbarFocused
      || nextState.expanded !== expanded
      || nextProps.round !== round;

    return shouldUpdate;
  }

  componentDidUpdate(prevProps) {
    const { active, setToolbarFocus } = this.props;
    if (active && prevProps.active === false) {
      setToolbarFocus(false);
    }
  }

  expandCreatureHandler() {
    this.setState((prevState) => ({ ...prevState, expanded: !prevState.expanded }));
  }

  focusHandler(toolbar) {
    const { playerSession } = this.props;
    if (!playerSession) {
      const { focused, setToolbarFocus } = this.props;
      setToolbarFocus(toolbar);
      if (!focused) {
        const { setFocus, creature } = this.props;
        setFocus(creature);
      }
    }
  }

  hasBrowserFocus(selector) {
    const { creature: { id } } = this.props;
    const focusedElement = document.activeElement.closest(selector);
    const focusedDataId = focusedElement && focusedElement.getAttribute('data-creature-id');
    const focusedId = parseInt(focusedDataId, 10);
    return focusedId === id;
  }

  render() {
    const {
      creature,
      active,
      creatureManagement,
      playerSession,
      round,
      secondsElapsed,
      focused,
      toolbarFocused,
    } = this.props;

    const {
      name,
      id,
      locked,
      alive,
      healthPoints: creatureHealthPoints,
      maxHealthPoints,
      notes,
      conditions: creatureConditions,
    } = creature;

    const alreadyFocused = this.hasBrowserFocus('#creature-wrapper');
    const toolbarAlreadyFocused = this.hasBrowserFocus('#creature-toolbar');

    const { expanded } = this.state;

    const activeModifier = active ? 'creature-wrapper__active ' : '';
    const aliveModifier = alive ? '' : 'creature-wrapper__dead';
    const classes = `creature-wrapper ${activeModifier} ${aliveModifier}`;
    const showExpanded = active || expanded;
    const creatureAriaLabel = getCreatureAriaLabel(creature, active, expanded);
    const { removeCreature, removeNoteFromCreature } = creatureManagement;

    const healthPoints = (
      <HealthPoints
        short={!showExpanded}
        hp={creatureHealthPoints}
        maxHp={maxHealthPoints}
        className={showExpanded ? 'expanded-creature--stat' : ''}
        playerSession={playerSession}
      />
    );
    const showHealth = creatureHealthPoints !== undefined && creatureHealthPoints !== null;

    const multiColumn = creatureConditions.length > 0 || notes.length > 0;

    const showCreatureRemover = showExpanded && !playerSession && !active;

    return (
      <>
        <section
          className={classes}
          id="creature-wrapper"
          aria-label={creatureAriaLabel}
          onFocus={() => this.focusHandler(false)}
          data-creature-id={id}
        >
          <div className={getColumnClasses(showExpanded, multiColumn)}>
            <CreatureHeader
              creature={creature}
              active={active}
              locked={locked}
              lockHandler={() => creatureManagement.toggleCreatureLock(id)}
              expanded={expanded}
              expandHandler={this.expandCreatureHandler}
              focused={focused && !toolbarFocused && !alreadyFocused}
              multiColumn={multiColumn}
              playerSession={playerSession}
            />
            {showExpanded
              ? (
                <>
                  <ExpandedCreature
                    creature={creature}
                    active={active}
                    round={round}
                    secondsElapsed={secondsElapsed}
                    removeCreature={removeCreature}
                    removeNoteFromCreature={removeNoteFromCreature}
                    healthPoints={healthPoints}
                    showHealth={showHealth}
                    playerSession={playerSession}
                  />
                </>
              )
              : (
                <CollapsedCreature
                  creature={creature}
                  healthPoints={healthPoints}
                  showHealth={showHealth}
                />
              )}
          </div>
          {showCreatureRemover && (
            <CreatureRemover
              creature={creature}
              removeCreature={removeCreature}
            />
          )}
        </section>
        { !playerSession && (
          <section
            aria-label={`${name} toolbar`}
            id="creature-toolbar"
            data-creature-id={id}
            onFocus={() => this.focusHandler(true)}
          >
            <CreatureToolbar
              creature={creature}
              conditions={getAvailableConditions(creature)}
              creatureManagement={creatureManagement}
              focused={focused && toolbarFocused && !toolbarAlreadyFocused}
            />
          </section>
        )}
      </>
    );
  }
}

export default CreatureWrapper;
