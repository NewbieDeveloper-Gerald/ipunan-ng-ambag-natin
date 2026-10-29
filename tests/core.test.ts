import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { migration1 } from '../src/db/migrations/0001';
import { dailySQL, balanceSQL } from '../src/db/queries';
import { daySchema, validateBackup, type Backup } from '../src/utils/validation';
function fixture() {
 const db=new DatabaseSync(':memory:');db.exec('PRAGMA foreign_keys=ON;'+migration1);
 const member=db.prepare('INSERT INTO members(id,name,joined_on,left_on,created_at) VALUES(?,?,?,?,?)');
 member.run('a','Ana','2026-10-01',null,'2026-10-01T00:00:00.000Z');
 member.run('b','Ben','2026-10-28',null,'2026-10-01T00:00:00.000Z');
 member.run('c','Cai','2026-10-01','2026-10-27','2026-10-01T00:00:00.000Z');
 member.run('d','Dan','2026-10-29',null,'2026-10-01T00:00:00.000Z');
 return db;
}
test('daily query: join today, left yesterday, future join and no payments',()=>{
 const db=fixture();try{const rows=db.prepare(dailySQL).all('2026-10-28','2026-10-28','2026-10-28');assert.deepEqual(rows.map(m=>m.id),['a','b']);assert.ok(rows.every(m=>m.paid_centavos===0));}finally{db.close();}
});
test('daily query: multiple payments, deleted payment ignored, left_on inclusive',()=>{
 const db=fixture();try{
  db.exec("INSERT INTO contributions VALUES('p1','a',5000,'2026-10-27',NULL,'2026-10-27T00:00:00.000Z',NULL),('p2','a',29,'2026-10-27',NULL,'2026-10-27T00:00:00.000Z',NULL),('p3','c',800,'2026-10-27',NULL,'2026-10-27T00:00:00.000Z','2026-10-28T00:00:00.000Z');");
  const rows=db.prepare(dailySQL).all('2026-10-27','2026-10-27','2026-10-27');assert.deepEqual(rows.map(m=>[m.id,m.paid_centavos]),[['a',5029],['c',0]]);
 }finally{db.close();}
});
test('balance includes withdrawals, excludes soft deletes, supports undo',()=>{
 const db=fixture();try{
  assert.equal(db.prepare(balanceSQL).get()?.cents,0);
  db.exec("INSERT INTO contributions VALUES('p1','a',5000,'2026-10-27',NULL,'2026-10-27T00:00:00.000Z',NULL);INSERT INTO withdrawals VALUES('w1',1000,'2026-10-27','food','2026-10-27T00:00:00.000Z',NULL);");
  assert.equal(db.prepare(balanceSQL).get()?.cents,4000);
  db.exec("UPDATE contributions SET deleted_at='2026-10-28T00:00:00.000Z'");assert.equal(db.prepare(balanceSQL).get()?.cents,-1000);
  db.exec('UPDATE contributions SET deleted_at=NULL');assert.equal(db.prepare(balanceSQL).get()?.cents,4000);
 }finally{db.close();}
});
test('database rejects invalid money and broken foreign keys',()=>{
 const db=fixture();try{for(const amount of [0,-1,1.5])assert.throws(()=>db.prepare("INSERT INTO contributions VALUES('p','a',?,'2026-10-28',NULL,'now',NULL)").run(amount));assert.throws(()=>db.exec("INSERT INTO contributions VALUES('p','missing',100,'2026-10-28',NULL,'now',NULL)"));}finally{db.close();}
});
test('SQLite transaction rollback retains original data after failed replace',()=>{
 const db=fixture();try{db.exec('BEGIN');db.exec('DELETE FROM members');assert.throws(()=>db.exec("INSERT INTO members(id,name,joined_on,created_at) VALUES('x','','2026-10-28','now')"));db.exec('ROLLBACK');assert.equal(db.prepare('SELECT COUNT(*) n FROM members').get()?.n,4);}finally{db.close();}
});
const empty:Backup={app:'ambag-natin',version:1,exported_at:'2026-10-28T00:00:00.000Z',members:[],contributions:[],withdrawals:[],settings:[],photos:{}};
test('backup rejects bad format/version and accepts roundtrip',()=>{assert.deepEqual(validateBackup(JSON.parse(JSON.stringify(empty))),empty);assert.throws(()=>validateBackup({...empty,version:2}));assert.throws(()=>validateBackup({}));});
test('backup rejects dangling payments, missing photos, unsafe paths and duplicates',()=>{
 const m={id:'a',name:'Ana',joined_on:'2026-10-28',left_on:null,phone:null,notes:null,photo_path:null,created_at:empty.exported_at};
 assert.throws(()=>validateBackup({...empty,members:[m,m]}));
 assert.throws(()=>validateBackup({...empty,members:[{...m,photo_path:'photos/x.jpg'}]}));
 assert.throws(()=>validateBackup({...empty,photos:{'../bad.jpg':'AAAA'}}));
 assert.throws(()=>validateBackup({...empty,contributions:[{id:'p',member_id:'missing',amount_centavos:100,paid_on:'2026-10-28',note:null,created_at:empty.exported_at,deleted_at:null}]}));
});
test('date validation rejects impossible days and accepts leap years',()=>{assert.equal(daySchema.parse('2028-02-29'),'2028-02-29');for(const d of ['2026-02-29','2026-04-31','2026-13-01','2026-1-01'])assert.throws(()=>daySchema.parse(d));});

test('production restore statements roundtrip all tables, including deleted records',async()=>{
 const {restoreRows,clearSQL}=await import('../src/db/restore');
 const source=fixture(),destination=fixture();
 try {
  source.exec("INSERT INTO contributions VALUES('p','a',29,'2026-10-28','tiny','2026-10-28T00:00:00.000Z','2026-10-29T00:00:00.000Z');INSERT INTO withdrawals VALUES('w',10,'2026-10-28','test','2026-10-28T00:00:00.000Z',NULL)");
  const raw={...empty,members:source.prepare('SELECT * FROM members').all(),contributions:source.prepare('SELECT * FROM contributions').all(),withdrawals:source.prepare('SELECT * FROM withdrawals').all(),settings:source.prepare('SELECT * FROM settings').all()};
  const backup=validateBackup(JSON.parse(JSON.stringify(raw)));
  destination.exec('BEGIN');destination.exec(clearSQL);
  for(const row of restoreRows(backup))destination.prepare(row.sql).run(...row.params);
  destination.exec('COMMIT');
  for(const table of ['members','contributions','withdrawals','settings'])assert.deepEqual(destination.prepare(`SELECT * FROM ${table}`).all(),source.prepare(`SELECT * FROM ${table}`).all());
 }finally{source.close();destination.close();}
});
