import React from 'react';

function ExternalLink({
  url, children, className, title, ariaLabel,
}) {
  return (
    <a
      title={title}
      aria-label={ariaLabel}
      className={className}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export default ExternalLink;
