import React from 'react';
import ExternalLink from './ExternalLink';

function SubTitle({
  error,
  playerSession,
  loading,
  battleId,
  playerLinkCopied,
}) {
  if (error) {
    return (<>Something went wrong!</>);
  }

  if (playerSession && loading) {
    return (
      <>
        Loading player Session
        {` ${battleId} ...`}
      </>
    );
  }

  if (playerSession && !loading) {
    return (
      <>
        Player Session
        {` ${battleId}`}
      </>
    );
  }

  if (!battleId) {
    return (<>. . .</>);
  }

  return (
    <ExternalLink url={`/?battle=${battleId}`}>
      Player session
      {` ${battleId}`}
      { playerLinkCopied && ' (link copied)'}
    </ExternalLink>
  );
}

export default function Title({
  shareEnabled, battleId, playerLinkCopied, playerSession, error, loading,
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
            loading={loading}
            battleId={battleId}
            playerLinkCopied={playerLinkCopied}
          />
        </h2>
      )}
    </>
  );
}
