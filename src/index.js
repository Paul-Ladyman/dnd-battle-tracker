import React from 'react';
import ReactDOM from 'react-dom';
import DungeonMasterAppWrapper from './components/app/DungeonMasterAppWrapper';
import PlayerAppWrapper from './components/app/PlayerAppWrapper';
import ErrorBoundary from './components/error/ErrorBoundary';

function getUrlParameter(name) {
  const cleanName = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${cleanName}=([^&#]*)`);
  const results = regex.exec(window.location.search);
  return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function RenderPlayerApp({ battleId }) {
  return (
    <ErrorBoundary>
      <PlayerAppWrapper battleId={battleId} />
    </ErrorBoundary>
  );
}

function RenderDmApp() {
  return (
    <ErrorBoundary>
      <DungeonMasterAppWrapper />
    </ErrorBoundary>
  );
}

const battleId = getUrlParameter('battle');

async function render() {
  const rootElement = document.getElementById('root');

  if (battleId) {
    ReactDOM.render(RenderPlayerApp({ battleId }), rootElement);
  } else {
    ReactDOM.render(RenderDmApp(), rootElement);
  }
}

render();
