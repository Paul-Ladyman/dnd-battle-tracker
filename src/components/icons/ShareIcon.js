import React from 'react';

function ShareIcon({ enabled }) {
  const fillOpacity = enabled ? '1' : '0';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ height: '28px', width: '28px' }}><g className="" transform="translate(0,0)"><path d="M384 64a64 64 0 0 0-64 64 64 64 0 0 0 1.1 11.3l-146.3 73.2A64 64 0 0 0 128 192a64 64 0 0 0-64 64 64 64 0 0 0 64 64 64 64 0 0 0 46.8-20.5L321 372.7a64 64 0 0 0-1 11.3 64 64 0 0 0 64 64 64 64 0 0 0 64-64 64 64 0 0 0-64-64 64 64 0 0 0-46.8 20.5L191 267.4a64 64 0 0 0 1-11.4 64 64 0 0 0-1.1-11.4l146.3-73.1A64 64 0 0 0 384 192a64 64 0 0 0 64-64 64 64 0 0 0-64-64z" fill="#822000" fillOpacity={fillOpacity} stroke="#822000" strokeOpacity="1" strokeWidth="20" /></g></svg>
  );
}
export default ShareIcon;
