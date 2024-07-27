/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

export default function OfflineApolloProvider({
  online, OnlineView, OfflineView, ...props
}) {
  return (
    <OfflineView
      onlineError
      {...props}
    />
  );
}
