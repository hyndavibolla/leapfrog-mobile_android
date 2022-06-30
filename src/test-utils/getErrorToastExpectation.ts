import { act } from 'react-test-renderer';

import { ACTION_TYPE } from '../state-mgmt/core/actions';
import { ToastType } from '../views/shared/Toast';
import { Deps } from '../models/general';
import { wait } from '../utils/wait';
import { renderWrappedHook } from './renderWrappedHook';

export const getErrorToastExpectation = async (hookGetter: () => any, deps: Deps, errorArgs: any[] = []) => {
  const { result, mockReducer } = renderWrappedHook(hookGetter, deps);
  await act(async () => {
    await (result.current[0] as (...args: any[]) => Promise<any>)(...errorArgs);
    await wait(0); // waiting for the useEffect dispatching the toast to run
    expect(mockReducer).toBeCalledWith(
      expect.any(Object),
      expect.objectContaining({
        type: ACTION_TYPE.ADD_TOAST,
        payload: expect.objectContaining({ props: expect.objectContaining({ type: ToastType.ERROR }) })
      })
    );
  });
};
