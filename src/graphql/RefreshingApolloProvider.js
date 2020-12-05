import React, { useState, useEffect } from 'react';
import { getApolloSession } from './apolloClient';
import { ApolloProvider } from '@apollo/client';

export default function RefreshingApolloProvider({ online, OnlineView, OfflineView, ...props }) {
  const [apolloInitCount, setApolloInitCount] = useState(0);
  const [apolloSession, setApolloSession] = useState(undefined);

  async function getClient() {
    const identity = apolloSession ? apolloSession.IdentityId : undefined;
    const session = await getApolloSession(identity);
    setApolloSession(session);
    setApolloInitCount(apolloInitCount+1);
  }

  useEffect(() => {
    if (online)
      getClient();
    else
      setApolloInitCount(0);
  }, [online]);

  useEffect(() => {
    if (apolloInitCount) {
      const timer = setTimeout(() => getClient(), 30000);
      return () => clearTimeout(timer);
    }
  }, [apolloInitCount]);

  if (online && apolloSession) {
    return (
      <ApolloProvider client={apolloSession.client}>
        <OnlineView {...props} />
      </ApolloProvider>
    );
  }

  return (
    <OfflineView {...props} />
  );
}