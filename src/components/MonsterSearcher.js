import React from 'react';
import ExternalLink from './ExternalLink';
import MonsterSearchIcon from './icons/MonsterSearchIcon';

function MonsterSearcher({ search }) {
  const monsterSearchButton = <button
    aria-label={`Search ${search} on D&D Beyond`}
    className="expand-creature-button"
    title="D&D Beyond Monster Search">
      {<MonsterSearchIcon />}
  </button>

  return (<ExternalLink
    url={`https://www.dndbeyond.com/monsters?filter-search=${search}`} 
    text={monsterSearchButton}
  />);


}

export default MonsterSearcher;