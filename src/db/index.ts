import { drizzle } from 'drizzle-orm/node-postgres';
import { getXataClient } from './xata'; // Generated client
import { Client } from 'pg';
import * as schema from './schema';

const apiKey = String(process.env.XATA_API_KEY);
const branch = String(process.env.XATA_BRANCH);

const xata = getXataClient({ apiKey, branch });
const client = new Client({ connectionString: xata.sql.connectionString });
await client.connect();
const db = drizzle(client, { schema });

export { db };
