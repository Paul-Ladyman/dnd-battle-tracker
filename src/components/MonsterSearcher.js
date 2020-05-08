import React from 'react';
import ExternalLink from './ExternalLink';
import MonsterSearchIcon from './icons/MonsterSearchIcon';

function MonsterSearcher({ search, asButton }) {
  const encodedSearch = encodeURIComponent(search);
  const className = asButton ? 'button creature-title-button' : '';

  return (<ExternalLink
    url={`https://www.dndbeyond.com/monsters?filter-search=${encodedSearch}&sort=cr`} 
    className={className}
    ariaLabel={`Search ${search} on D&D Beyond`}
    title="D&D Beyond Monster Search"
  ><MonsterSearchIcon /></ExternalLink>);
}

MonsterSearcher.defaultProps = {
  asButton: true
}

export default MonsterSearcher;