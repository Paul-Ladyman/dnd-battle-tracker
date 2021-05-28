import React from 'react';

function ShareHealthIcon({ enabled }) {
  const fillOpacity = enabled ? '1' : '0';
  const shareStroke = enabled ? '#EBE1AD' : '#822000';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ height: '40px', width: '40px' }}>
      <path d="M0 0h512v512H0z" fill="#000000" fillOpacity="0.01" />
      <g><path d="M480.25 156.355c0 161.24-224.25 324.43-224.25 324.43S31.75 317.595 31.75 156.355c0-91.41 70.63-125.13 107.77-125.13 77.65 0 116.48 65.72 116.48 65.72s38.83-65.73 116.48-65.73c37.14.01 107.77 33.72 107.77 125.14z" fill="#822000" fillOpacity={fillOpacity} stroke="#822000" strokeOpacity="1" strokeWidth="20" /></g>
      <g transform="translate(60,60) scale(0.666)">
        <path d="M384 64a64 64 0 0 0-64 64 64 64 0 0 0 1.1 11.3l-146.3 73.2A64 64 0 0 0 128 192a64 64 0 0 0-64 64 64 64 0 0 0 64 64 64 64 0 0 0 46.8-20.5L321 372.7a64 64 0 0 0-1 11.3 64 64 0 0 0 64 64 64 64 0 0 0 64-64 64 64 0 0 0-64-64 64 64 0 0 0-46.8 20.5L191 267.4a64 64 0 0 0 1-11.4 64 64 0 0 0-1.1-11.4l146.3-73.1A64 64 0 0 0 384 192a64 64 0 0 0 64-64 64 64 0 0 0-64-64z" fill="#822000" fillOpacity={fillOpacity} stroke={shareStroke} strokeOpacity="1" strokeWidth="20" />
      </g>

      {/* <g transform="translate(2,141)">
        <g>
          <circle cx="128" cy="128" r="128" fill="#822000" fillOpacity="1" />
          <circle stroke="#ffffff" strokeOpacity="1" fill="#822000" fillOpacity="1" strokeWidth="18" cx="128" cy="128" r="101" />
          <path fill="#ffffff" fillOpacity="1" d="M128 204c16-24 68-78 68-94 0-24-20-39.824-36-40-16 0-32 10-32 30 0-20-16-30-32-30-16-.176-36 16-36 40 0 16 52 70 68 94z" />
        </g>
      </g> */}
    </svg>
  );
}
export default ShareHealthIcon;
