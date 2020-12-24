import React, { useState, useEffect } from 'react';
import isHotkey from 'is-hotkey';
import CreatureWrapper from './CreatureWrapper';
import { hotkeys } from '../hotkeys/hotkeys';

function Creatures({
  creatures,
  activeCreature,
  focusedCreature,
  setFocus,
  conditions,
  round,
  secondsElapsed,
  creatureManagement,
  playerSession,
}) {
  const [toolbarFocused, setToolbarFocused] = useState(false);

  const hotKeyHandler = (event) => {
    if (isHotkey(hotkeys.focusCreatureToolbar, event)) {
      setToolbarFocused(true);
    }

    if (isHotkey(hotkeys.focusCreature, event)) {
      setToolbarFocused(false);
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
        const active = activeCreature === i;
        const focused = focusedCreature === i;
        return (
          <React.Fragment key={creature.id}>
            <CreatureWrapper
              creature={creature}
              active={active}
              focused={focused}
              toolbarFocused={toolbarFocused}
              setFocus={setFocus}
              round={round}
              secondsElapsed={secondsElapsed}
              creatureManagement={creatureManagement}
              conditions={conditions}
              playerSession={playerSession}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default Creatures;
