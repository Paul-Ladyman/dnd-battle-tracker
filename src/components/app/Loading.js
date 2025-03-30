import React from 'react';
import Title from '../page/Title';
import LoadingIcon from '../icons/LoadingIcon';

export default function Loading() {
  return (
    <div className="main-footer-wrapper">
      <main className="main">
        <div className="battle-toolbar" />
        <Title />
        <div className="loading-spinner" data-testid="loading">
          <LoadingIcon />
        </div>
      </main>
    </div>
  );
}
