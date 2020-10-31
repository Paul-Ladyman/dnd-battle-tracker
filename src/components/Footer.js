import React from 'react';
import ExternalLink from './ExternalLink';
import packageInfo from '../../package.json';
import { hotkeys, hotkeyDescriptions } from '../hotkeys/hotkeys';

function Footer() {
  const { version } = packageInfo;
  return (
    <footer className="footer-text" role="contentinfo">
      <p>
        D&D Battle Tracker is a combat tracker tool for Dungeons & Dragons 5th Edition (D&D 5e).
      </p>
      <p>
      Version {version}. See&nbsp;
      <ExternalLink
        url="https://paul-ladyman.github.io/dnd-battle-tracker"
      >D&D Battle Tracker Info</ExternalLink>
      &nbsp;for newer versions, more info and to download this page for offline battles.
      Track the initiative and status of all creatures involved in combat with this D&D combat tracker!
      </p>
      <a href='https://ko-fi.com/R5R12KANF' target='_blank'><img height='36' style={{border: '0px', height:'36px'}} src='https://cdn.ko-fi.com/cdn/kofi5.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
      <p>
        (Feature ideas and general feedback welcome).
      </p>
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
    </footer>
  );
}

export default Footer;