import React, { useState } from 'react';
import Highlighter from 'react-highlight-words';

import {
  beautifySnakeWord, capitalizeWord, getAbilityWithSign, getModifierSign, getProficiencyBonus,
} from '../../util/characterSheet';
import ExternalLink from '../page/ExternalLink';

const SAVING_THROW_CUT = 'Saving Throw:';
const SKILL_CUT = 'Skill:';
const HIT_CUT = 'Hit:';

// word before damage highlight
// "/\b\w+\b damage /gm"

const renderHighlighter = (text) => {
  try {
    const splitText = text.split(HIT_CUT);
    if (splitText.length === 0) {
      return <p>text</p>;
    }
    const attackRegexp = /\d+d\d+([+,-,*,/]\d+)?/g;
    const attackWords = text.match(attackRegexp) ?? [];

    const damageRegexp = /\+\d+ to hit/g;
    const damageWords = text.match(damageRegexp) ?? [];

    const allWords = [...attackWords, ...damageWords];

    return splitText.map((item, index) => {
      const finalWords = allWords.filter((word) => item.includes(word));
      const textLine = index === 0 ? item : `${HIT_CUT}${item}`;

      return (

        <Highlighter
          key={textLine}
          searchWords={finalWords}
          autoEscape
          textToHighlight={textLine}
          activeClassName={index === 0 ? 'attack-highlight' : 'damage-highlight'}
          highlightClassName={index === 0 ? 'attack-highlight' : 'damage-highlight'}
        />

      );
    });
  } catch (error) {
    console.log('regex error', error);
    return <p>text</p>;
  }
};

