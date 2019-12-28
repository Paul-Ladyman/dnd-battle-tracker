import React from 'react';
import ExternalLink from './ExternalLink';
import MonsterSearchIcon from './icons/MonsterSearchIcon';

function MonsterSearcher({ search }) {
  const encodedSearch = encodeURIComponent(search);

  return (<ExternalLink
    url={`https://www.dndbeyond.com/monsters?filter-search=${encodedSearch}&sort=cr`} 
    className="button creature-title-button"
    ariaLabel={`Search ${search} on D&D Beyond`}
    title="D&D Beyond Monster Search"
  ><MonsterSearchIcon /></ExternalLink>);


}

export default MonsterSearcher;