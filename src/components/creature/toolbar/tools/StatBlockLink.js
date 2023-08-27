import React from 'react';
import ExternalLink from '../../../page/ExternalLink';
import StatBlockIcon from '../../../icons/StatBlockIcon';

function StatBlockLink({ url }) {
  const toolbarClass = 'creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;

  return (
    <ExternalLink
      url={url}
      className={`button ${textButtonClass}`}
      ariaLabel="Stat Block"
    >
      <StatBlockIcon />
      Stat Block
    </ExternalLink>
  );
}

export default StatBlockLink;
