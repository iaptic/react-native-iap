// @ts-nocheck
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: (dict: {[x: string]: any}) => dict.ios,
}));

jest.mock('../modules/iosSk2', () => ({
  presentOfferCodeRedeemSheet: jest.fn(),
}));

const {NativeModules} = require('react-native');
NativeModules.RNIapIos = {
  presentCodeRedemptionSheet: jest.fn().mockResolvedValue(null),
};

// Required after injecting RNIapIos so the module-level
// `const {RNIapIos} = NativeModules` in ios.ts picks the mock up.
const {
  presentCodeRedemptionSheetIOS,
  presentOfferCodeRedeemSheet,
} = require('../modules/ios');
const {presentOfferCodeRedeemSheet: sk2Impl} = require('../modules/iosSk2');

const sk2Mock = sk2Impl as jest.Mock;
const legacySheet = NativeModules.RNIapIos
  .presentCodeRedemptionSheet as jest.Mock;

describe('iOS offer code redemption', () => {
  beforeEach(() => {
    sk2Mock.mockResolvedValue({transactionId: 'tx1'});
    legacySheet.mockClear();
  });

  it('exposes presentOfferCodeRedeemSheet over the Sk2 module', () => {
    expect(typeof presentOfferCodeRedeemSheet).toBe('function');
    presentOfferCodeRedeemSheet(['someOption']);
    expect(sk2Mock).toHaveBeenCalledWith(['someOption']);
  });

  it('presentCodeRedemptionSheetIOS wraps the new path and ignores the result', async () => {
    await expect(presentCodeRedemptionSheetIOS()).resolves.toBeNull();
    expect(sk2Mock).toHaveBeenCalledWith();
    expect(legacySheet).not.toHaveBeenCalled();
  });

  it('presentCodeRedemptionSheetIOS keeps its fire-and-forget contract and never rejects', async () => {
    sk2Mock.mockRejectedValueOnce({code: 'E_USER_CANCELLED'});
    await expect(presentCodeRedemptionSheetIOS()).resolves.toBeNull();
    expect(legacySheet).not.toHaveBeenCalled();
  });

  it('presentCodeRedemptionSheetIOS falls back to the legacy Sk1 sheet when the Sk2 module is a Dummy (iOS < 15)', async () => {
    sk2Mock.mockRejectedValueOnce({code: 'E_DEVELOPER_ERROR'});
    await expect(presentCodeRedemptionSheetIOS()).resolves.toBeNull();
    expect(legacySheet).toHaveBeenCalled();
  });
});
