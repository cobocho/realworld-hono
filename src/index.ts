import { Hono } from 'hono';
import { cors } from 'hono/cors';

import userApp from '@features/users/users.api';

import { errorHandler } from '@shared/error/error-handler';

const app = new Hono().basePath('/api');

app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.get('/', async c => {
  return c.text('Server is running');
});

app.route('/users', userApp);

app.onError(errorHandler);

export default app;
