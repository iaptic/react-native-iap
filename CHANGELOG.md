## Changelog

### @iaptic/react-native-iap@13.1.0 — unreleased

Feature release — offer code redemption (iOS 27 result-based API).

- **Feature**: new `presentOfferCodeRedeemSheet(options?)` presents the App Store
  offer code redemption sheet using the iOS 27 result-based StoreKit API
  (`AppStore.presentOfferCodeRedeemSheet(from:options:)`). On success the promise
  resolves with the redeemed transaction and the transaction is emitted through
  `purchase-updated`, exactly like `requestPurchase`. Cancel and error outcomes
  are only reported on iOS 27+ and map to existing error codes:
  `.userCancelled` → `E_USER_CANCELLED`, `.networkError` → `E_NETWORK_ERROR`,
  `.notEntitled`/`.notAvailableInStorefront`/`.unsupported`/`.invalidPresentationContext`
  → `E_IAP_NOT_AVAILABLE`, `.systemError`/`.unknown`/`.unverified` → `E_UNKNOWN`;
  the message carries the Apple case name. Below iOS 27 the call is fire-and-forget
  on the deprecated sheet APIs: the promise resolves once the sheet has been
  presented and never reports cancel or errors.
- **Deprecation**: `presentCodeRedemptionSheetIOS()` is deprecated; it now wraps
  `presentOfferCodeRedeemSheet()` and ignores the result (including rejections)
  to keep its historical fire-and-forget contract.
- **Note**: `RedeemOption` values are reserved for future use — the iOS 27 SDK
  exposes no public value, so `options` currently accepts and ignores any input.

### @iaptic/react-native-iap@13.0.2 — 2026-06-11

Patch release fixing GPBL V9 compile errors in 13.0.1 (`play` flavor):

- **Fix**: add missing `import com.android.billingclient.api.PurchasesUpdatedListener`.
  Without it `RNIapModule` failed to compile (`Unresolved reference 'PurchasesUpdatedListener'`,
  `onPurchasesUpdated` overrides nothing).
- **Fix**: replace `QueryProductDetailsResult.unfetchedProductIds` (removed in billing 9.0.0)
  with `unfetchedProductList`, mapping each `UnfetchedProduct` via `productId`.

### @iaptic/react-native-iap@13.0.1 — 2026-06-05

Patch release fixing a bug in 13.0.0:

- **Fix**: `E_STORE_BLOCKED` was never received by JS callers in `initConnection()`.
  `isValidResult()` would first reject with `E_SERVICE_ERROR` for `BILLING_UNAVAILABLE`,
  then `isPlayStoreBlocked()` would try to reject again with `E_STORE_BLOCKED`.
  The second rejection was silently swallowed, so callers always got the generic
  `E_SERVICE_ERROR` instead of the specific `E_STORE_BLOCKED`. Now
  `isPlayStoreBlocked()` is checked first and returns early with the correct code.

### @iaptic/react-native-iap@13.0.0 — 2026-06-05

Major release — Google Play Billing Library V9 migration. **Breaking changes.**

- Bump `playBillingSdkVersion` 7.0.0 → 9.0.0
- Bump `compileSdkVersion`/`targetSdkVersion` 33 → 35, `minSdkVersion` 21 → 23
- Bump AGP 7.4.2 → 8.7.3, Java 8 → 17
- Replace `billing-ktx` artifact with `billing` (KTX merged in V7.1+)
- Add `namespace` to android block (required by AGP 8.x)
- Add Kotlin stdlib resolution strategy
- Update `queryProductDetailsAsync` callback to use `QueryProductDetailsResult`
  (compile-breaking change from `(BillingResult, List<ProductDetails>)`)
- Replace `enablePendingPurchases()` with
  `enablePendingPurchases(PendingPurchasesParams)` including
  `enableOneTimeProducts()` and `enablePrepaidPlans()`
- Add `enableAutoServiceReconnection()` to BillingClient builder
- Remove `getPurchaseHistoryByType`/`getPurchaseHistory`
  (GPBL V9 removed `queryPurchaseHistoryAsync`)
- Add `isPlayStoreBlocked()` detection and `E_STORE_BLOCKED` error code
- Update test mock to use `QueryProductDetailsResult`

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
