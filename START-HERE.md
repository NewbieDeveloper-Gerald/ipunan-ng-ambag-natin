# Android APK is now available

The Android release was compiled locally and signed. To install it, download `Ambag-Natin-0.1.0.apk` from this conversation on your Android phone, open it from Downloads, and follow Android’s installation prompts. No Expo account, Node.js, Expo Go or computer is needed to install this finished APK. Alternatively, extract `Ambag-Natin-Android-Installer.zip` and open the APK inside.

Requirements: Android 7.0+ on ARM64 or ARMv7. Not an iPhone app. This is a core preview; verify sample records and external backups before trusting it with real money.

The instructions below are for making YOUR OWN future builds, not for installing the ready-made APK. A different signing key cannot update this APK in place. Do not uninstall a populated app without first saving an external backup.

---

# Get an installable Ambag Natin app

## What this download is
This is the core app source with build setup. It is **not yet an APK**, an IPA, a store listing or a TestFlight invitation. The remaining build step needs YOUR Expo account; iPhone also needs Apple signing. No password should be sent in chat.

## Android — downloadable APK from Windows
1. Install Node 22 LTS (22.13 or newer).
2. Create an Expo account at https://expo.dev/signup if you do not have one.
3. Extract the complete ZIP into a **new folder**. Keep the older Phase 0 copy separately; do not mix node_modules folders.
4. Open the extracted `ambag-natin` folder and double-click **BUILD-ANDROID.cmd**.
5. Follow the terminal prompts. Log in to your own Expo account. Allow creation/linking of an EAS project for Ambag Natin. If asked to generate an Android keystore, choose **Yes** for a new project. Keep the same account and signing key for future updates.
6. EAS uploads this SOURCE CODE and builds in the cloud; it does not upload your phone's member/payment records. Build queue time and account limits vary. Do not approve a paid charge unless you agree to it.
7. When EAS reports a successful Android build, open the build link and download the **.apk** on your Android phone.
8. Android may ask you to allow installation from the browser/file app. Install only the APK from your own build link, then turn that permission off if desired.
9. Open Ambag Natin directly from its app icon. It should no longer need Expo Go, your computer or the development QR code.

Equivalent terminal commands, run one at a time inside the extracted folder:

```powershell
npm ci --include=dev --bin-links=true
npm run check
npx eas-cli@latest login
npx eas-cli@latest init
npm run build:android
```

`eas init` should write your real project ID to app configuration; no placeholder ID is provided. For a newly generated signing key, record your Expo project/account so you can build compatible updates.

If npm warns that esbuild's install script needs approval, review that package and follow the npm approval command shown by YOUR npm version, then rerun `npm run check`. Do not blindly approve unrelated scripts. If expo/tsc/tsx is not recognized, confirm the terminal is in the extracted project folder and rerun the `npm ci` command above. `.npmrc` explicitly enables local command shortcuts and dev tools.

## iPhone — TestFlight, not an Android APK
An APK cannot install on iPhone. The normal supported path from Windows is:
1. Have an Apple Developer Program membership with signing/App Store Connect access.
2. Complete the Expo login and `eas init` above.
3. Review the identifiers in `app.json` **before your first distribution**. Defaults are `com.gerald.ambagnatin` for both platforms. You must own/use an available identifier; keep it stable for updates.
4. Run:

```powershell
npm run build:ios
```

5. Follow EAS prompts to authorize Apple signing. Keep credentials private. A successful build produces a signed store archive, not a freely sideloadable iPhone application.
6. Upload to App Store Connect:

```powershell
npx eas-cli@latest submit --platform ios --latest
```

7. Complete any app record, compliance and TestFlight setup requested in App Store Connect. After processing, invite an internal tester (or follow Apple's external-testing review requirements), then install through Apple's TestFlight app.

No Mac is needed for these EAS cloud steps. Apple membership, processing and review are outside this source project. An Apple-signed iPhone build and TestFlight link have NOT been generated here.

## Verify before keeping real money records
Use `docs/CORE-TEST.md`: add sample members/photos, record sample contributions, close/reopen, test an external backup and restore, then test a standalone airplane-mode cold start. Keep a separate notebook until these pass. Do NOT uninstall your only copy to test restore.

## Send back if a build fails
- Android or iPhone
- Node and npm versions
- Exact final terminal error, or EAS build URL/log excerpt
- Phone model/OS, if installation or startup fails

Redact passwords, tokens and private signing keys. A build URL is more helpful than waiting at a frozen terminal.
