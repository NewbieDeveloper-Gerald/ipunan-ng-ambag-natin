import { openDatabaseAsync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';
import { migration1 } from './migrations/0001';

async function initialize() {
 const sqlite = await openDatabaseAsync('ambag-natin.db');
 await sqlite.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
 const version = await sqlite.getFirstAsync<{user_version: number}>('PRAGMA user_version');
 if ((version?.user_version ?? 0) > 1) throw new Error('This database needs a newer app. Do not clear app data.');
 if (!version?.user_version) {
  await sqlite.withExclusiveTransactionAsync(async tx => {
   await tx.execAsync(migration1);
   await tx.execAsync('PRAGMA user_version = 1');
  });
 }
 return { sqlite, orm: drizzle(sqlite, { schema }) };
}
let connection: ReturnType<typeof initialize> | undefined;
export function database() {
 if (!connection) connection = initialize().catch(error => { connection = undefined; throw error; });
 return connection;
}
