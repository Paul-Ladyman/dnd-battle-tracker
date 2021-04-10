import React, { useState, useRef, useEffect } from 'react';
import Input from './Input';
import ExternalLink from './ExternalLink';
import MonsterSearchIcon from '../icons/MonsterSearchIcon';

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

  const resetForm = () => {
    setValue('');
  };

  const formHandler = (event) => {
    if (event.keyCode === 13) {
      anchorRef.current.click();
      resetForm();
    }
  };

  const RightControl = (
    <ExternalLink
      url={`https://www.dndbeyond.com/search?q=${encodedSearch}`}
      ariaLabel={`Search ${value} on D&D Beyond`}
      title="D&D Beyond Rules Search"
      anchorRef={anchorRef}
    >
      <MonsterSearchIcon />
    </ExternalLink>
  );

  return (
    <div className="rules-search-bar">
      <div className="dnd-beyond-search">
        <Input
          ariaLabel="search rules using D&D Beyond"
          label="Search rules using D&D Beyond"
          rightControls={{ RightControl }}
          inputId="dnd-beyond-search"
          value={value}
          handleChange={handleChange}
          formHandler={formHandler}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}
