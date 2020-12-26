import React, { useEffect, useRef } from 'react';

function ExternalLink({
  url, children, className, title, ariaLabel, focused,
}) {
  const anchorRef = useRef(null);

  useEffect(() => {
    if (focused) {
      anchorRef.current.focus();
    }
  }, [focused]);

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
