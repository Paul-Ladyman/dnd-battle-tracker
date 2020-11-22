import React from 'react';
import ExternalLink from './ExternalLink';

export default function Title({ shareEnabled, battleId, playerSession, error}) {
  const SubTitle = () => {
    if (error) {
      return ( <>Something went wrong!</> );
    }

    if (playerSession) {
      return ( <>Player Session {battleId}</> );
    }

    return (
      <>
        DM Session <ExternalLink url={`/?battle=${battleId}`}>
          {battleId}
        </ExternalLink>
      </>
    );
  };

  const showSubtitle = shareEnabled || playerSession;

  const titleClasses = `main-title ${showSubtitle ? 'main-title__short' : ''}`;

  return (
    <>
      <h1 className={titleClasses}>
        D&D Battle Tracker
      </h1>
      { showSubtitle && <h2 className='sub-title'><SubTitle /></h2> }
    </>
  );
}