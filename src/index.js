import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const graphqlHost = 'wyqoq6xpifbjlm6xq6jnqugjvm.appsync-api.eu-west-2.amazonaws.com';
const apiKey = '';
const httpLink = new HttpLink({
  uri: `https://${graphqlHost}/graphql`,
  headers: {
    'x-api-key': apiKey
  },
});

const webSocketHeader = {
    "host": graphqlHost,
    "x-api-key": apiKey
};
let base64data = btoa(JSON.stringify(webSocketHeader));
console.log(base64data);
const wsLink = new WebSocketLink({
  uri: `wss://wyqoq6xpifbjlm6xq6jnqugjvm.appsync-realtime-api.eu-west-2.amazonaws.com/graphql?header=${base64data}&payload=e30=`,
  options: {
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
