import React, { useEffect, useRef } from 'react';
import UncheckedIcon from '../icons/UncheckedIcon';
import InitiativeIcon from '../icons/InitiativeIcon';

export default function UnselectedCreature({
  creature,
  active,
  creatureManagement,
  focused,
}) {
  const ref = useRef(null);
  const { id, selected, alive } = creature;
  const { toggleSelect } = creatureManagement;
  const ariaChecked = selected ? 'true' : 'false';
  const nameModifier = alive ? '' : 'collapsed-creature--name__dead';
  const onClick = () => toggleSelect(id);
  const onKeyDown = (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      toggleSelect(id);
    }
  };

  useEffect(() => {
    if (focused) ref?.current?.focus();
  }, [focused]);

  return (
    <div
      tabIndex="0"
      className={`unselected-creature button ${nameModifier}`}
      role="checkbox"
      aria-checked={ariaChecked}
      onClick={onClick}
      onKeyDown={onKeyDown}
      ref={ref}
    >
      <UncheckedIcon />
      <h2 className="creature-name creature-header">
        {creature.name}
      </h2>
      {active && <InitiativeIcon className="creature-expander-icon" title="Active creature" />}
    </div>
  );
}
