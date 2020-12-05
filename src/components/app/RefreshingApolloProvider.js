import React, { useState, useEffect } from 'react';
import getApolloClient from '../../graphql/apolloClient';
import { ApolloProvider } from '@apollo/client';

export default function RefreshingApolloProvider({ online, OnlineView, OfflineView, ...props }) {
  console.log('>>> RefreshingApolloProvider', online, OnlineView, OfflineView);
  const [apolloInitCount, setApolloInitCount] = useState(0);
  const [apolloClient, setApolloClient] = useState(undefined);

  async function initApolloClient() {
    console.log('>>> initApolloClient');
    const client = await getApolloClient();
    setApolloClient(client);
    setApolloInitCount(apolloInitCount+1);
  }

  useEffect(() => {
    console.log('>>> init use effect', online);
    if (online) {
      initApolloClient();
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
        initApolloClient();
      }, 2700000);

      return () => { console.log('>>> clearing timeout'); clearTimeout(timer)};
    }
  }, [apolloInitCount]);

  if (online && apolloClient) {
    console.log('>>> rendering online view');
    return (
      <ApolloProvider client={apolloClient}>
        <OnlineView {...props} />
      </ApolloProvider>
    );
  }

  console.log('>>> rendering offline view');

  return (
    <OfflineView {...props} />
  );
}