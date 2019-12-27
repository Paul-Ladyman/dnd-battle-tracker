import React from 'react';

function ExternalLink({ url, text, className, title, ariaLabel}) {
  return (
    <a title={title} aria-label={ariaLabel} className={className} href={url} target="_blank" rel="noopener noreferrer">{text}</a>
  );
}

export default ExternalLink;