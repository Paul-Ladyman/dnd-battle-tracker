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
      <ExternalLink url={`/?battle=${battleId}`}>
        Player session link {battleId}
      </ExternalLink>
    );
  };

  const showSubtitle = shareEnabled || playerSession;

  const titleClasses = `main-title ${showSubtitle ? 'main-title__short' : ''}`;

  return (
    <>
      <h1 className={titleClasses}>
        <ExternalLink url="/">D&D Battle Tracker</ExternalLink>
      </h1>
      { showSubtitle && <h2 className='sub-title'><SubTitle /></h2> }
    </>
  );
}