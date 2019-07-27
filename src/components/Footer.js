import React from 'react';
import ExternalLink from './ExternalLink';
import { version } from '../../package.json';
import { hotkeys, hotkeyDescriptions } from '../hotkeys/hotkeys';

function Footer() {
  return (
    <footer className="footer-text" role="contentinfo">
      <p>D&D Battle Tracker is a combat tracker tool for Dungeons & Dragons 5th Edition (D&D 5e). Track the initiative and status of all creatures involved in combat.</p>
      <div className="footer-text--shortcuts">
        <p>Keyboard shortcuts (mod is Ctrl or Cmd on Mac):</p>
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
        url="https://paul-ladyman.github.io/dnd-battle-tracker"
        text="D&D Battle Tracker Info"
      />
      &nbsp;for newer versions, more info and to download this page for offline battles.
      </p>
    </footer>
  );
}

export default Footer;