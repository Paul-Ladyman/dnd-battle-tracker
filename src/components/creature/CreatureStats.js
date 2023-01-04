import React, { useState } from 'react';
import ExternalLink from '../page/ExternalLink';

export default function CreatureStats({
  creature,
}) {
  const [showCreatureStats, setCreatureStats] = useState(true);

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
            <h1>{creature.name}</h1>
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
                {key}
                {' - '}
                {creature.speed[key]}
                {', '}
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
              <p>{creature.strength}</p>
            </div>
            <div className="ability-dexterity">
              <h4>DEX</h4>
              <p>{creature.dexterity}</p>
            </div>
            <div className="ability-constitution">
              <h4>CON</h4>
              <p>{creature.constitution}</p>
            </div>
            <div className="ability-intelligence">
              <h4>INT</h4>
              <p>{creature.intelligence}</p>
            </div>
            <div className="ability-wisdom">
              <h4>WIS</h4>
              <p>{creature.wisdom}</p>
            </div>
            <div className="ability-charisma">
              <h4>CHA</h4>
              <p>{creature.charisma}</p>
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
                  {name}
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
                {name}
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

          {creature.senses && (
          <div className="property-line">
            <h4>Senses: </h4>
            {Object.keys(creature.senses).map((key) => (
              <p key={key}>
                {' '}
                {key}
                {' - '}
                <b>{creature.senses[key]}</b>
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
          <div className="property-line last">
            <h4>Challenge - </h4>
            <p>{creature.challenge_rating}</p>
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
            <p>{ability.desc}</p>
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
                <p>{action.desc}</p>
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
              <p>{action.desc}</p>
            </div>
          ))}
        </div>
        )}

      </div>
    </div>
  );
}
