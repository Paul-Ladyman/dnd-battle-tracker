import React from 'react';

function commaSeparate(notes, trailing) {
  const suffix = trailing ? ',' : '';
  return notes.map((note) => `${note.text[0].toUpperCase()}${note.text.substring(1)}`).join(', ') + suffix;
}

function CollapsedCreature({
  creature,
  healthPoints,
  showHealth,
}) {
  const { conditions, notes, armorClass } = creature;

  const showConditions = conditions.length > 0;
  const showNotes = notes.length > 0;
  const showAc = armorClass !== null && armorClass !== undefined;

  const showHealthComma = showHealth && (showAc || showConditions || showNotes);
  const showAcComma = showAc && (showConditions || showNotes);

  const acMarginClass = showHealth ? 'collapsed-creature--status__margin' : '';
  const conditionsMarginClass = showHealth || showAc ? 'collapsed-creature--status__margin' : '';
  const notesMarginClass = showHealth || showAc || showConditions ? 'collapsed-creature--status__margin' : '';
  return (
    <div className="collapsed-creature">
      <div className="collapsed-creature--status">
        {showHealth && healthPoints}
        {showHealthComma && ','}
        {showAc
          && (
            <div className={acMarginClass}>
              AC
              {' '}
              {armorClass}
            </div>
          )}
        {showAcComma && ', '}
        {showConditions
          && (
          <div className={`collapsed-creature--notes ${conditionsMarginClass}`}>
            {
            commaSeparate(creature.conditions, showNotes)
          }
          </div>
          )}
        {showNotes
          && (
          <div className={`collapsed-creature--notes ${notesMarginClass}`}>
            {
            commaSeparate(creature.notes, false)
          }
          </div>
          )}
      </div>
    </div>
  );
}

export default CollapsedCreature;
