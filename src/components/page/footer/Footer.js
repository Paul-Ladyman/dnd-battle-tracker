import React from 'react';
import ExternalLink from '../ExternalLink';
import Help from './Help';
import BuyMeACoffee from '../BuyMeACoffee';

function Footer({ playerSession, error }) {
  return (
    <footer className="footer-text" role="contentinfo">
      { error
        && (
        <p>
          Bugs can be reported through
          {' '}
          <ExternalLink url="https://github.com/Paul-Ladyman/dnd-battle-tracker/issues/new">Github issues</ExternalLink>
          .
        </p>
        )}
      <p>
        D&D Battle Tracker is an initiative and combat tracker tool
        {' '}
        for Dungeons & Dragons 5th Edition (D&D 5e).
      </p>
      { !error
        && (
        <>
          <Help playerSession={playerSession} />
          <BuyMeACoffee mobileOnly />
        </>
        )}
    </footer>
  );
}

export default Footer;
