import { clearSQL, restoreRows } from '../db/restore';
import { randomUUID } from 'expo-crypto';
import { database } from '../db/client';
import { daySchema, memberSchema, contributionSchema, type Backup } from '../utils/validation';
import { localDate } from '../utils/dates';
export type Member = Backup['members'][number];
export type Contribution = Backup['contributions'][number];
export type Payment = Contribution & { name:string };
export type DailyMember = Member & { paid_centavos:number };
import { dailySQL, balanceSQL } from '../db/queries';
export async function overview(day:string) {
 daySchema.parse(day); const {sqlite}=await database();
 const [balance,daily,members,payments,settings]=await Promise.all([
  sqlite.getFirstAsync<{cents:number}>(balanceSQL), sqlite.getAllAsync<DailyMember>(dailySQL,day,day,day),
  sqlite.getAllAsync<Member>('SELECT * FROM members ORDER BY name COLLATE NOCASE'),
  sqlite.getAllAsync<Payment>('SELECT c.*,m.name FROM contributions c JOIN members m ON m.id=c.member_id WHERE c.deleted_at IS NULL ORDER BY c.paid_on DESC,c.created_at DESC'),
  sqlite.getAllAsync<{key:string;value:string}>('SELECT * FROM settings'),
 ]);
 if(!Number.isSafeInteger(balance?.cents ?? 0)) throw new Error('Balance exceeds safe display limits.');
 return {balance:balance?.cents??0,daily,members,payments,settings:Object.fromEntries(settings.map(s=>[s.key,s.value]))};
}
export async function saveMember(input:Partial<Member> & {name:string;joined_on:string}) {
 const member=memberSchema.parse({id:randomUUID(),photo_path:null,phone:null,notes:null,left_on:null,created_at:new Date().toISOString(),...input});
 const {sqlite}=await database();
 await sqlite.runAsync(`INSERT INTO members(id,name,photo_path,phone,notes,joined_on,left_on,created_at) VALUES(?,?,?,?,?,?,?,?)
 ON CONFLICT(id) DO UPDATE SET name=excluded.name,photo_path=excluded.photo_path,phone=excluded.phone,notes=excluded.notes,joined_on=excluded.joined_on,left_on=excluded.left_on`,
 member.id,member.name,member.photo_path,member.phone,member.notes,member.joined_on,member.left_on,member.created_at);
}
export async function savePayment(input:{member_id:string;amount_centavos:number;paid_on:string;note:string;id?:string}) {
 const row=contributionSchema.parse({id:randomUUID(),created_at:new Date().toISOString(),deleted_at:null,...input});
 if(row.paid_on>localDate()) throw new Error('Future payments are not supported.');
 const {sqlite}=await database();
 await sqlite.withExclusiveTransactionAsync(async tx=>{
  const member=await tx.getFirstAsync<Member>('SELECT * FROM members WHERE id=?',row.member_id);
  if(!member || member.joined_on>row.paid_on || (member.left_on && member.left_on<row.paid_on)) throw new Error('Member was not active on this date.');
  const sum=await tx.getFirstAsync<{cents:number}>('SELECT COALESCE(SUM(amount_centavos),0) cents FROM contributions WHERE deleted_at IS NULL AND id<>?',row.id);
  if(!Number.isSafeInteger((sum?.cents??0)+row.amount_centavos)) throw new Error('Total exceeds supported money range.');
  await tx.runAsync(`INSERT INTO contributions(id,member_id,amount_centavos,paid_on,note,created_at,deleted_at) VALUES(?,?,?,?,?,?,NULL)
  ON CONFLICT(id) DO UPDATE SET member_id=excluded.member_id,amount_centavos=excluded.amount_centavos,paid_on=excluded.paid_on,note=excluded.note`,
  row.id,row.member_id,row.amount_centavos,row.paid_on,row.note,row.created_at);
 });
}
export async function deletePayment(id:string,undo=false) {
 const {sqlite}=await database(); await sqlite.runAsync('UPDATE contributions SET deleted_at=? WHERE id=?',undo?null:new Date().toISOString(),id);
}
export async function saveSetting(key:string,value:string) {
 const {sqlite}=await database(); await sqlite.runAsync('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',key,value);
}
export async function snapshot():Promise<Omit<Backup,'photos'>> {
 const {sqlite}=await database();
 // One transaction supplies a coherent logical snapshot, including soft-deleted records.
 let output:Omit<Backup,'photos'> | undefined;
 await sqlite.withExclusiveTransactionAsync(async tx=>{
  output={app:'ambag-natin',version:1,exported_at:new Date().toISOString(),
   members:await tx.getAllAsync<Member>('SELECT * FROM members'),
   contributions:await tx.getAllAsync<Contribution>('SELECT * FROM contributions'),
   withdrawals:await tx.getAllAsync<Backup['withdrawals'][number]>('SELECT * FROM withdrawals'),
   settings:await tx.getAllAsync<{key:string;value:string}>('SELECT * FROM settings')};
 });
 return output!;
}
export async function replaceData(data:Backup) {
 const {sqlite}=await database();
 await sqlite.withExclusiveTransactionAsync(async tx=>{
  await tx.execAsync(clearSQL);
  for(const row of restoreRows(data)) await tx.runAsync(row.sql,...row.params);
 });
}
