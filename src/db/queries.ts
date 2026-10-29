export const dailySQL = `SELECT m.*, COALESCE((SELECT SUM(c.amount_centavos) FROM contributions c
 WHERE c.member_id=m.id AND c.paid_on=? AND c.deleted_at IS NULL),0) AS paid_centavos
 FROM members m WHERE m.joined_on<=? AND (m.left_on IS NULL OR m.left_on>=?) ORDER BY m.name COLLATE NOCASE`;
export const balanceSQL = `SELECT COALESCE((SELECT SUM(amount_centavos) FROM contributions WHERE deleted_at IS NULL),0)
 - COALESCE((SELECT SUM(amount_centavos) FROM withdrawals WHERE deleted_at IS NULL),0) AS cents`;
