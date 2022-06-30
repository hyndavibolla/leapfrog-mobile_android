import { useContext } from 'react';

import { useErrorLog, useToast } from '_state_mgmt/core/hooks';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useAsyncCallback } from '_utils/useAsyncCallback';

import { statusType } from '_models/giftCard';
import { ToastType } from '_components/Toast';
import { actions } from '_state_mgmt/giftCard/actions';

export default function useGiftCardStatus() {
  const { deps, dispatch } = useContext(GlobalContext);
  const { showToast } = useToast();

  const setCardStatus: [(id: string, status: statusType, cardProvider?: string, toastBottomPosition?: number) => Promise<void>, boolean, any, void] =
    useAsyncCallback(async (id: string, status: statusType, cardProvider: string, toastBottomPosition?: number) => {
      deps.logger.info('Updating Gift Card Status');
      const request = await deps.apiService.updateCardStatus({ id, status, cardProvider });
      showToast({
        type: ToastType.SUCCESS,
        title: null,
        children: status === statusType.HIDDEN ? 'Gift Card archived.' : 'Gift Card unarchived successfully.',
        showCloseBtn: false,
        positionFromBottom: toastBottomPosition
      });
      dispatch(actions.setGiftCardStatus(id, status));
      return request;
    }, []);

  useErrorLog(setCardStatus[2], 'There was an issue updating Gift Cards status');

  return setCardStatus;
}
