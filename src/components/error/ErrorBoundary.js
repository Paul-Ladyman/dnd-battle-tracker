import React from 'react';
import Footer from '../page/Footer';
import Title from '../page/Title';
import BattleTrackerError from './BattleTrackerError';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    const errorMessage = error instanceof BattleTrackerError ? error.message : null;
    return { hasError: true, error: errorMessage };
  }

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <div className="main-footer-wrapper">
          <main className="main main__error">
            <Title error />
            { error && <div className="error-panel">{error}</div> }
          </main>
          <Footer error />
        </div>
      );
    }

    return children;
  }
}
