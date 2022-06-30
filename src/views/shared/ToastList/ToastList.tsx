import React, { memo, useCallback, useContext, useEffect } from 'react';

import { Toast } from '../Toast';
import { actions } from '../../../state-mgmt/core/actions';
import { GlobalContext } from '../../../state-mgmt/GlobalState';
import { ENV } from '../../../constants';

export interface Props {}

export const ToastList = ({}: Props) => {
  const { dispatch, state } = useContext(GlobalContext);

  const [item] = state.core.toastList;

  const onPress = useCallback(() => dispatch(actions.removeToast(item.key)), [item, dispatch]);

  useEffect(() => {
    if (!item) return;
    const timeout = setTimeout(() => dispatch(actions.removeToast(item.key)), ENV.TOAST_VISIBLE_MS);
    return () => clearTimeout(timeout);
  }, [dispatch, item]);

  return !item ? null : <Toast key={item.key} {...item.props} onPress={onPress} />;
};

export default memo(ToastList);
