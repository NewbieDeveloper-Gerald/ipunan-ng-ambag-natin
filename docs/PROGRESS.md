# Core implementation progress — 2026-10-29

User selected: both platforms; core-first scope (members/photos, contributions/totals, paid/unpaid, backup/restore).

| Area | Source status | Device/build status |
|---|---|---|
| Foundation + existing v1 SQLite schema | Implemented, no destructive schema change | Native initialization needs phone acceptance |
| Members + photos | Implemented | Permissions, photo persistence need phone acceptance |
| Contributions, balance, editing and undo | Implemented | Actual phone save/lifecycle testing pending |
| Daily paid/unpaid and skip weekdays | Implemented, SQL tested | Phone acceptance pending |
| Logical JSON backup + restore + safety copy | Implemented, validators and SQL roundtrip tested | Native filesystem/share/restore and cross-platform restore pending |
| Android APK configuration | Prepared, CNG generation passed | No signed APK built; requires user's Expo project/account |
| iPhone store/TestFlight configuration | Prepared, CNG generation passed | No signed IPA/TestFlight; requires user's Expo + Apple accounts |
| Spending/reports/CSV/PIN/dark mode | Not included in selected core scope | Deferred |

## Executed here
- TypeScript check: pass.
- ESLint: pass.
- 13 tests: pass. Includes real SQLite daily queries, inclusive dates, soft deletion, money constraints, foreign keys, rollback, backup validation and production restore SQL roundtrip for ALL four tables.
- Expo doctor: 20/20 pass after SDK-58-compatible patch updates.
- Expo prebuild --no-install --platform all: pass, generated Android/iOS configurations. This is NOT native compilation. Generated folders removed from source ZIP; EAS will regenerate.
- Android JS/Hermes bundle export: pass.
- iOS JS/Hermes bundle export: pass.
- npm audit: 8 unresolved findings (5 low, 3 high), including Expo tooling dependencies; direct application Zod is 4.6.7.

## Not executed / blockers
No emulator/physical-phone runtime or native build was executed. No Expo/Apple credentials were supplied, no EAS cloud project linked, no APK or IPA produced, no build/distribution link exists. We cannot truthfully claim a downloadable installable app yet. The user's account-authenticated build is the next required step, followed by device acceptance.

## Deviations and limits
- Versioned logical JSON with embedded photos instead of SQLite ZIP. Size-limited in-memory import/export for small groups.
- Date selection uses validated text plus Today/Yesterday, not a graphical calendar.
- Basic React Native UI/local state; no Zustand/Paper/react-hook-form required for this core implementation.
- No edit audit trail, PIN, database encryption, automatic external backup, photo garbage collection, reports or payment integrations.
- A contribution's effective date must be in the member's inclusive active interval and not in the future.
- A member's past dates can be edited; this changes historical expectations but does not delete their payment records.
- No merged restore; replacement only. Local safety copies are not a substitute for external backups.

See START-HERE.md for the shortest route from Windows to an actual Android APK and to iPhone TestFlight.

## Android build update — 2026-10-29
A real Android release APK has now been compiled locally, app-specifically signed, and checked for signature, ZIP integrity, Android manifest/launcher, embedded bundle and 16 KB APK alignment. The earlier statement that no APK exists is historical and superseded. See `ANDROID-BUILD-STATUS.md`. This does not supersede pending real-device acceptance or the absent iPhone build.
