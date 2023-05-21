import React from 'react';

function ShareHitPointsIcon({ enabled }) {
  const fillOpacity = enabled ? '1' : '0';
  const shareStroke = enabled ? '#EBE1AD' : '#822000';
  const shareStrokeWidth = enabled ? '10' : '20';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ height: '28px', width: '28px' }}>
      <path d="M0 0h512v512H0z" fill="#000000" fillOpacity="0.01" />
      <g><path d="M480.25 156.355c0 161.24-224.25 324.43-224.25 324.43S31.75 317.595 31.75 156.355c0-91.41 70.63-125.13 107.77-125.13 77.65 0 116.48 65.72 116.48 65.72s38.83-65.73 116.48-65.73c37.14.01 107.77 33.72 107.77 125.14z" fill="#822000" fillOpacity={fillOpacity} stroke="#822000" strokeOpacity="1" strokeWidth="20" /></g>
      <g transform="translate(60,70) scale(0.666)">
        <path d="M384 64a64 64 0 0 0-64 64 64 64 0 0 0 1.1 11.3l-146.3 73.2A64 64 0 0 0 128 192a64 64 0 0 0-64 64 64 64 0 0 0 64 64 64 64 0 0 0 46.8-20.5L321 372.7a64 64 0 0 0-1 11.3 64 64 0 0 0 64 64 64 64 0 0 0 64-64 64 64 0 0 0-64-64 64 64 0 0 0-46.8 20.5L191 267.4a64 64 0 0 0 1-11.4 64 64 0 0 0-1.1-11.4l146.3-73.1A64 64 0 0 0 384 192a64 64 0 0 0 64-64 64 64 0 0 0-64-64z" fill="#EBE1AD" stroke={shareStroke} strokeOpacity="1" strokeWidth={shareStrokeWidth} />
      </g>
    </svg>
  );
}
export default ShareHitPointsIcon;
