import React from 'react';

function SaveLoadIcon({ load }) {
  const transform = load ? 'rotate(180deg)' : null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ height: '28px', width: '28px', transform }}>
      <path d="M0 0h512v512H0z" fill="transparent" fillOpacity="0" />
      <g transform="translate(0,0)"><path d="M224 30v256h-64l96 128 96-128h-64V30h-64zM32 434v48h448v-48H32z" fill="#822000" fillOpacity="1" /></g>
    </svg>
  );
}
export default SaveLoadIcon;
