import 'cross-fetch/polyfill';
import server from './test-integration/mocks/server';

window.HTMLElement.prototype.scrollIntoView = () => {};

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
