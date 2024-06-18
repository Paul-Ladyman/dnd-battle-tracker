import React from 'react';
import Title from '../page/Title';
import LoadingIcon from '../icons/LoadingIcon';
// import Footer from '../page/footer/Footer';

export default function Loading() {
  return (
    <div className="main-footer-wrapper">
      <main className="main">
        <div className="battle-toolbar" />
        <Title />
        <div className="loading-spinner">
          <LoadingIcon />
        </div>
        {/* <Footer /> */}
      </main>
    </div>
  );
}
