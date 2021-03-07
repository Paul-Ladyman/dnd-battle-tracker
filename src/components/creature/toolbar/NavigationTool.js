import React from 'react';

export default function NavigationTool({
  name,
  previous,
  navRef,
  navFunc,
}) {
  const title = previous ? 'Previous creature tools' : 'Next creature tools';
  const icon = previous ? '<' : '>';
  const toolClass = 'creature-toolbar--button';

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
