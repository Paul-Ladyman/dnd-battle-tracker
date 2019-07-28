import React from 'react';

function RemoveIcon({ fill }) {
  const iconFill = fill || '#822000';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{height: '28px', width: '28px'}}><g transform="translate(0,0)" ><path d="M196 16a30 30 0 0 0-30 30v120H46a30 30 0 0 0-30 30v120a30 30 0 0 0 30 30h120v120a30 30 0 0 0 30 30h120a30 30 0 0 0 30-30V346h120a30 30 0 0 0 30-30V196a30 30 0 0 0-30-30H346V46a30 30 0 0 0-30-30H196z" fill={iconFill} fillOpacity="1" transform="translate(0, 0) scale(1, 1) rotate(45, 256, 256)"></path></g></svg>
  );
}
export default RemoveIcon;