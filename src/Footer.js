import React from 'react';
import ExternalLink from './ExternalLink';
import { version } from '../package.json';

function Footer() {
  return (
    <div className="footer-text">
      Version {version}. Check&nbsp;
      <ExternalLink
        url="https://paul-ladyman.github.io/dnd-battle-tracker/"
        text="D&D Battle Tracker"
      />
      &nbsp;for newer versions.
    </div>
  );
}

export default Footer;