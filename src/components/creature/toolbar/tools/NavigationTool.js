import React from 'react';
import PageNavigationIcon from '../../icons/PageNavigationIcon';

export default function NavigationTool({
  name,
  previous,
  navRef,
  navFunc,
}) {
  const title = previous ? 'Previous creature tools' : 'More creature tools';
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
      <PageNavigationIcon previous={previous} />
    </button>
  );
}
