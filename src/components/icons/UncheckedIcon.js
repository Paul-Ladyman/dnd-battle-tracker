import React from 'react';

function UncheckedIcon({ size = 28, color = '#882200' }) {
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
    </svg>
  );
}

export default UncheckedIcon;
