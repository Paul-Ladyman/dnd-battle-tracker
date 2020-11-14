import { ApolloClient, InMemoryCache } from '@apollo/client';
import { split, HttpLink, ApolloLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { createAuthLink } from 'aws-appsync-auth-link';

const graphqlHost = 'wyqoq6xpifbjlm6xq6jnqugjvm.appsync-api.eu-west-2.amazonaws.com';
const uri = `https://${graphqlHost}/graphql`;
const apiKey = 'da2-vfqkeqsnxncaxem4oddrhqwa5u';

const auth = {
  type: 'API_KEY',
  apiKey,
};

const httpLink = ApolloLink.from([
   createAuthLink({ uri, region: 'eu-west-2', auth }), 
   new HttpLink({ uri })
]);

const wsLink = createSubscriptionHandshakeLink(uri, httpLink);

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const link = split(
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

export default new ApolloClient({
  link,
  cache: new InMemoryCache()
});
