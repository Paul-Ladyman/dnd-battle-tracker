import React from 'react';
import ExternalLink from '../ExternalLink';
import packageInfo from '../../../../package.json';

function isValidDate(date) {
  return !Number.isNaN(Date.parse(date));
}

function getVersionInfo() {
  const version = `Version ${packageInfo.version}`;
  const { BUILD_TIME } = window;

  const buildTime = new Date(parseInt(BUILD_TIME, 10));

  if (!isValidDate(buildTime)) return version;

  const isoBuildTime = buildTime.toISOString();
  const formattedBuildTime = isoBuildTime.replace('T', ', ').replace('Z', '');
  return `${version} built at ${formattedBuildTime}.`;
}

export default function Info() {
  return (
    <>
      <p>
        Track the initiative and status of all creatures involved in combat
        with this D&D 5e combat tracker!
      </p>
      <p>
        See&nbsp;
        <ExternalLink
          url="https://paul-ladyman.github.io/dnd-battle-tracker"
        >
          D&D Battle Tracker Info
        </ExternalLink>
        &nbsp;for more information and a list of previous versions.
        Feature ideas and general feedback welcome on
        {' '}
        <ExternalLink url="https://ko-fi.com/paulbod">Ko-fi</ExternalLink>
        . Bugs can be reported through
        {' '}
        <ExternalLink url="https://github.com/Paul-Ladyman/dnd-battle-tracker/issues/new">Github issues</ExternalLink>
        .
      </p>
      {getVersionInfo()}
    </>
  );
}
