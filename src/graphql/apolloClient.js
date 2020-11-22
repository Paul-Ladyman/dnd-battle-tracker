import { ApolloClient, InMemoryCache } from '@apollo/client';
import { split, HttpLink, ApolloLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { createAuthLink } from 'aws-appsync-auth-link';
import { CognitoIdentity } from '@aws-sdk/client-cognito-identity';

const graphqlHost = 'wyqoq6xpifbjlm6xq6jnqugjvm.appsync-api.eu-west-2.amazonaws.com';
const uri = `https://${graphqlHost}/graphql`;
const region = 'eu-west-2';

async function getCognitoAuth() {
  const cognitoIdentity = new CognitoIdentity({ region });

  const { IdentityId } = await cognitoIdentity.getId({
    IdentityPoolId: `${region}:6cd2b2d5-c0b0-4a09-9043-d4933b3bf007`
  });

  const { Credentials: { AccessKeyId, SecretKey, SessionToken } } = await cognitoIdentity.getCredentialsForIdentity({
    IdentityId
  });

  return {
    type: 'AWS_IAM',
    credentials: {
      accessKeyId: AccessKeyId,
      secretAccessKey: SecretKey,
      sessionToken: SessionToken
    },
  };
}

async function getAuth() {
  try {
    const cognitoAuth = await getCognitoAuth();
    return cognitoAuth;
  }
  catch (e) {
    return {
      type: 'NONE'
    };
  }
}

export default async function getApolloClient() {
  const auth = await getAuth();
  
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
    cache: new InMemoryCache()
  });
}
