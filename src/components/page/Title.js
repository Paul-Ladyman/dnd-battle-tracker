import React, { useEffect, useState } from 'react';
import ExternalLink from './ExternalLink';

function ErrorSubTitle() {
  return 'Something went wrong!';
}

function DungeonMasterSubTitle({ battleId }) {
  const [playerLink, setPlayerLink] = useState({ url: null, copied: false });

  useEffect(() => {
    if (battleId) {
      const { href } = window.location;
      const url = `${href}?battle=${battleId}`;
      const copyPlayerLink = async () => {
        try {
          await window.navigator.clipboard.writeText(url);
          setPlayerLink({ url, copied: true });
        } catch {
          setPlayerLink({ url, copied: false });
        }
      };
      copyPlayerLink();
    }
  }, [battleId]);

  const { url, copied } = playerLink;

  if (!battleId || !url) {
    return (<>. . .</>);
  }

  return (
    <ExternalLink url={url}>
      Player session
      {` ${battleId}`}
      { copied && ' (link copied)'}
    </ExternalLink>
  );
}

function SubTitle({
  error,
  playerSession,
  battleId,
}) {
  if (error) {
    return (<ErrorSubTitle />);
  }

  if (playerSession) {
    return `Player Session ${battleId}`;
  }

  return (<DungeonMasterSubTitle battleId={battleId} />);
}

export default function Title({
  shareEnabled, battleId, playerSession, error,
}) {
  const showSubtitle = error || shareEnabled || playerSession;

  const titleClasses = `main-title ${showSubtitle ? 'main-title__short' : ''}`;

  return (
    <>
      <h1 className={titleClasses}>
        <ExternalLink url="/">D&D Battle Tracker</ExternalLink>
      </h1>
      { showSubtitle && (
        <h2 className="sub-title">
          <SubTitle
            error={error}
            playerSession={playerSession}
            battleId={battleId}
          />
        </h2>
      )}
    </>
  );
}
