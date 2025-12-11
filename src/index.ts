import { OpenAPIHono } from '@hono/zod-openapi';
import { Scalar } from '@scalar/hono-api-reference';
import { cors } from 'hono/cors';

import userApp from '@features/users/users.api';

import { errorHandler } from '@shared/error/error-handler';
import { afterZodErrorHook } from '@shared/hooks/after-zod-error';

const app = new OpenAPIHono({
  defaultHook: afterZodErrorHook,
}).basePath('/api');

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

app.doc('/docs', {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
  },
});

app.get('/scalar', Scalar({ url: '/api/docs' }));

app.onError(errorHandler);

export default app;
