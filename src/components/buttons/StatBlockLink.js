import React from 'react';
import ExternalLink from '../page/ExternalLink';
import StatBlockIcon from '../icons/StatBlockIcon';

function StatBlockLink({ url }) {
  return (
    <ExternalLink
      url={url}
      className="button creature-title-button"
      ariaLabel="Stat Block"
      title="Stat Block"
    >
      <StatBlockIcon />
    </ExternalLink>
  );
}

export default StatBlockLink;
