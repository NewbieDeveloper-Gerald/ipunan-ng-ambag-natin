import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePesos, formatPesos } from '../src/utils/money';
import { localDate, yesterday } from '../src/utils/dates';
test('money is parsed without floating point multiplication errors', () => {
 assert.equal(parsePesos('50'),5000); assert.equal(parsePesos('0.29'),29); assert.equal(parsePesos(' 12.5 '),1250);
});
test('invalid and unsafe money is rejected', () => {
 for (const v of ['0','-1','1.001','1e3','','NaN','9,000','999999999999999']) assert.throws(()=>parsePesos(v));
});
test('PHP display', () => { assert.match(formatPesos(5000), /50\.00/); assert.throws(()=>formatPesos(1.5)); });
test('local dates and year boundaries', () => {
 const day = new Date(2026,0,1,0,15); assert.equal(localDate(day),'2026-01-01'); assert.equal(yesterday(day),'2025-12-31'); assert.equal(day.getDate(),1);
});
