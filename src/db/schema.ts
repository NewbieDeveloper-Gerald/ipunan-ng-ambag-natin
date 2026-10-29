import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const members = sqliteTable('members', {
 id: text('id').primaryKey(), name: text('name').notNull(), photoPath: text('photo_path'),
 phone: text('phone'), notes: text('notes'), joinedOn: text('joined_on').notNull(),
 leftOn: text('left_on'), createdAt: text('created_at').notNull(),
});
export const contributions = sqliteTable('contributions', {
 id: text('id').primaryKey(), memberId: text('member_id').notNull().references(() => members.id),
 amountCentavos: integer('amount_centavos').notNull(), paidOn: text('paid_on').notNull(),
 note: text('note'), createdAt: text('created_at').notNull(), deletedAt: text('deleted_at'),
});
export const withdrawals = sqliteTable('withdrawals', {
 id: text('id').primaryKey(), amountCentavos: integer('amount_centavos').notNull(),
 spentOn: text('spent_on').notNull(), purpose: text('purpose').notNull(),
 createdAt: text('created_at').notNull(), deletedAt: text('deleted_at'),
});
export const settings = sqliteTable('settings', { key: text('key').primaryKey(), value: text('value').notNull() });
