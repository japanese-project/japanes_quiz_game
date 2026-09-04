import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export const getDb = (d1: Parameters<typeof drizzle>[0]) => drizzle(d1, { schema });
