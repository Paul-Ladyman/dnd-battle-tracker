import React from 'react';

function ExternalLink({ url, text, className}) {
  return (
    <a className={className} href={url} target="_blank" rel="noopener noreferrer">{text}</a>
  );
}

export default ExternalLink;