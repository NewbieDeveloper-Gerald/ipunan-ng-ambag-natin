// Immutable after release. Add a new numbered migration for schema changes.
export const migration1 = `
CREATE TABLE members (
 id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL CHECK(length(trim(name)) > 0),
 photo_path TEXT, phone TEXT, notes TEXT, joined_on TEXT NOT NULL,
 left_on TEXT CHECK(left_on IS NULL OR left_on >= joined_on), created_at TEXT NOT NULL
);
CREATE TABLE contributions (
 id TEXT PRIMARY KEY NOT NULL, member_id TEXT NOT NULL REFERENCES members(id),
 amount_centavos INTEGER NOT NULL CHECK(typeof(amount_centavos)='integer' AND amount_centavos > 0),
 paid_on TEXT NOT NULL, note TEXT, created_at TEXT NOT NULL, deleted_at TEXT
);
CREATE INDEX contributions_member_day ON contributions(member_id, paid_on) WHERE deleted_at IS NULL;
CREATE TABLE withdrawals (
 id TEXT PRIMARY KEY NOT NULL,
 amount_centavos INTEGER NOT NULL CHECK(typeof(amount_centavos)='integer' AND amount_centavos > 0),
 spent_on TEXT NOT NULL, purpose TEXT NOT NULL, created_at TEXT NOT NULL, deleted_at TEXT
);
CREATE TABLE settings (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
INSERT INTO settings VALUES ('group_name','Ambag Natin'), ('currency','PHP'), ('collection_days','[0,1,2,3,4,5,6]');
`;
