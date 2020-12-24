import React, { Component } from 'react';
import equal from 'fast-deep-equal';
import findIndex from 'lodash.findindex';
import CollapsedCreature from './CollapsedCreature';
import ExpandedCreature from './ExpandedCreature';
import CreatureToolbar from './CreatureToolbar';
import HealthPoints from './HealthPoints';
import CreatureHeader from './CreatureHeader';

function getAvailableConditions(allConditions, creatureConditions) {
  return allConditions.filter((condition) => {
    const activeConditionIndex = findIndex(
      creatureConditions,
      (activeCondition) => activeCondition.text === condition,
    );
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
      expanded: false,
    };

    this.expandCreatureHandler = this.expandCreatureHandler.bind(this);
    this.focusHandler = this.focusHandler.bind(this);
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

    const shouldUpdate = !equal(nextProps.creature, creature)
      || nextProps.active !== active
      || nextProps.focused !== focused
      || nextProps.toolbarFocused !== toolbarFocused
      || nextState.expanded !== expanded
      || nextProps.round !== round;

    return shouldUpdate;
  }

  expandCreatureHandler() {
    this.setState((prevState) => ({ ...prevState, expanded: !prevState.expanded }));
  }

  focusHandler() {
    const { playerSession, focused } = this.props;
    if (!playerSession && !focused) {
      const { setFocus, creature } = this.props;
      setFocus(creature);
    }
  }

  render() {
    const {
      creature,
      active,
      conditions,
      creatureManagement,
      playerSession,
      round,
      secondsElapsed,
      focused,
      toolbarFocused,
      setToolbarFocus,
    } = this.props;

    const {
      name, id, locked, alive, healthPoints: creatureHealthPoints, maxHealthPoints,
    } = creature;

    const { expanded } = this.state;

    const activeModifier = active ? 'creature-wrapper__active ' : '';
    const aliveModifier = alive ? '' : 'creature-wrapper__dead';
    const expandedModifier = expanded ? 'creature-wrapper__expanded' : 'creature-wrapper__collapsed';
    const classes = `creature-wrapper ${activeModifier} ${aliveModifier} ${expandedModifier}`;
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

    const creatureHeader = (headerClasses) => (
      <CreatureHeader
        classes={headerClasses}
        name={name}
        active={active}
        locked={locked}
        lockHandler={() => creatureManagement.toggleCreatureLock(id)}
        expanded={expanded}
        expandHandler={this.expandCreatureHandler}
        focused={focused && !toolbarFocused}
      />
    );

    return (
      <>
        <section
          className={classes}
          id="creature-wrapper"
          aria-label={creatureAriaLabel}
          onFocus={this.focusHandler}
        >
          {creatureHeader('collapsed-creature--name')}
          {showExpanded
            ? (
              <ExpandedCreature
                header={creatureHeader}
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
            )
            : (
              <CollapsedCreature
                header={creatureHeader}
                creature={creature}
                healthPoints={healthPoints}
                showHealth={showHealth}
              />
            )}
        </section>
        { !playerSession && (
        <section
          aria-label={`${name} toolbar`}
          onFocus={setToolbarFocus}
        >
          <CreatureToolbar
            creature={creature}
            conditions={getAvailableConditions(conditions, creature.conditions)}
            creatureManagement={creatureManagement}
            focused={focused && toolbarFocused}
          />
        </section>
        )}
      </>
    );
  }
}

export default CreatureWrapper;
