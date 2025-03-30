import 'cross-fetch/polyfill';
import server from './test-integration/mocks/server';

window.HTMLElement.prototype.scrollIntoView = () => {};
window.scrollTo = () => {};

beforeAll(() => server.listen());
beforeEach(() => {
  server.resetHandlers();
  window.localStorage.clear();
});
afterAll(() => server.close());
