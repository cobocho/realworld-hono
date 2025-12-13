import { createMiddleware } from 'hono/factory';

import { logger } from './pino';

export const requestMiddleware = createMiddleware(async (c, next) => {
  const start = Date.now();

  await next();

  const end = Date.now();

  const duration = end - start;

  logger.info({
    url: c.req.url,
    method: c.req.method,
    status: c.res.status,
    response: c.res.body,
    requestStart: start,
    requestEnd: end,
    duration: `${duration}ms`,
  });
});
