import { drizzle } from 'drizzle-orm/node-postgres';
import { getXataClient } from './xata'; // Generated client
import { Client } from 'pg';

const xata = getXataClient();
const client = new Client({ connectionString: xata.sql.connectionString });
await client.connect();
const db = drizzle(client);

export { db };
