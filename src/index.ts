import { Hono } from 'hono';

import { users } from '@core/db/schema';

import { db } from '@integrations/database';

const app = new Hono();

app.get('/', async c => {
  const usersData = await db.select().from(users);
  return c.json(usersData);
});

export default app;
