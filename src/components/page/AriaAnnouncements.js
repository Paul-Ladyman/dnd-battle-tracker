import React from 'react';

export default function AriaAnnouncements({ announcements }) {
  return (
    <div className="aria-announcements" role="region" aria-live="assertive">
      {announcements}
    </div>
  );
}
