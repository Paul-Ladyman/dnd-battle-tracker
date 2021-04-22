import React from 'react';

function ExternalLink({
  url, children, className, title, ariaLabel, anchorRef, onClick,
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
      onClick={onClick}
    >
      {children}
    </a>
  );
}

export default ExternalLink;
