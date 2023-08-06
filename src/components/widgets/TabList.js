import React, { useState } from 'react';

export default function TabList({
  id,
  labelledBy,
  tabs,
  panels,
  customClasses,
}) {
  const [selected, setSelected] = useState(0);

  const onClick = (tab) => setSelected(tab);

  return (
    <div className={`tablist-container ${customClasses}`}>
      <div role="tablist" className="tablist" aria-labelledby={labelledBy}>
        {tabs.map((tab, i) => {
          const isSelected = i === selected;
          const key = `${id}-${tab}`;
          const panelId = `${id}-${tab}-panel`;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              key={key}
              id={key}
              onClick={() => onClick(i)}
            >
              {tab}
            </button>
          );
        })}
      </div>
      {
        panels.map((panel, i) => {
          const display = i === selected ? 'block' : 'none';
          const tab = tabs[i];
          const tabId = `${id}-${tab}`;
          const key = `${id}-${tab}-panel`;
          return (
            <div role="tabpanel" key={key} id={key} aria-labelledby={tabId} style={{ display }}>
              {panel}
            </div>
          );
        })
      }
    </div>
  );
}
