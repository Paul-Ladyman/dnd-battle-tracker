import React, { useState, useRef, useEffect } from 'react';
import Input from './Input';
import ExternalLink from './ExternalLink';
import RulesSearchIcon from '../icons/RulesSearchIcon';

export default function RulesSearchBar() {
  const [value, setValue] = useState('');
  const anchorRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const encodedSearch = encodeURIComponent(value);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const formHandler = (event) => {
    if (event.keyCode === 13) {
      anchorRef.current.click();
    }
  };

  const RightControl = (
    <ExternalLink
      url={`https://www.dndbeyond.com/search?q=${encodedSearch}`}
      ariaLabel={`Search ${value} on D&D Beyond`}
      title="D&D Beyond Rules Search"
      anchorRef={anchorRef}
    >
      <RulesSearchIcon />
    </ExternalLink>
  );

  return (
    <div className="rules-search-bar">
      <Input
        ariaLabel="search rules using D&D Beyond"
        label="Search rules using D&D Beyond"
        rightControls={{ RightControl }}
        inputId="dnd-beyond-search"
        value={value}
        handleChange={handleChange}
        formHandler={formHandler}
        inputRef={inputRef}
        customClasses="dnd-beyond-search"
      />
    </div>
  );
}
