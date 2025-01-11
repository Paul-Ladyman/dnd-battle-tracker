import React, { useEffect, useState } from 'react';
import BuyMeACoffee from '../page/BuyMeACoffee';

export default function ViewSwitcher({ views }) {
  const [viewIndex, setViewIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewIndex]);

  return (
    <>
      {views[viewIndex].content}
      <nav className="navigation">
        <ul className="navigation-options">
          {views.map((view, i) => {
            const { id, title } = view;
            const activeClass = i === viewIndex ? 'navigation-option__active' : '';
            return (
              <li key={id}>
                <button className={`navigation-option ${activeClass}`} type="button" onClick={() => setViewIndex(i)}>{title}</button>
              </li>
            );
          })}
          <li className="navigation-option__buymeacoffee">
            <BuyMeACoffee />
          </li>
        </ul>
      </nav>
    </>
  );
}
