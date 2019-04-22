import React from 'react';
import ExternalLink from './ExternalLink';
import { version } from '../package.json';
import { hotkeys, hotkeyDescriptions } from './hotkeys';

function Footer() {
  return (
    <div className="footer-text">
      <div className="footer-text--shortcuts">
        <p>Keyboard shortcuts:</p>
        <ul>
          {Object.keys(hotkeys).map((key, i) => {
            const hotkey = hotkeys[key]; 
            return (
              <li key={i}><b>{hotkey}</b> {hotkeyDescriptions[key]}</li>
            );
          })}
        </ul>
      </div>
      <p>
      Version {version}. See&nbsp;
      <ExternalLink
        url="https://paul-ladyman.github.io/dnd-battle-tracker/info"
        text="D&D Battle Tracker Info"
      />
      &nbsp;for newer versions, more info and to download this page for offline battles.
      </p>
    </div>
  );
}

export default Footer;