// eslint-disable-next-line import/no-extraneous-dependencies
import { setupServer } from 'msw/node';
import handlers from './handlers';

// This configures a request mocking server with the given request handlers.
export default setupServer(...handlers);
