import React, { useState, useEffect } from 'react';
import { getApolloSession } from '../../graphql/apolloClient';
import { ApolloProvider } from '@apollo/client';

export default function RefreshingApolloProvider({ online, OnlineView, OfflineView, ...props }) {
  console.log('>>> RefreshingApolloProvider', online, OnlineView, OfflineView);
  const [apolloInitCount, setApolloInitCount] = useState(0);
  const [apolloSession, setApolloSession] = useState(undefined);

  async function getClient() {
    const identity = apolloSession ? apolloSession.IdentityId : undefined;
    const session = await getApolloSession(identity);
    setApolloSession(session);
    setApolloInitCount(apolloInitCount+1);
  }

  useEffect(() => {
    console.log('>>> init use effect', online);
    if (online) {
      getClient();
    }

    if (!online) {
      setApolloInitCount(0);
    }
  }, [online]);

  useEffect(() => {
    console.log('>>> refresh use effect', apolloInitCount);
    if (apolloInitCount) {
      console.log('>>> scheduling apollo refresh');
      
      const timer = setTimeout(() => {
        console.log('>>> refreshing apollo client!');
        getClient();
      }, 30000);

      return () => { console.log('>>> clearing timeout'); clearTimeout(timer)};
    }
  }, [apolloInitCount]);

  if (online && apolloSession) {
    console.log('>>> rendering online view', apolloSession);
    return (
      <ApolloProvider client={apolloSession.client}>
        <OnlineView {...props} />
      </ApolloProvider>
    );
  }

  console.log('>>> rendering offline view');

  return (
    <OfflineView {...props} />
  );
}