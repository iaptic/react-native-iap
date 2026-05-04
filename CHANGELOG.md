## Changelog

### @iaptic/react-native-iap@12.16.5 — 2026-05-04

Iaptic-maintained fork of upstream `react-native-iap@12.16.4`. Single change:

- **iOS, new architecture**: `RNIap.podspec` now calls React Native's
  `install_modules_dependencies(s)` helper (when defined, with the original
  manual subspec list as a fallback) under `RCT_NEW_ARCH_ENABLED=1`.
  Fixes `Unable to find a specification for RCT-Folly depended upon by RNIap`
  on React Native ≥ 0.83 / Expo SDK ≥ 55 with the prebuilt-artifacts
  pipeline (the bundled `ReactNativeDependencies` pod no longer exposes
  `RCT-Folly`, `RCTRequired`, `RCTTypeSafety`, or
  `ReactCommon/turbomodule/core` as standalone podspecs).

JavaScript / Java / Objective-C / Swift code is unchanged from upstream
`12.16.4`.

### Upstream history

For the upstream changelog up to 12.16.4 see
[hyochan/react-native-iap releases](https://github.com/hyochan/react-native-iap/releases).
