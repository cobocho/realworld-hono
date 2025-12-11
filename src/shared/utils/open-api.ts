import { OpenAPIHono, type OpenAPIHonoOptions } from '@hono/zod-openapi';
import { type Env } from 'hono';

import { afterZodErrorHook } from '@shared/hooks/after-zod-error';

export const createHono = (options: OpenAPIHonoOptions<Env> = {}) =>
  new OpenAPIHono({
    ...options,
    defaultHook: afterZodErrorHook,
  });
