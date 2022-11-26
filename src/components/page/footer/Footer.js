import React from 'react';
import ExternalLink from '../ExternalLink';
import Help from './Help';

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
        D&D Battle Tracker is a combat tracker tool for Dungeons & Dragons 5th Edition.
      </p>
      { !error
        && (
        <>
          <Help playerSession={playerSession} />
          <a href="https://ko-fi.com/R5R12KANF" target="_blank" rel="noreferrer"><img height="36" style={{ border: '0px', height: '36px' }} src="https://cdn.ko-fi.com/cdn/kofi4.png?v=3" border="0" alt="Buy Me a Coffee at ko-fi.com" /></a>
        </>
        )}
    </footer>
  );
}

export default Footer;
