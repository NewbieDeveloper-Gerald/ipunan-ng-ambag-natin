import type { Backup } from '../utils/validation';
export const clearSQL='DELETE FROM contributions; DELETE FROM withdrawals; DELETE FROM members; DELETE FROM settings;';
export function* restoreRows(data:Backup):Generator<{sql:string;params:(string|number|null)[]}> {
 for(const m of data.members) yield {sql:'INSERT INTO members VALUES(?,?,?,?,?,?,?,?)',params:[m.id,m.name,m.photo_path,m.phone,m.notes,m.joined_on,m.left_on,m.created_at]};
 for(const c of data.contributions) yield {sql:'INSERT INTO contributions VALUES(?,?,?,?,?,?,?)',params:[c.id,c.member_id,c.amount_centavos,c.paid_on,c.note,c.created_at,c.deleted_at]};
 for(const w of data.withdrawals) yield {sql:'INSERT INTO withdrawals VALUES(?,?,?,?,?,?)',params:[w.id,w.amount_centavos,w.spent_on,w.purpose,w.created_at,w.deleted_at]};
 for(const s of data.settings) yield {sql:'INSERT INTO settings VALUES(?,?)',params:[s.key,s.value]};
}
