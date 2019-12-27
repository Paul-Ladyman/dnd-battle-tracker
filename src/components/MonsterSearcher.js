import React from 'react';
import ExternalLink from './ExternalLink';
import MonsterSearchIcon from './icons/MonsterSearchIcon';

function MonsterSearcher({ search }) {
  const encodedSearch = encodeURIComponent(search);

  return (<ExternalLink
    url={`https://www.dndbeyond.com/monsters?filter-search=${encodedSearch}`} 
    text={<MonsterSearchIcon />}
    className="button expand-creature-button"
    ariaLabel={`Search ${search} on D&D Beyond`}
    title="D&D Beyond Monster Search"
  />);


}

export default MonsterSearcher;