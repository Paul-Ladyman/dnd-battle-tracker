import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';


const uri = 'https://wyqoq6xpifbjlm6xq6jnqugjvm.appsync-api.eu-west-2.amazonaws.com/graphql';
const apiKey = '';
const client = new ApolloClient({
  uri,
  headers: {
      'x-api-key': apiKey
  },
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
