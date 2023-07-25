import React from 'react';

function CrossIcon({ rotate, fill }) {
  const transform = rotate ? null : 'rotate(45deg)';
  const iconFill = fill || '#822000';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ height: '40px', width: '40px', transform }}>
      <g transform="translate(0,0)">
        <g>
          <path d="M175.375 136C174.405 135.995 173.369 136.112 172.312 136.313L172.312 136.281C154.015 139.717 127.048 171.024 138.937 182.907L212.094 256.032L138.938 329.158C124.308 343.783 168.213 387.692 182.844 373.064L256 299.906L329.156 373.062C343.786 387.69 387.693 343.782 373.062 329.156L299.906 256.031L373.062 182.907C387.692 168.282 343.787 124.407 329.156 139.032L256 212.157L182.844 139.032C180.784 136.986 178.284 136.017 175.374 136.002Z" fill={iconFill} fillOpacity="1" />
        </g>
      </g>
    </svg>
  );
}
export default CrossIcon;
