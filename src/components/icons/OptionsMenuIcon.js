import React from 'react';

function OptionsMenuIcon({ open }) {
  const transform = open ? 'rotate(90deg)' : null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ height: '28px', width: '28px', transform }}>
      <path d="M0 0h512v512H0z" fill="transparent" fillOpacity="0" />
      <g transform="translate(0,0)"><path d="M32 96v64h448V96H32zm0 128v64h448v-64H32zm0 128v64h448v-64H32z" fill="#822000" fillOpacity="1" transform="translate(0, 0) scale(1, 1) rotate(180, 256, 256)" /></g>
    </svg>
  );
}
export default OptionsMenuIcon;
