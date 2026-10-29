# Ambag Natin — core preview 0.1.0

A local-first contribution notebook for one group and one treasurer, for Android and iPhone. **An Android release APK has now been compiled and signed locally.** See `docs/ANDROID-BUILD-STATUS.md`. iPhone signing and physical-device acceptance remain pending.

## Included
- Add/edit/search members; gallery/camera photos resized to 512px maximum dimension, stored under relative filenames; initials fallback.
- Joined and inclusive leave dates; no member hard deletion.
- Record/edit contributions in PHP with integer centavos, effective collection date and notes.
- Total funds, member payment history, soft-delete and immediate undo.
- Today/yesterday/custom YYYY-MM-DD date; paid and unpaid lists, daily collection total.
- Group name and collection weekdays; skipped days do not label everyone unpaid.
- Single-file JSON backup including photos and soft-deleted records; validation and replace-only restore in a database transaction.
- Durable local safety backup before restore; export latest safety copy.
- Seven-day reminder based on last export attempt. Share-sheet completion is NOT proof of saving.
- Custom icon, Android APK cloud-build profile and iOS store/TestFlight build profile.

## Fastest path to a downloadable app
Read **START-HERE.md**. On Windows, `BUILD-ANDROID.cmd` installs, checks, asks you to log in to Expo, links an EAS project, then requests an APK build. This requires your own Expo account, internet and any quota/payment required by EAS. Never send passwords in chat.

The source ZIP itself is not installable. A separate Android APK is now available as `Ambag-Natin-0.1.0.apk`; it needs no Expo account to install. No TestFlight build exists and no EAS account is embedded in the source.

## Run in Expo Go first
Use Node **22.13+**, preferably current Node 22 LTS, and compatible Expo Go (SDK 58).

```sh
npm ci --include=dev --bin-links=true
npm run check
npm start
```

Computer on Ethernet and phone on Wi-Fi works if they are on the same local network. A tunnel (`npx expo start --tunnel`) is a development-only fallback. The standalone APK does not need Expo Go, your computer, Metro or internet to open and save records.

## Project
`app/` contains the main Router screen and layout. `src/repositories/` owns SQL/data operations. `src/db/` owns schema, the immutable initial migration, core queries and restore statements. `src/services/` owns photo and backup device APIs. `src/utils/` owns validation, money and local calendar helpers. `tests/` runs actual SQLite queries and restore statements through Node's SQLite plus pure logic tests. The screen does not execute SQL.

The core UI uses built-in React Native components and local state rather than adding Paper/NativeWind/Zustand before needed. Forms are validated at the repository boundary with Zod; dates use typed calendar text fields rather than a calendar widget. These are intentional simplifications of the original tool plan.

## Backup format and limits
Backups are version-1 JSON with logical rows and base64 JPEG photos, **not live SQLite files or ZIPs**. This avoids WAL-copy problems and is portable between platforms. No compatibility with arbitrary SQLite/ZIP backups is claimed. Photos are resized on import. Limit: 30 MB per backup / 20 MB combined source photos, 5,000 members, 100,000 contribution records. This is a small-group pilot, not load-tested to those maxima.

Restore validates version, schema, dates, identifiers, amounts, references and photo paths. It writes a complete safety JSON under app-private `safety-backups/`, stages imported photos under new filenames, then replaces all tables inside one transaction. Photo files may be orphaned if a restore fails; old files and local safety copies are intentionally not garbage-collected yet. A failed database transaction rolls back rows. Safety copy export is available in Settings. A restore is blocked if a complete current safety backup cannot be made.

**Backups, database and photos are not encrypted. There is no PIN in this core scope.** Use your phone lock and secure backup destination. Saving to an online destination requires that destination's internet connection; producing the backup does not. Uninstalling can destroy app-private data and safety copies. Always save a verified external backup.

## Scope not included
Withdrawals UI, spending/reports, CSV, advanced history filters, multi-group, logins, cloud sync, payments, PIN/biometrics, dark mode and production release. Existing withdrawal rows are preserved in backups and included in balance math, but cannot be entered in this version. Date-range bulk entry and a graphical calendar are deferred. No automatic scheduling of external backups.

## Verification and release gates
See `docs/CORE-TEST.md` and `docs/PROGRESS.md`. TypeScript, lint, 13 tests, Expo doctor, CNG prebuild and Android/iOS JS/Hermes exports passed in this environment. **Android release APK compilation, signature verification and 16 KB alignment checks have now passed.** Physical-device execution, permission acceptance, native restore and airplane-mode cold-start tests are still pending. No iPhone build was compiled.

Dependency audit still reports 8 findings (5 low, 3 high), including Expo development-tool dependencies. App validation uses Zod 4.6.7, but Expo CLI includes an older audited copy. See the audit report; do not downgrade Expo or run `audit fix --force` blindly. Review tooling findings before public release. Do not use this unaccepted preview as the only record of real money.
