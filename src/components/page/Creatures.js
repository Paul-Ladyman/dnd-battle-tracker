import React, { useImperativeHandle } from 'react';
import CreatureWrapper from '../creature/CreatureWrapper';

function Creatures({
  creatures,
  activeCreatureId,
  errorCreatureId,
  focusedCreature,
  round,
  secondsElapsed,
  creatureManagement,
  playerSession,
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

  return (
    <div className="creature-list">
      {creatures.map((creature, i) => {
        const { id } = creature;
        const active = activeCreatureId === id;
        const hasError = errorCreatureId === id;
        const focused = focusedCreature === i;
        return (
          <div
            className="creature-scroll-effect"
            key={id}
            ref={refs[id]}
          >

            <CreatureWrapper
              creature={creature}
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
