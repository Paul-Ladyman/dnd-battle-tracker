import React from 'react';
import ExternalLink from './ExternalLink';
import MonsterSearchIcon from './icons/MonsterSearchIcon';
import { getRawName } from '../state/CreatureManager';

function MonsterSearcher({ search, asButton, focused }) {
  const rawSearch = getRawName(search);
  const encodedSearch = encodeURIComponent(rawSearch);
  const className = asButton ? 'button creature-title-button' : '';

  return (
    <ExternalLink
      url={`https://www.dndbeyond.com/monsters?filter-search=${encodedSearch}&sort=cr`}
      className={className}
      ariaLabel={`Search ${rawSearch} on D&D Beyond`}
      title="D&D Beyond Monster Search"
      focused={focused}
    >
      <MonsterSearchIcon />
    </ExternalLink>
  );
}

MonsterSearcher.defaultProps = {
  asButton: true,
};

export default MonsterSearcher;
