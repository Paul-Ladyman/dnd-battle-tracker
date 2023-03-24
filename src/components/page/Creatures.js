import React, { useState, useEffect, useImperativeHandle } from 'react';
import isHotkey from 'is-hotkey';
import CreatureWrapper from '../creature/CreatureWrapper';
import { hotkeys } from '../../hotkeys/hotkeys';

function Creatures({
  creatures,
  activeCreatureId,
  focusedCreature,
  setFocus,
  round,
  secondsElapsed,
  creatureManagement,
  playerSession,
}, forwardedRef) {
  const [toolbarFocused, setToolbarFocused] = useState(false);

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

  const hotKeyHandler = (event) => {
    const focusToolbar = isHotkey(hotkeys.focusCreatureToolbar, event);
    const focusCreature = isHotkey(hotkeys.focusCreature, event);
    if (focusToolbar || focusCreature) {
      setToolbarFocused((prevToolbarFocused) => !prevToolbarFocused);
    }
  };

  useEffect(() => {
    if (!playerSession) {
      window.addEventListener('keydown', hotKeyHandler);
      return () => window.removeEventListener('keydown', hotKeyHandler);
    }
    return undefined;
  }, []);

  return (
    <div className="creature-list">
      {creatures.map((creature, i) => {
        const { id } = creature;
        const active = activeCreatureId === id;
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
              focused={focused}
              toolbarFocused={toolbarFocused}
              setFocus={setFocus}
              setToolbarFocus={setToolbarFocused}
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
