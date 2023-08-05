import React from 'react';

export default function TabList({
  id,
  labelledBy,
  tabs,
}) {
  return (
    <div className="tablist-container">
      <div role="tablist" className="tablist" aria-labelledby={labelledBy}>
        {tabs.map((tab, i) => {
          const selected = i === 0;
          const key = `${id}-${tab}`;
          return (
            <button type="button" role="tab" aria-selected={selected} key={key}>
              {tab}
            </button>
          );
        })}
      </div>
      <div className="tabpanel">Content</div>
    </div>
  );
}
