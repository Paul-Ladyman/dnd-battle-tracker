import React from 'react';
import ExternalLink from './ExternalLink';
import { version } from '../package.json';

function Footer() {
  return (
    <div className="footer-text">
      <p className="footer-text--shortcuts">Hint: Press alt+. to advance to the next creature in the initiative order.</p>
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