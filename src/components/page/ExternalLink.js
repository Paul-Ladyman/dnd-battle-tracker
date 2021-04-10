import React from 'react';

function ExternalLink({
  url, children, className, title, ariaLabel, anchorRef,
}) {
  return (
    <a
      title={title}
      aria-label={ariaLabel}
      className={className}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      ref={anchorRef}
    >
      {children}
    </a>
  );
}

export default ExternalLink;
