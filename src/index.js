import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const graphqlHost = 'wyqoq6xpifbjlm6xq6jnqugjvm.appsync-api.eu-west-2.amazonaws.com/graphql';
const apiKey = 'da2-6w2nnyb6tzem7mj6uahnad7apm';
const httpLink = new HttpLink({
  uri: `https://${graphqlHost}`,
  headers: {
    'x-api-key': apiKey
  },
});

const wsLink = new WebSocketLink({
  uri: `ws://${graphqlHost}`,
  options: {
    connectionParams: {
        'x-api-key': apiKey
    },
    reconnect: true
  }
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);


const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const playerSessionParam = getUrlParameter('playerSession');

const WithProvider = () => (
  <ApolloProvider client={client}>
      <App playerSession={playerSessionParam} />
  </ApolloProvider>
)

ReactDOM.render(WithProvider(), document.getElementById('root'));
