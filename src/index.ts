import { Hono } from 'hono';
import { db } from '@integrations/database';
import { users } from '@core/db/schema';

const app = new Hono();

app.get('/', async (c) => {
	const usersData = await db.select().from(users);
	return c.json(usersData);
});

export default app;
