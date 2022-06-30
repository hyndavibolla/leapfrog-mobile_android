import { useCallback, useContext, useMemo } from 'react';
import moment from 'moment';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { actions } from './actions';
import { ISailthruMessage } from '_models/general';

import { compareVersionNumber } from '_utils/compareVersionNumber';
import { useAsyncCallback } from '_utils/useAsyncCallback';
import { normalizeKeys } from '_utils/normalizeKeys';

import { ENV } from '_constants';

export const useSailthruMessages = (): [ISailthruMessage[], () => Promise<void>, (message) => void] => {
  const {
    deps: {
      nativeHelperService: { sailthru },
      logger
    },
    state: {
      messages: { sailthru: sailthruMessages }
    },
    dispatch
  } = useContext(GlobalContext);

  const [getMessages] = useAsyncCallback(async () => {
    try {
      const messages = await sailthru.getMessages();
      dispatch(actions.setSailthruMessages(normalizeKeys(messages)));
    } catch (error) {
      logger.error('Getting messages from SailThru', { error });
    }
  }, [dispatch]);

  const onReadMessage = useCallback(
    async (message: ISailthruMessage) => {
      const newMessages = sailthruMessages.map(item => ({ ...item, isRead: item.id === message.id || item.isRead }));
      dispatch(actions.setSailthruMessages(newMessages));
      try {
        await sailthru.markMessageAsRead(message);
      } catch (error) {
        logger.error('Mark message as read in SailThru', { error });
      }
    },
    [sailthruMessages, dispatch, sailthru, logger]
  );

  return useMemo(() => [sailthruMessages, getMessages, onReadMessage], [sailthruMessages, getMessages, onReadMessage]);
};

export const useNewOnMaxMessages = (): [ISailthruMessage[], () => Promise<void>, (message) => void, boolean, () => Promise<void>] => {
  const [messages, getMessages, onReadMessage] = useSailthruMessages();

  const {
    deps: {
      nativeHelperService: { storage }
    },
    state: {
      messages: { lastNewOnMaxOnboardDate: lastOnboard }
    },
    dispatch
  } = useContext(GlobalContext);

  const newOnMaxMessages = useMemo(
    () =>
      messages.filter(
        message =>
          message.custom.category === ENV.SAILTHRU_MESSAGES_CATEGORIES.NEW_ON_MAX &&
          !message.isRead &&
          compareVersionNumber(ENV.APP_VERSION, message.custom.minAppVersion) >= 0 &&
          (!message.custom.maxAppVersion || compareVersionNumber(ENV.APP_VERSION, message.custom.maxAppVersion) < 0)
      ),
    [messages]
  );

  const [onGetMessages] = useAsyncCallback(async () => {
    getMessages();
    const savedLastOnboard = await storage.get(ENV.STORAGE_KEY.NEW_ON_MAX_LAST_ONBOARD);
    if (savedLastOnboard) dispatch(actions.setLastNewOnMaxOnboardDate(Number(savedLastOnboard)));
  }, [getMessages, storage, dispatch]);

  const [onReadOnboardMessage] = useAsyncCallback(async () => {
    const lastOnboardDate = Date.now();
    await storage.set(ENV.STORAGE_KEY.NEW_ON_MAX_LAST_ONBOARD, lastOnboardDate);
    dispatch(actions.setLastNewOnMaxOnboardDate(lastOnboardDate));
  }, [storage, dispatch]);

  const showOnboardMessage = useMemo<boolean>(() => {
    if (!newOnMaxMessages.length) return false;
    if (!lastOnboard) return true;
    const lastMessageDate = newOnMaxMessages.reduce(
      (lastValue, message) => (moment(message.createdAt.replace('GMT', '')).isAfter(lastValue) ? message.createdAt.replace('GMT', '') : lastValue),
      newOnMaxMessages[0].createdAt.replace('GMT', '')
    );
    return moment(lastMessageDate).isAfter(lastOnboard);
  }, [newOnMaxMessages, lastOnboard]);

  return useMemo(
    () => [newOnMaxMessages, onGetMessages, onReadMessage, showOnboardMessage, onReadOnboardMessage],
    [newOnMaxMessages, onGetMessages, onReadMessage, showOnboardMessage, onReadOnboardMessage]
  );
};
