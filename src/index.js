import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DungeonMasterAppWrapper from './components/app/DungeonMasterAppWrapper';
import PlayerAppWrapper from './components/app/PlayerAppWrapper';
import ErrorBoundary from './components/ErrorBoundary';

function getUrlParameter(name) {
  const cleanName = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${cleanName}=([^&#]*)`);
  const results = regex.exec(window.location.search);
  return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const battleId = getUrlParameter('battle');

async function render() {
  const rootElement = document.getElementById('root');

  if (battleId) {
    const RenderPlayerApp = () => (
      <ErrorBoundary>
        <PlayerAppWrapper battleId={battleId} />
      </ErrorBoundary>
    );
    ReactDOM.render(RenderPlayerApp(), rootElement);
  } else {
    const RenderDmApp = () => (
      <ErrorBoundary>
        <DungeonMasterAppWrapper />
      </ErrorBoundary>
    );
    ReactDOM.render(RenderDmApp(), rootElement);
  }
}

render();
