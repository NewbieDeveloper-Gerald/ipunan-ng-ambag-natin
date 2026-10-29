# Phase 0 — phone acceptance test

## Setup
- [ ] Node 22.13+ installed; `npm ci` completes.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` shows four passing tests.
- [ ] Project opens in compatible Expo Go on a physical phone.

## SQLite and persistence (required)
1. Open the foundation screen. Expect **READY**, no error and **No test record yet** on first use.
2. Tap **Save test record**. Expect an ISO timestamp. Screenshot or copy it.
3. Tap **Read saved record**. Expect exactly the same timestamp, not a new one.
4. Force-close Expo Go from the app switcher. Leave Metro running.
5. Reopen this project in Expo Go. Expect **READY** and exactly the timestamp from step 2.
6. Tap **Save test record** again. Expect a newer timestamp.
7. Tap **Clear test record only**, then force-close and reopen. Expect no test record. This action must not erase the database or financial tables.
8. Check that the page scrolls, buttons remain readable, and large system text does not hide the controls.
9. If any step fails, capture the on-screen error and terminal output. Do not uninstall or clear storage before reporting: that intentionally erases local data.

**Pass gate:** steps 1–7 pass on at least one physical phone. Both platforms need eventual device acceptance; one platform passing does not prove the other works.

## Send this report back
```
Phase: 0
Phone model:
Android/iOS version:
Expo Go version:
Computer OS:
Node version:
Install / typecheck / tests: PASS or FAIL
Opens and shows READY: PASS or FAIL
Saved timestamp:
Same timestamp after force-close: PASS or FAIL
Clear survives restart: PASS or FAIL
Layout / large-text issues:
Error text / screenshot:
Ready for Phase 1: YES or NO
```

Next: Phase 1 adds searchable members, join/leave dates, photo selection and durable photo storage. No need to buy developer accounts or set up cloud services for this checkpoint.
