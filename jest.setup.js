import 'cross-fetch/polyfill';
import server from './test-integration/mocks/server';

window.HTMLElement.prototype.scrollIntoView = () => {};
window.scrollTo = () => {};

// Storage.prototype.setItem = jest.fn();
// Storage.prototype.getItem = jest.fn();
// jest.spyOn(Storage.prototype, 'setItem');
// jest.spyOn(Storage.prototype, 'getItem');

beforeAll(() => server.listen());
beforeEach(() => {
  server.resetHandlers();
  window.localStorage.clear();
});
afterAll(() => server.close());
