import { eq } from 'drizzle-orm';
import { database } from '../db/client';
import { settings } from '../db/schema';
const key = 'phase0_persistence_test';
export async function readDiagnostic() {
 const { orm } = await database();
 const rows = await orm.select().from(settings).where(eq(settings.key, key));
 return rows[0]?.value ?? null;
}
export async function saveDiagnostic() {
 const value = new Date().toISOString();
 const { orm } = await database();
 await orm.insert(settings).values({ key, value }).onConflictDoUpdate({ target: settings.key, set: { value } });
 return readDiagnostic();
}
export async function clearDiagnostic() {
 const { orm } = await database();
 await orm.delete(settings).where(eq(settings.key, key));
}
