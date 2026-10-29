# Core preview acceptance checklist

Use fake names/photos with permission. Do not yet use this preview as the sole record of real funds.

## Automated / configuration
- [ ] `npm ci --include=dev --bin-links=true` succeeds.
- [ ] `npm run check`: TypeScript, lint and **13 tests** pass.
- [ ] `npx expo-doctor`: 20 checks pass.
- [ ] A signed native APK / TestFlight build actually completes. Bundle export alone is not enough.

## Members
- [ ] Add Ana and Ben, both joined today. Add Cai joined yesterday, left yesterday.
- [ ] Add 10 sample members, some with gallery photos, one with camera, some without photos.
- [ ] Deny camera permission; app shows a helpful error and gallery is still usable.
- [ ] Change a photo, edit a name and optional fields, search names/phones.
- [ ] Invalid dates, blank names and leave-before-join dates fail without saving.
- [ ] Force-close and reopen; all member fields/photos remain.

## Contributions / money
- [ ] Today, Ana pays PHP 50.00 then PHP 0.29. Home balance increases by **PHP 50.29**.
- [ ] Ana is paid once with PHP 50.29 total; Ben is unpaid. Cai is not expected today.
- [ ] Yesterday, Ana and Ben are absent if they joined today; Cai is expected through their inclusive leave date.
- [ ] Edit PHP 50.00 to PHP 60.00; balance becomes **PHP 60.29** (starting from empty data).
- [ ] Remove PHP 0.29; balance becomes **PHP 60.00**. Undo restores PHP 60.29.
- [ ] Empty/negative/zero/three-decimal amounts fail. Future dates and dates outside a member's active interval fail.
- [ ] Select any past date with YYYY-MM-DD. Counts, per-member amounts and daily total match your notes.
- [ ] Disable today's weekday in Settings. Home unpaid view says no collection scheduled. Existing payments/history remain visible.
- [ ] Member history and global history agree with Home balance.

## Backup and restore (required, on BOTH platforms)
- [ ] Export JSON, explicitly save it OUTSIDE the app (Files/downloads or secure external destination). Share-sheet dismissal is not proof of a saved file.
- [ ] Add a new fake member/payment AFTER export.
- [ ] Restore the saved file; the warning names replace-only behavior. The later member/payment disappears, original photos, totals and history match.
- [ ] Export latest restore safety copy. Inspect that it exists outside the app; restoring it returns to the pre-restore state.
- [ ] Cancel file selection and cancel restore confirmation: no records change.
- [ ] Try malformed JSON / version 999 / missing-photo backup: clear error, unchanged existing data.
- [ ] Restore Android-exported backup on iPhone and vice versa if you have both phones. Compare member photos and exact totals.
- [ ] On a SECOND test device/install, restore the external backup. Do not erase the only copy to do this.

## Standalone install, offline and lifecycle
- [ ] Install actual APK / TestFlight app. It opens from its icon without Expo Go.
- [ ] Stop Metro, disconnect computer, enable airplane mode, force-close and open the installed app. Records, photos, editing and totals work.
- [ ] Export to a local file while offline. Online share destinations may need internet.
- [ ] Force-close during/after a save and reopen. No duplicate partial records or broken totals.
- [ ] Low-storage failures show an error, do not replace data without a successful safety copy.
- [ ] Verify large text, small screen, long names and keyboard dismissal.
- [ ] Change timezone/date carefully and verify chosen calendar dates remain exact. Audit timestamps may display in local time.

## Report
```
Version/build URL:
Phone/OS:
Native installation: PASS/FAIL
Members/photos after restart: PASS/FAIL
Hand-checked money and dates: PASS/FAIL
External backup + restore + photos: PASS/FAIL
Airplane-mode cold start: PASS/FAIL
Errors/screenshots:
```

Do not claim release-ready until these native checks pass. Advanced PIN, biometrics, encryption and automatic backups are not part of this core preview.
