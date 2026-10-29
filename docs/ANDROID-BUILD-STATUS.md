# Android APK build — 2026-10-29

## Actual artifact
`Ambag-Natin-0.1.0.apk` was compiled by Gradle `:app:assembleRelease`, not renamed from a source ZIP.

- Result: **BUILD SUCCESSFUL**; 544 actionable tasks, last incremental completion 9m 7s after native-cache preparation.
- Expo SDK 58.0.21; React Native patched to 0.88.1 to match Expo native prebuilt libraries.
- JDK 21, Android platform 37.0 / build tools 37.0.0, target SDK 36, minimum SDK 24 (Android 7).
- Native phone ABIs: arm64-v8a and armeabi-v7a. No x86-only phone support.
- Version 0.1.0 / code 1, package `com.gerald.ambagnatin`.
- Embedded Hermes app bundle (~3 MB), native SQLite, file/photo modules and resources. No Metro/Expo Go required to launch this standalone build.
- Re-signed with a generated app-specific RSA key kept separately from distributable source; signing verification passed (v2 and v3). The default Android debug certificate is not the distributed signer.
- Android `zipalign -c -P 16 4` passed. APK ZIP integrity passed. Manifest, launcher and ABI inspection passed.
- App typecheck, lint and all 13 tests passed after the source fixes included in this build.
- No EAS account, cloud build service or user credential was needed for this local build.

## Source fixes in the compiled bundle
- Await member photo copying before saving its relative path.
- Add direct Android folder backup (Storage Access Framework through Expo FileSystem), with write/read-back validation. Share-sheet backup remains available separately.
- Limit Metro to one worker for reliable low-memory local builds.

## Scope and acceptance
This is a core preview. Real-phone lifecycle, camera permissions, external backup/restore, cross-platform restore and airplane-mode behavior still need acceptance on the user's phone. Native build success is NOT a zero-bug guarantee. No claim of App Store/TestFlight readiness or iPhone installation is made.

Signing material is deliberately not included in the APK/source ZIP; preserve the workspace's separate signing key for compatible future updates. Do not publish private signing material.

See `android-native-build.log`, `android-build-code-checks.txt`, `android-apk-signature-check.txt` and `android-apk-manifest-check.txt` for actual check output.

## Runtime attempt
A software Android 11 emulator was attempted in this sandbox (no hardware acceleration available). It did not complete boot reliably: Android services were still initializing, then the emulator itself exited with a segmentation fault before successful app installation. This is **not a successful runtime test**. No claim of an installed/launched app, UI acceptance or validated native backup/restore is made. The distributed APK's successful compilation, package/signature checks and code tests stand; the next runtime check is installation on the user's actual Android phone.

All ARM64 `.so` ELF LOAD segments were additionally checked for at least 16 KB alignment; passed.
