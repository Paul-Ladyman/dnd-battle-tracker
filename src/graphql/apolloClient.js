import { ApolloClient, InMemoryCache } from '@apollo/client';
import { split, HttpLink, ApolloLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { createAuthLink } from 'aws-appsync-auth-link';
import { CognitoIdentity } from '@aws-sdk/client-cognito-identity';

const graphqlHost = 'wyqoq6xpifbjlm6xq6jnqugjvm.appsync-api.eu-west-2.amazonaws.com';
const uri = `https://${graphqlHost}/graphql`;
const region = 'eu-west-2';
const fallbackAuth = {
  auth: {
    type: 'NONE'
  }
};

const cache = new InMemoryCache();
const cognitoIdentity = new CognitoIdentity({ region });

async function getCognitoIdentity() {
  const { IdentityId } = await cognitoIdentity.getId({
    IdentityPoolId: `${region}:6cd2b2d5-c0b0-4a09-9043-d4933b3bf007`
  });

  return IdentityId;
}

async function getCognitoCredentials(IdentityId) {
  const { Credentials } = await cognitoIdentity.getCredentialsForIdentity({
    IdentityId
  });

  return Credentials;
}

function getCredentialsObject(IdentityId, credentials) {
  const { AccessKeyId, SecretKey, SessionToken, Expiration } = credentials;
  const now = new Date().getTime();
  const expirationTime = Expiration.getTime();
  const sessionLength = expirationTime - now;
  const tenMinutes = 600000;
  const refreshIn = sessionLength - tenMinutes;
  return {
    IdentityId,
    refreshIn,
    auth: {
      type: 'AWS_IAM',
      credentials: {
        accessKeyId: AccessKeyId,
        secretAccessKey: SecretKey,
        sessionToken: SessionToken
      }
    }
  };
}

async function getAuth() {
  try {
    const IdentityId = await getCognitoIdentity();
    const credentials = await getCognitoCredentials(IdentityId);
    return getCredentialsObject(IdentityId, credentials);
  }
  catch (e) {
    return fallbackAuth;
  }
}

async function refreshAuth(IdentityId) {
  try {
    const credentials = await getCognitoCredentials(IdentityId);
    return getCredentialsObject(IdentityId, credentials);
  }
  catch (e) {
    return fallbackAuth;
  }
}

function getClient(auth) {
  const httpLink = ApolloLink.from([
    createAuthLink({ url: uri, region, auth }), 
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
  
  return new ApolloClient({
    link,
    cache
  });
}

export async function getApolloSession(identity) {
  const authFunc = identity ? refreshAuth : getAuth;
  const { IdentityId, auth, refreshIn } = await authFunc(identity);
  return { IdentityId, refreshIn, client: getClient(auth) };
}
