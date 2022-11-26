import React from 'react';
import { hotkeys, hotkeyDescriptions, playerSessionHotkeyDescriptions } from '../../../hotkeys/hotkeys';

export default function Shortcuts({ playerSession }) {
  const hotkeysToDisplay = playerSession ? playerSessionHotkeyDescriptions : hotkeyDescriptions;
  return (
    <>
      <p>Mod is Ctrl or Cmd on Mac.</p>
      <ul>
        {Object.keys(hotkeysToDisplay).map((key) => {
          const hotkey = hotkeys[key];
          const hotkeyDescription = hotkeysToDisplay[key];
          return (
            <li key={hotkey}>
              <b>{hotkey}</b>
              {' '}
              {hotkeyDescription}
            </li>
          );
        })}
      </ul>
    </>
  );
}
