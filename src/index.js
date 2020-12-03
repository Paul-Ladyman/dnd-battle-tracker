import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import './index.css';
import App from './components/App';
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
  // const apolloClient = await getApolloClient();
  const WithProvider = () => (
    // <ApolloProvider client={apolloClient}>
      <ErrorBoundary>
        <App battleId={battleId}/>
      </ErrorBoundary>
    // </ApolloProvider>
  )
  
  ReactDOM.render(WithProvider(), document.getElementById('root'));
}

render();
