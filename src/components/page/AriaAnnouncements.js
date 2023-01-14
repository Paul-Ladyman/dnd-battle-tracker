import React from 'react';

export default function AriaAnnouncements({ announcements }) {
  return (
    <div className="aria-announcements" role="status">
      {announcements}
    </div>
  );
}
