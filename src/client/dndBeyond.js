/* eslint-disable import/prefer-default-export */
const monsterIndexMap = {
  'giant-rat-diseased': 'diseased-giant-rat',
  'succubus-incubus': 'succubus',
  'swarm-of-beetles': 'swarm-of-insects-beetles',
  'swarm-of-centipedes': 'swarm-of-insects-centipedes',
  'swarm-of-spiders': 'swarm-of-insects-spiders',
  'swarm-of-wasps': 'swarm-of-insects-wasps',
  'vampire-bat': 'vampire',
  'vampire-mist': 'vampire',
  'vampire-vampire': 'vampire',
  'werebear-bear': 'werebear',
  'werebear-human': 'werebear',
  'werebear-hybrid': 'werebear',
  'wereboar-boar': 'wereboar',
  'wereboar-human': 'wereboar',
  'wereboar-hybrid': 'wereboar',
  'wererat-human': 'wererat',
  'wererat-hybrid': 'wererat',
  'wererat-rat': 'wererat',
  'weretiger-human': 'weretiger',
  'weretiger-hybrid': 'weretiger',
  'weretiger-tiger': 'weretiger',
  'werewolf-human': 'werewolf',
  'werewolf-hybrid': 'werewolf',
  'werewolf-wolf': 'werewolf',
};

export function monsterUrlFrom5eApiIndex(index) {
  if (typeof index !== 'string' || index.length === 0) return null;
  const dndBeyondIndex = monsterIndexMap[index] || index;
  return `https://www.dndbeyond.com/monsters/${dndBeyondIndex}`;
}
