import React, { Component } from 'react';
import CollapsedCreature from './CollapsedCreature';
import ExpandedCreature from './ExpandedCreature';
import CreatureToolbar from './toolbar/CreatureToolbar';
import HealthPoints from './HealthPoints';
import CreatureHeader from './CreatureHeader';
import { getAvailableConditions } from '../../state/ConditionsManager';
import { getHitPointsBar, shouldShowHitPoints } from '../../display/displayLogic';

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
  const baseClass = 'creature--columns';
  if (!showExpanded) {
    return `${baseClass}__normal`;
  }

  return multiColumn ? `${baseClass} ${baseClass}__wide` : `${baseClass} ${baseClass}__normal`;
}

class CreatureWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.expandCreatureHandler = this.expandCreatureHandler.bind(this);
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
      round,
    } = this.props;

    const {
      expanded,
    } = this.state;

    const shouldUpdate = JSON.stringify(nextProps.creature) !== JSON.stringify(creature)
      || nextProps.active !== active
      || nextProps.focused !== focused
      || nextState.expanded !== expanded
      || nextProps.round !== round;

    return shouldUpdate;
  }

  expandCreatureHandler() {
    this.setState((prevState) => ({ ...prevState, expanded: !prevState.expanded }));
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
    } = this.props;

    const {
      id,
      hitPointsShared,
      healthPoints: creatureHealthPoints,
      maxHealthPoints,
      temporaryHealthPoints,
      notes,
      conditions: creatureConditions,
      alive,
    } = creature;

    const { expanded } = this.state;

    const showExpanded = active || expanded;
    const activeClassModifier = active ? 'creature-wrapper__active' : '';
    const classes = `creature-wrapper ${activeClassModifier}`;
    const creatureAriaLabel = getCreatureAriaLabel(creature, active, expanded);
    const {
      removeCreature,
      removeNoteFromCreature,
    } = creatureManagement;

    const healthPoints = (
      <HealthPoints
        short={!showExpanded}
        hp={creatureHealthPoints}
        maxHp={maxHealthPoints}
        tempHp={temporaryHealthPoints}
        className={showExpanded ? 'expanded-creature--stat' : ''}
        playerSession={playerSession}
      />
    );
    const showHitPoints = shouldShowHitPoints(creatureHealthPoints, hitPointsShared, playerSession);

    const multiColumn = creatureConditions.length > 0 || notes.length > 0;

    const [
      leftPercentage,
      rightPercentage,
    ] = getHitPointsBar(creatureHealthPoints, maxHealthPoints, alive, showHitPoints);

    return (
      <>
        <section
          className={classes}
          id="creature-wrapper"
          aria-label={creatureAriaLabel}
          data-creature-id={id}
          style={{ backgroundImage: `linear-gradient(to right, #EBE1AD ${leftPercentage}%, lightgrey ${rightPercentage}%)` }}
        >
          <div className={getColumnClasses(showExpanded, multiColumn)}>
            <CreatureHeader
              creature={creature}
              active={active}
              expanded={expanded}
              expandHandler={this.expandCreatureHandler}
              focused={focused}
              multiColumn={multiColumn}
            />
            {showExpanded
              ? (
                <ExpandedCreature
                  creature={creature}
                  round={round}
                  secondsElapsed={secondsElapsed}
                  removeCreature={removeCreature}
                  removeNoteFromCreature={removeNoteFromCreature}
                  healthPoints={healthPoints}
                  showHealth={showHitPoints}
                  playerSession={playerSession}
                />
              )
              : (
                <CollapsedCreature
                  creature={creature}
                  healthPoints={healthPoints}
                  showHealth={showHitPoints}
                />
              )}
          </div>
        </section>
        { !playerSession && (
          <CreatureToolbar
            creature={creature}
            conditions={getAvailableConditions(creature)}
            creatureManagement={creatureManagement}
            active={active}
          />
        )}
      </>
    );
  }
}

export default CreatureWrapper;
