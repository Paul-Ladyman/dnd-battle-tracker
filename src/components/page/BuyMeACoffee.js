import React from 'react';

const version = Math.floor(Math.random() * 5) + 1;

export default function BuyMeACoffee({ mobileOnly }) {
  const className = mobileOnly ? 'buymeacoffee__mobileonly' : 'buymeacoffee__desktoponly';
  const src = `https://cdn.ko-fi.com/cdn/kofi${version}.png?v=3`;
  return <a href="https://ko-fi.com/R5R12KANF" target="_blank" rel="noreferrer" className={className}><img width="286" height="73" style={{ border: '0px', height: '36px', width: '141px' }} src={src} border="0" alt="Buy Me a Coffee at ko-fi.com" /></a>;
}
