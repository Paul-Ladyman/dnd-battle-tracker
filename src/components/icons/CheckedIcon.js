import React from 'react';

function CheckedIcon({ size = 28, color = '#882200' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
    >
      <rect
        x="2"
        y="2"
        width="24"
        height="24"
        rx="6"
        ry="6"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M8 14.5 L12 18 L20 10"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default CheckedIcon;
