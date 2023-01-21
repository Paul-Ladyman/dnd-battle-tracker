import 'cross-fetch/polyfill';
import server from './test-integration/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
