import React from 'react';
import now from '../../util/date';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function battleStartedMoreThan24HoursAgo(timestamp) {
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  return Math.abs(now() - timestamp) >= oneDayInMilliseconds;
}

export default function BattleDate({ timestamp }) {
  if (!timestamp || !battleStartedMoreThan24HoursAgo(timestamp)) return null;
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth();
  const monthName = monthNames[month];
  const year = date.getFullYear();
  return <time role="time" className="battle-date">{`${day} ${monthName} ${year}`}</time>;
}
