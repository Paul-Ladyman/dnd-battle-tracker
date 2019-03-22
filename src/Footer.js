import React from 'react';
import ExternalLink from './ExternalLink';
import { version } from '../package.json';

function Footer() {
  return (
    <div className="footer-text">
      Version {version}. See&nbsp;
      <ExternalLink
        url="https://paul-ladyman.github.io/dnd-battle-tracker/info"
        text="D&D Battle Tracker Info"
      />
      &nbsp;for newer versions, more info and to download this page for offline battles.
    </div>
  );
}

export default Footer;