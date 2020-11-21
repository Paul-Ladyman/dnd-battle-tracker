import React from 'react';
import Footer from './Footer';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="main-footer-wrapper">
          <main className="main main__error">
          <h1 className="main-title main-title__short">
            D&D Battle Tracker
          </h1>
          <h2>Something went wrong!</h2>
          </main>
          <Footer error/>
        </div>
      );
    }

    return this.props.children; 
  }
}