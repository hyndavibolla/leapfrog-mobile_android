import { NativeModules } from 'react-native';

const canAddPasses = (): Promise<boolean> =>
  new Promise((resolve, reject) => {
    try {
      NativeModules.AppleWallet.canAddPasses(value => resolve(value));
    } catch (error) {
      reject(error);
    }
  });

const addPassWithId = (id: string, pass: string): Promise<boolean> => NativeModules.AppleWallet.addPassWithId(id, pass);

export default { canAddPasses, addPassWithId };
