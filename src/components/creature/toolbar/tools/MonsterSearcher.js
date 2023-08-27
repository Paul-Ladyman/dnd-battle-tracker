import React from 'react';
import ExternalLink from '../../../page/ExternalLink';
import MonsterSearchIcon from '../../../icons/MonsterSearchIcon';
import { getRawName } from '../../../../state/CreatureManager';

function MonsterSearcher({ search }) {
  const rawSearch = getRawName(search);
  const encodedSearch = encodeURIComponent(rawSearch);
  const toolbarClass = 'creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const largeButtonClass = `${buttonClass}__large`;

  return (
    <ExternalLink
      url={`https://www.dndbeyond.com/monsters?filter-search=${encodedSearch}&sort=cr`}
      className={`button ${textButtonClass} ${largeButtonClass}`}
      ariaLabel={`Search ${rawSearch} on D&D Beyond`}
      title="D&D Beyond Monster Search"
    >
      <MonsterSearchIcon />
      Search Stat Block
    </ExternalLink>
  );
}

MonsterSearcher.defaultProps = {
  asButton: true,
};

export default MonsterSearcher;
