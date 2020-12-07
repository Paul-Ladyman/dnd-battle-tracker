import React, { useState, useEffect } from 'react';
import { getApolloSession } from './apolloClient';
import { ApolloProvider } from '@apollo/client';

export default function RefreshingApolloProvider({ online, OnlineView, OfflineView, ...props }) {
  const [apolloInitCount, setApolloInitCount] = useState(0);
  const [apolloSession, setApolloSession] = useState(undefined);

  async function getSession() {
    const identity = apolloSession ? apolloSession.IdentityId : undefined;
    const session = await getApolloSession(identity);
    setApolloSession(session);
    setApolloInitCount(apolloInitCount+1);
  }

  useEffect(() => {
    if (online) {
      getSession();
    }
    else {
      setApolloInitCount(0);
      setApolloSession((prevSession) => {
        if (!prevSession) return prevSession;
        return { IdentityId: prevSession.IdentityId };
      });
    }
  }, [online]);

  useEffect(() => {
    if (apolloInitCount && apolloSession.refreshIn) {
      const timer = setTimeout(() => getSession(), apolloSession.refreshIn);
      return () => clearTimeout(timer);
    }
  }, [apolloInitCount]);

  if (online && apolloSession && apolloSession.client && !apolloSession.error) {
    return (
      <ApolloProvider client={apolloSession.client}>
        <OnlineView {...props} />
      </ApolloProvider>
    );
  }

  return (
    <OfflineView
      onlineError={apolloSession && apolloSession.error}
      {...props}
    />
  );
}