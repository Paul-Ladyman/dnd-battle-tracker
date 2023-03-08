/* eslint-disable max-len */
import React from 'react';
import Highlighter from 'react-highlight-words';
import Disclosure from '../widgets/Disclosure';
import Separator from './Separator';

import {
  beautifySnakeWord, capitalizeWord, DamageTypesObject, getAbilityWithSign, getModifierSign, getProficiencyBonus,
} from '../../util/characterSheet';
import ExternalLink from '../page/ExternalLink';

const SAVING_THROW_CUT = 'Saving Throw:';
const SKILL_CUT = 'Skill:';
const HIT_CUT = 'Hit:';

const renderHighlighter = (text) => {
  try {
    const splitText = text.split(HIT_CUT);
    if (splitText.length === 0) {
      return <p>text</p>;
    }

    const attackRegexp = /\d+d\d+( \+ \d+)?/g;
    const attackWords = text.match(attackRegexp) ?? [];

    const damageRegexp = /\+\d+ to hit/g;
    const damageWords = text.match(damageRegexp) ?? [];

    const allWords = [...attackWords, ...damageWords];

    return splitText.map((item, index) => {
      const finalWords = allWords.filter((word) => item.includes(word));
      const textLine = index === 0 ? item : `${HIT_CUT}${item}`;

      const isAttackType = splitText.length === 2 && index === 0;

      const damageTypeRegexp = /\b\w+\b damage/g;
      const foundDamages = textLine.match(damageTypeRegexp) ?? [];

      const filterDamageTypes = foundDamages.map((currentDamage) => currentDamage.replace(' damage', '')).filter((thisDamage) => thisDamage.toLowerCase() in DamageTypesObject);
      const finalDamageTypesArr = Array.from(new Set(filterDamageTypes));

      const sentence = textLine.split(' ');

      const newSentence = sentence.map((word) => {
        if (finalDamageTypesArr.includes(word)) {
          return `${word} ${DamageTypesObject[word]}`;
        }
        return word;
      }).join(' ');

      return (

        <Highlighter
          key={textLine}
          searchWords={finalWords}
          autoEscape
          textToHighlight={newSentence}
          activeClassName={isAttackType ? 'attack-highlight' : 'damage-highlight'}
          highlightClassName={isAttackType ? 'attack-highlight' : 'damage-highlight'}
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
  const savingThrows = creature.proficiencies ? creature.proficiencies.filter((ability) => ability.proficiency?.index.includes('saving-throw')) : [];
  const skills = creature.proficiencies ? creature.proficiencies.filter((ability) => ability.proficiency?.index.includes('skill')) : [];

  return (
    <Disclosure id={`${creature.name}-stat-block`} name="Stat Block" indent={false} className="stat-block-wrapper">
      <div className="stat-block wide">
        <div className="section-left">
          <div className="creature-heading">
            <h2>
              {creature.size}
              {' '}
              {creature.type}
              ,
              {' '}
              {creature.alignment}
            </h2>
          </div>
          <Separator />
          <div className="top-stats">
            {creature.speed && (
            <div className="property-line last">
              <h3>Speed: </h3>
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
            <Separator />
            <div className="abilities">
              <div className="ability-strength">
                <h3>STR</h3>
                <p>{`${creature.strength}  ${getAbilityWithSign(creature.strength)}`}</p>
              </div>
              <div className="ability-dexterity">
                <h3>DEX</h3>
                <p>{`${creature.dexterity}  ${getAbilityWithSign(creature.dexterity)}`}</p>
              </div>
              <div className="ability-constitution">
                <h3>CON</h3>
                <p>{`${creature.constitution}  ${getAbilityWithSign(creature.constitution)}`}</p>
              </div>
              <div className="ability-intelligence">
                <h3>INT</h3>
                <p>{`${creature.intelligence}  ${getAbilityWithSign(creature.intelligence)}`}</p>
              </div>
              <div className="ability-wisdom">
                <h3>WIS</h3>
                <p>{`${creature.wisdom}  ${getAbilityWithSign(creature.wisdom)}`}</p>
              </div>
              <div className="ability-charisma">
                <h3>CHA</h3>
                <p>{`${creature.charisma}  ${getAbilityWithSign(creature.charisma)}`}</p>
              </div>
            </div>
            <Separator />
            {creature.damage_immunities?.length > 0 && (
              <div className="property-line first">
                <h3>Damage Immunities: </h3>
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
              <h3>Damage Resistances: </h3>
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
              <h3>Condition Immunities: </h3>
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
                <h3>Damage Vulnerabilities: </h3>
                {creature.damage_vulnerabilities.map((name) => (
                  <p key={name}>{name}</p>
                ))}
              </div>
            )}

            {savingThrows.length > 0 && (
            <div className="property-line">
              <h3>Saving Throws: </h3>
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
              <h3>Skills: </h3>
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
              <h3>Senses: </h3>
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
              <h3>Languages: </h3>
              <p>{creature.languages}</p>
            </div>
            )}
            {creature.challenge_rating && (
            <div className="property-line last flexRow">
              <div>
                <h3>Challenge </h3>
                <p>
                  {creature.challenge_rating}
                  {' '}
                  {creature.xp && <span>{` (${creature.xp} XP) `}</span>}
                </p>
              </div>
              <div className="proficiency-bonus">
                <h3>Proficiency Bonus </h3>
                {' '}
                <p>
                  {getModifierSign(creature.challenge_rating)}
                  {getProficiencyBonus(creature.challenge_rating)}
                </p>
              </div>
            </div>
            )}

          </div>
          <Separator />

          {creature.special_abilities?.length > 0 && creature.special_abilities.map((ability) => (
            <div key={ability.name} className="property-block">
              <h3>
                {ability.name}
                .
                {' '}
              </h3>
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
    </Disclosure>
  );
}
