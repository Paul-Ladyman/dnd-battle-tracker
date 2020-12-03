import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import './index.css';
import App from './components/App';
import PlayerApp from './components/PlayerApp';
import ErrorBoundary from './components/ErrorBoundary';
import getApolloClient from './graphql/apolloClient';

function getUrlParameter(name) {
  const cleanName = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + cleanName + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const battleId = getUrlParameter('battle');

async function render() {
  const rootElement = document.getElementById('root');

  if (battleId) {
    const apolloClient = await getApolloClient();
    const RenderPlayerApp = () => (
      <ErrorBoundary>
        <ApolloProvider client={apolloClient}>
          <PlayerApp battleId={battleId} /> 
        </ApolloProvider>
      </ErrorBoundary>
    );
    ReactDOM.render(RenderPlayerApp(), rootElement);
  }
  else {
    const RenderDmApp = () => (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
    ReactDOM.render(RenderDmApp(), rootElement);
  }
}

render();
