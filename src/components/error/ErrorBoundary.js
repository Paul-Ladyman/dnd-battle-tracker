import React from 'react';
import Footer from '../page/footer/Footer';
import Title from '../page/Title';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <div className="main-footer-wrapper">
          <main className="main main__error">
            <Title error />
          </main>
          <Footer error />
        </div>
      );
    }

    return children;
  }
}
