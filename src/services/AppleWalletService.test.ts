import { NativeModules } from 'react-native';
import AppleWalletService from './AppleWalletService';

const mockAppleWallet = {
  canAddPasses: jest.fn(cb => cb(true)),
  addPassWithId: jest.fn()
};

describe('AppleWalletService', () => {
  beforeEach(() => {
    NativeModules.AppleWallet = mockAppleWallet;
  });
  it('should execute canAddPasses function', async () => {
    await AppleWalletService.canAddPasses();
    expect(mockAppleWallet.canAddPasses).toBeCalled();
  });
  it('should execute and fail canAddPasses function', async () => {
    NativeModules.AppleWallet.canAddPasses = jest.fn(() => {
      throw new Error('error');
    });
    await expect(async () => await AppleWalletService.canAddPasses()).rejects.toThrow();
    expect(mockAppleWallet.canAddPasses).toBeCalled();
  });
  it('should execute addPassWithId function', () => {
    AppleWalletService.addPassWithId('', '');
    expect(mockAppleWallet.addPassWithId).toBeCalled();
  });
});
