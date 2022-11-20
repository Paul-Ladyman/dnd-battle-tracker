import React from 'react';
import { hotkeys } from '../../../hotkeys/hotkeys';

export default function Shortcuts({ display, hotkeysToDisplay }) {
  return (
    <div
      data-testid="keyboard-shortcuts"
      id="keyboard-shortcuts"
      style={{ display }}
    >
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
    </div>
  );
}
