import React from 'react';
import NextIcon from '../../icons/NextIcon';
import PreviousIcon from '../../icons/PreviousIcon';

export default function NavigationTool({
  name,
  previous,
  navRef,
  navFunc,
}) {
  const title = previous ? 'Previous creature tools' : 'More creature tools';
  const icon = previous ? <PreviousIcon /> : <NextIcon />;
  const buttonClass = 'creature-toolbar--button';
  const toolClass = `${buttonClass} ${buttonClass}__navigation`;

  return (
    <button
      className={toolClass}
      aria-label={`${name} ${title}`}
      title={title}
      onClick={navFunc}
      type="button"
      ref={navRef}
    >
      {icon}
    </button>
  );
}
