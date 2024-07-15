import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import DungeonMasterAppWrapper from './components/app/DungeonMasterAppWrapper';
import ErrorBoundary from './components/error/ErrorBoundary';
import featureFlags from './featureFlags';
import Loading from './components/app/Loading';

const PlayerAppWrapper = lazy(() => import('./components/app/PlayerAppWrapper'));

function getUrlParameter(name) {
  const cleanName = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${cleanName}=([^&#]*)`);
  const results = regex.exec(window.location.search);
  return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function setFeatureFlags() {
  featureFlags.forEach((flag) => {
    const value = getUrlParameter(flag);
    window[`FLAG_${flag}`] = value === 'true';
  });
}

function RenderPlayerApp({ battleId }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <PlayerAppWrapper battleId={battleId} />
      </Suspense>
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

function registerServiceworker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  }
}

const battleId = getUrlParameter('battle');

async function render() {
  registerServiceworker();
  setFeatureFlags();
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement);

  if (battleId) {
    root.render(RenderPlayerApp({ battleId }));
  } else {
    root.render(RenderDmApp());
  }
}

render();
