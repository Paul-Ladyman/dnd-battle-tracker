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
          const { label, id: tabId } = tab;
          const isSelected = i === selected;
          const key = `${id}-${tabId}`;
          const panelId = `${id}-${tabId}-panel`;
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
              {label}
            </button>
          );
        })}
      </div>
      {
        panels.map((panel, i) => {
          const panelSelected = i === selected;
          const display = panelSelected ? 'block' : 'none';
          const { id: tab } = tabs[i];
          const tabId = `${id}-${tab}`;
          const key = `${id}-${tab}-panel`;
          return (
            <div role="tabpanel" key={key} id={key} aria-labelledby={tabId} style={{ display }}>
              {panelSelected && panel}
            </div>
          );
        })
      }
    </div>
  );
}
