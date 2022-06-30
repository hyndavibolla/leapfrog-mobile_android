import React, { memo, useContext, useCallback, useState, useEffect } from 'react';

import { Modal } from '../Modal';
import { GlobalContext } from '../../../state-mgmt/GlobalState';
import { actions } from '../../../state-mgmt/core/actions';
import { ENV } from '../../../constants';

export interface Props {}

export const ModalList = ({}: Props) => {
  const { state, dispatch } = useContext(GlobalContext);
  const [visible, setVisible] = useState<boolean>(false);

  const [item] = state.core.modalList;

  const onPressOutside = useCallback(() => {
    if (item.props.onPressOutside) item.props.onPressOutside();
    setVisible(false);
  }, [item]);

  const onClose = useCallback(() => {
    if (item.props.onClose) item.props.onClose();
    setTimeout(() => dispatch(actions.removeModal(item.key)), ENV.MODAL_PADDING_MS);
  }, [item, dispatch]);

  useEffect(() => {
    if (item) setVisible(true);
  }, [item]);

  return !item ? null : <Modal key={item.key} visible={visible} {...item.props} onPressOutside={onPressOutside} onClose={onClose} />;
};

export default memo(ModalList);
