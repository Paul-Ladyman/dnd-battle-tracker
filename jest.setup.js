import 'cross-fetch/polyfill';
import { webcrypto } from 'crypto';
import { TextDecoder, TextEncoder } from 'util';
import server from './test-integration/mocks/server';

if (!window.crypto?.subtle) {
  Object.defineProperty(window, 'crypto', {
    configurable: true,
    value: webcrypto,
  });
}

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

window.HTMLElement.prototype.scrollIntoView = () => {};
window.scrollTo = () => {};

beforeAll(() => server.listen());
beforeEach(() => {
  server.resetHandlers();
  window.localStorage.clear();
});
afterAll(() => server.close());
