// @ts-nocheck
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: (dict: {[x: string]: any}) => dict.ios,
}));

jest.mock('../modules/iosSk2', () => ({
  presentOfferCodeRedeemSheet: jest.fn(),
}));

import {
  presentCodeRedemptionSheetIOS,
  presentOfferCodeRedeemSheet,
} from '../modules/ios';
import {presentOfferCodeRedeemSheet as sk2Impl} from '../modules/iosSk2';

const sk2Mock = sk2Impl as jest.Mock;

describe('iOS offer code redemption', () => {
  beforeEach(() => {
    sk2Mock.mockResolvedValue({transactionId: 'tx1'});
  });

  it('exposes presentOfferCodeRedeemSheet over the Sk2 module', () => {
    expect(typeof presentOfferCodeRedeemSheet).toBe('function');
    presentOfferCodeRedeemSheet(['someOption']);
    expect(sk2Mock).toHaveBeenCalledWith(['someOption']);
  });

  it('presentCodeRedemptionSheetIOS wraps the new path and ignores the result', async () => {
    await expect(presentCodeRedemptionSheetIOS()).resolves.toBeNull();
    expect(sk2Mock).toHaveBeenCalledWith();
  });

  it('presentCodeRedemptionSheetIOS keeps its fire-and-forget contract and never rejects', async () => {
    sk2Mock.mockRejectedValueOnce({code: 'E_USER_CANCELLED'});
    await expect(presentCodeRedemptionSheetIOS()).resolves.toBeNull();
  });
});
