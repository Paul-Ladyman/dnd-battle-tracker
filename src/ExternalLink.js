import React from 'react';

function ExternalLink({ url, text}) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">{text}</a>
  );
}

export default ExternalLink;