export default function CreatureStats({
  creature,
}) {
  const [showCreatureStats, setCreatureStats] = useState(true);

  const savingThrows = creature.proficiencies ? creature.proficiencies.filter((ability) => ability.proficiency?.index.includes('saving-throw')) : [];
  const skills = creature.proficiencies ? creature.proficiencies.filter((ability) => ability.proficiency?.index.includes('skill')) : [];

  console.log(`creature ${creature.name}`, creature);

  const toggleCreatureStats = () => {
    setCreatureStats((prevValue) => !prevValue);
  };

  if (!showCreatureStats) {
    return (
      <div className="creature-title-header">
        <button id="close-creature-stats" type="button" onClick={toggleCreatureStats}>▼ Show  stats</button>
      </div>
    );
  }

  return (

    <div className="stat-block wide">
      <div className="section-left">
        <div className="creature-heading">
          <div className="creature-title-header">
            <h1 id="creature-header-text">{creature.name}</h1>
            <button id="close-creature-stats" type="button" onClick={toggleCreatureStats}>▲ Hide  stats</button>
          </div>

          <h2>
            {creature.size}
            {' '}
            {creature.type}
            ,
            {' '}
            {creature.alignment}
          </h2>
        </div>
        <svg height="5" width="100%" className="tapered-rule">
          <polyline points="0,0 400,2.5 0,5" />
        </svg>
        <div className="top-stats">
          <div className="property-line first">
            <h4>Armor Class - </h4>
            <p>{creature.armor_class}</p>
          </div>
          <div className="property-line">
            <h4>Hit Points - </h4>
            <p>
              {creature.hit_points}
              {' '}
              (
              {creature.hit_dice}
              )
            </p>
          </div>
          {creature.speed && (
          <div className="property-line last">
            <h4>Speed: </h4>
            {Object.keys(creature.speed).map((key) => (
              <p key={key}>
                {' '}
                {capitalizeWord(key)}
                {creature.speed[key] && typeof creature.speed[key] === 'string' && (
                  <>
                    {': '}
                    {creature.speed[key]}
                    {', '}
                  </>
                )}

              </p>
            ))}
          </div>
          )}
          <svg height="5" width="100%" className="tapered-rule">
            <polyline points="0,0 400,2.5 0,5" />
          </svg>
          <div className="abilities">
            <div className="ability-strength">
              <h4>STR</h4>
              <p>{`${creature.strength}  ${getAbilityWithSign(creature.strength)}`}</p>
            </div>
            <div className="ability-dexterity">
              <h4>DEX</h4>
              <p>{`${creature.dexterity}  ${getAbilityWithSign(creature.dexterity)}`}</p>
            </div>
            <div className="ability-constitution">
              <h4>CON</h4>
              <p>{`${creature.constitution}  ${getAbilityWithSign(creature.constitution)}`}</p>
            </div>
            <div className="ability-intelligence">
              <h4>INT</h4>
              <p>{`${creature.intelligence}  ${getAbilityWithSign(creature.intelligence)}`}</p>
            </div>
            <div className="ability-wisdom">
              <h4>WIS</h4>
              <p>{`${creature.wisdom}  ${getAbilityWithSign(creature.wisdom)}`}</p>
            </div>
            <div className="ability-charisma">
              <h4>CHA</h4>
              <p>{`${creature.charisma}  ${getAbilityWithSign(creature.charisma)}`}</p>
            </div>
          </div>
          <svg height="5" width="100%" className="tapered-rule">
            <polyline points="0,0 400,2.5 0,5" />
          </svg>
          {creature.damage_immunities?.length > 0 && (
            <div className="property-line first">
              <h4>Damage Immunities: </h4>
              {creature.damage_immunities.map((name) => (
                <p key={name}>
                  {capitalizeWord(name)}
                  ,
                  {' '}
                </p>
              ))}
            </div>
          )}
          {creature.damage_resistances?.length > 0 && (
          <div className="property-line first">
            <h4>Damage Resistances: </h4>
            {creature.damage_resistances.map((name) => (
              <p key={name}>
                {capitalizeWord(name)}
                ,
                {' '}
              </p>
            ))}
          </div>
          )}

          {creature.condition_immunities?.length > 0 && (
          <div className="property-line first">
            <h4>Condition Immunities: </h4>
            {creature.condition_immunities.map((data) => (
              <ExternalLink
                key={data.key}
                url={`https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#${data.name}`}
              >
                <p>
                  {data.name}
                  ,
                  {' '}
                </p>
              </ExternalLink>

            ))}
          </div>
          )}
          {creature.damage_vulnerabilities?.length > 0 && (
            <div className="property-line first">
              <h4>Damage Vulnerabilities: </h4>
              {creature.damage_vulnerabilities.map((name) => (
                <p key={name}>{name}</p>
              ))}
            </div>
          )}

          {savingThrows.length > 0 && (
          <div className="property-line">
            <h4>Saving Throws: </h4>
            {savingThrows.map((savingThrow) => (
              <p key={savingThrow.proficiency.index}>
                {' '}
                {savingThrow.proficiency.name.replace(SAVING_THROW_CUT, '')}
                {': '}
                {getModifierSign(savingThrow.value)}
                {savingThrow.value}
                {', '}
              </p>
            ))}
          </div>
          )}

          {skills.length > 0 && (
          <div className="property-line">
            <h4>Skills: </h4>
            {skills.map((skill) => (
              <p key={skill.proficiency.index}>
                {' '}
                {skill.proficiency.name.replace(SKILL_CUT, '')}
                {': '}
                {getModifierSign(skill.value)}
                {skill.value}
                {', '}
              </p>
            ))}
          </div>
          )}

          {creature.senses && (
          <div className="property-line">
            <h4>Senses: </h4>
            {Object.keys(creature.senses).map((key) => (
              <p key={key}>
                {' '}
                {beautifySnakeWord(key)}
                {' '}
                {creature.senses[key]}
                {', '}
              </p>
            ))}
          </div>
          )}
          {creature.languages && (
          <div className="property-line">
            <h4>Languages: </h4>
            <p>{creature.languages}</p>
          </div>
          )}
          {creature.challenge_rating && (
          <div className="property-line last flexRow">
            <div>
              <h4>Challenge </h4>
              <p>
                {creature.challenge_rating}
                {' '}
                {creature.xp && <span>{` (${creature.xp} XP) `}</span>}
              </p>
            </div>
            <div className="proficiency-bonus">
              <h4>Proficiency Bonus </h4>
              {' '}
              <p>
                {getModifierSign(creature.challenge_rating)}
                {getProficiencyBonus(creature.challenge_rating)}
              </p>
            </div>
          </div>
          )}

        </div>
        <svg height="5" width="100%" className="tapered-rule">
          <polyline points="0,0 400,2.5 0,5" />
        </svg>

        {creature.special_abilities?.length > 0 && creature.special_abilities.map((ability) => (
          <div key={ability.name} className="property-block">
            <h4>
              {ability.name}
              .
              {' '}
            </h4>
            <p>
              {renderHighlighter(ability.desc)}
              {' '}
            </p>
          </div>
        ))}

      </div>
      <div className="section-right">
        {creature.actions?.length > 0 && (
          <div className="actions">
            <h3>Actions</h3>
            {creature.actions.map((action) => (
              <div key={action.name} className="property-block">
                <h4>
                  {action.name}
                  .
                  {' '}
                </h4>
                <p>
                  {renderHighlighter(action.desc)}
                  {' '}
                </p>
              </div>
            ))}
          </div>
        )}

        {creature.legendary_actions?.length > 0 && (
        <div className="actions">
          <h3>Legendary Actions</h3>
          {creature.legendary_actions.map((action) => (
            <div key={action.name} className="property-block">
              <h4>
                {action.name}
                .
                {' '}
              </h4>
              <p>
                {renderHighlighter(action.desc)}
                {' '}
              </p>
            </div>
          ))}
        </div>
        )}

      </div>
    </div>
  );
}
