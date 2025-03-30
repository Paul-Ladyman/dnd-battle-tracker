import {
  ApolloClient, InMemoryCache, ApolloLink,
} from '@apollo/client';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { createAuthLink } from 'aws-appsync-auth-link';
import { CognitoIdentity } from '@aws-sdk/client-cognito-identity';

const graphqlHost = 'wyqoq6xpifbjlm6xq6jnqugjvm.appsync-api.eu-west-2.amazonaws.com';
const uri = `https://${graphqlHost}/graphql`;
const region = 'eu-west-2';

export const cache = new InMemoryCache();
const cognitoIdentity = new CognitoIdentity({
  region,
});

async function getCognitoIdentity() {
  const { IdentityId } = await cognitoIdentity.getId({
    IdentityPoolId: `${region}:8b62b6c4-74d5-4318-9985-775d1a36baa0`,
  });

  return IdentityId;
}

async function getCognitoCredentials(IdentityId) {
  const { Credentials } = await cognitoIdentity.getCredentialsForIdentity({
    IdentityId,
  });

  return Credentials;
}

function getCredentialsObject(IdentityId, credentials) {
  const {
    AccessKeyId, SecretKey, SessionToken, Expiration,
  } = credentials;
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
        sessionToken: SessionToken,
      },
    },
  };
}

async function getAuth() {
  const IdentityId = await getCognitoIdentity();
  const credentials = await getCognitoCredentials(IdentityId);
  return getCredentialsObject(IdentityId, credentials);
}

async function refreshAuth(IdentityId) {
  const credentials = await getCognitoCredentials(IdentityId);
  return getCredentialsObject(IdentityId, credentials);
}

function getClient(auth) {
  const link = ApolloLink.from([
    createAuthLink({ url: uri, region, auth }),
    createSubscriptionHandshakeLink({ url: uri, region, auth }),
  ]);

  return new ApolloClient({
    link,
    cache,
  });
}

export default async function getApolloSession(identity) {
  try {
    const authFunc = identity ? refreshAuth : getAuth;
    const { IdentityId, auth, refreshIn } = await authFunc(identity);
    return { IdentityId, refreshIn, client: getClient(auth) };
  } catch (e) {
    return { IdentityId: identity, error: true };
  }
}
