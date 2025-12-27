import React, { useImperativeHandle } from 'react';
import CreatureWrapper from '../creature/CreatureWrapper';
import UnselectedCreature from '../creature/UnselectedCreature';

function Creatures({
  creatures,
  activeCreatureId,
  errorCreatureId,
  focusedCreature,
  round,
  secondsElapsed,
  creatureManagement,
  playerSession,
  selectedCreatureCount,
}, forwardedRef) {
  const refs = creatures.reduce((acc, value) => {
    acc[value.id] = React.createRef();
    return acc;
  }, {});

  useImperativeHandle(
    forwardedRef,
    () => ({
      scrollToCreature: (value) => {
        if (refs[value]?.current) {
          refs[value].current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      },
    }),
    [refs],
  );

  const selectedCreatures = selectedCreatureCount > 0;

  return (
    <div className="creature-list">
      {creatures.map((creature, i) => {
        const { id, selected } = creature;
        const active = activeCreatureId === id;
        const hasError = errorCreatureId === id;
        const focused = focusedCreature === i;

        if (selectedCreatures && !selected) {
          return (
            <UnselectedCreature
              creature={creature}
              active={active}
              creatureManagement={creatureManagement}
              focused={focused}
            />
          );
        }

        return (
          <div
            className="creature-scroll-effect"
            key={id}
            ref={refs[id]}
          >

            <CreatureWrapper
              creature={creature}
              selectedCreatures={selectedCreatures}
              first={i === 0}
              active={active}
              hasError={hasError}
              focused={focused || hasError}
              round={round}
              secondsElapsed={secondsElapsed}
              creatureManagement={creatureManagement}
              playerSession={playerSession}
            />
          </div>
        );
      })}

    </div>
  );
}

export default React.forwardRef(Creatures);
