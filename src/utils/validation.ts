import { z } from 'zod';
export const daySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
 const [y,m,d] = value.split('-').map(Number);
 const date = new Date(0); date.setFullYear(y,m-1,d); date.setHours(12,0,0,0);
 return y >= 1900 && y <= 9999 && date.getFullYear()===y && date.getMonth()===m-1 && date.getDate()===d;
}, 'Use a valid date: YYYY-MM-DD');
const id = z.string().min(1).max(100);
const timestamp = z.string().datetime();
export const memberSchema = z.object({
 id, name:z.string().trim().min(1).max(100), photo_path:z.string().regex(/^photos\/[a-zA-Z0-9_-]+\.jpg$/).nullable(),
 phone:z.string().max(100).nullable(), notes:z.string().max(2000).nullable(), joined_on:daySchema,
 left_on:daySchema.nullable(), created_at:timestamp,
}).refine(m=>!m.left_on || m.left_on>=m.joined_on,'Leave date cannot precede join date');
export const contributionSchema = z.object({
 id, member_id:id, amount_centavos:z.number().int().positive().max(100_000_000_000), paid_on:daySchema,
 note:z.string().max(2000).nullable(), created_at:timestamp, deleted_at:timestamp.nullable(),
});
const withdrawalSchema = z.object({
 id, amount_centavos:z.number().int().positive().max(100_000_000_000), spent_on:daySchema,
 purpose:z.string().max(2000), created_at:timestamp, deleted_at:timestamp.nullable(),
});
export const backupSchema = z.object({
 app:z.literal('ambag-natin'), version:z.literal(1), exported_at:timestamp,
 members:z.array(memberSchema).max(5000), contributions:z.array(contributionSchema).max(100000),
 withdrawals:z.array(withdrawalSchema).max(100000),
 settings:z.array(z.object({key:z.string().max(100),value:z.string().max(10000)})).max(100),
 photos:z.record(z.string().regex(/^photos\/[a-zA-Z0-9_-]+\.jpg$/), z.string().max(2_000_000).regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/)),
});
export type Backup = z.infer<typeof backupSchema>;
export function validateBackup(input:unknown):Backup {
 const data = backupSchema.parse(input);
 for (const rows of [data.members,data.contributions,data.withdrawals]) {
  if(new Set(rows.map(r=>r.id)).size!==rows.length) throw new Error('Duplicate record IDs in backup.');
 }
 if(new Set(data.settings.map(r=>r.key)).size!==data.settings.length) throw new Error('Duplicate settings.');
 const ids=new Set(data.members.map(m=>m.id));
 for(const c of data.contributions) if(!ids.has(c.member_id)) throw new Error('Payment references missing member.');
 for(const m of data.members) if(m.photo_path && !data.photos[m.photo_path]) throw new Error('Backup is missing a member photo.');
 const total=[...data.contributions,...data.withdrawals].reduce((s,c)=>s+c.amount_centavos,0);
 if(!Number.isSafeInteger(total)) throw new Error('Backup exceeds safe money limits.');
 const days=data.settings.find(s=>s.key==='collection_days');
 if(days) z.array(z.number().int().min(0).max(6)).max(7).parse(JSON.parse(days.value));
 return data;
}
