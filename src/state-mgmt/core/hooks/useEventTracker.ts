import { useContext, useCallback, useMemo } from 'react';

import {
  ConversionEventType,
  ENV,
  ForterActionType,
  ForterNavigationType,
  FORTER_ROUTE_MAP,
  PageType,
  PAGE_TYPE_MAP,
  SECTION_MAP,
  SECTION_PAGE_MAP,
  TealiumEventType
} from '../../../constants';
import { getPageNameByRoute } from '../../../utils/trackingUtils';
import { getFullUrl } from '../../../utils/getFullUrl';
import { GlobalContext } from '../../GlobalState';

export const useEventTracker = () => {
  const { deps } = useContext(GlobalContext);

  const getMarketingId = useCallback(
    (tealiumEventName: TealiumEventType) => {
      if ([TealiumEventType.BACK_TO_FOREGROUND, TealiumEventType.LAUNCH].includes(tealiumEventName)) {
        return deps.stateSnapshot.get().core.marketingId;
      }
      return undefined;
    },
    [deps.stateSnapshot]
  );

  const getBaseTrackingDataForSystemEvents = useCallback(
    async (tealiumEventName: TealiumEventType) => {
      const sywUserId = deps.stateSnapshot.get().user.currentUser.sywUserId;
      const tellurideId = deps.stateSnapshot.get().user.currentUser.personal.sywMemberNumber;
      const marketingId = getMarketingId(tealiumEventName);
      const isTrackingEnabled = await deps.eventTrackerService.isTrackingEnabled();
      const url = getFullUrl(deps.stateSnapshot.get()?.core?.lastRouteKey, deps.stateSnapshot.get()?.core?.lastRouteParams);
      return {
        instance: 'sywmax',
        app_name: 'native',
        touchpoint: deps.nativeHelperService.platform.OS,
        page_name: getPageNameByRoute(url),
        page_type: PAGE_TYPE_MAP[deps.stateSnapshot.get().core.lastRouteKey] ?? PageType.INFO,
        iframe: undefined,
        address: `${ENV.SCHEME}${url}`,
        section: SECTION_MAP[tealiumEventName],
        search_term: undefined, // to be filled on some events
        select_category: undefined, // to be filled on some events
        sort_by: undefined,
        '5321_cardmember': deps.stateSnapshot.get().game.current.memberships.userHasSywCard ? 'yes' : 'no',
        syw_id: isTrackingEnabled ? sywUserId : undefined,
        tid: isTrackingEnabled ? tellurideId : undefined,
        member_level: undefined,
        login_state: sywUserId ? 'authenticated' : 'anonymous',
        error: undefined, // to be filled on some events
        event_name: tealiumEventName,
        event_type: TealiumEventType.SYSTEM, // to be filled on some events
        event_detail: undefined, // to be filled on some events
        uxObject: undefined, // to be filled on some events
        exit_link: undefined,
        brand_name: undefined, // to be filled on some events
        brand_category: undefined, // to be filled on some events
        brand_id: undefined, // to be filled on some events
        marketing_id: marketingId, // to be filled on some events
        push_trigger: undefined, // to be filled on some events
        pending_points: String(deps.stateSnapshot.get().game.current.balance.pendingPoints),
        balance_points: String(deps.stateSnapshot.get().game.current.balance.availablePoints),
        user_type: undefined // to be filled on some events
      };
    },
    [deps.nativeHelperService, deps.stateSnapshot, getMarketingId, deps.eventTrackerService]
  );

  const getBaseTrackingDataForUserEvents = useCallback(
    async (tealiumEventName: TealiumEventType) => {
      const sywUserId = deps.stateSnapshot.get().user.currentUser.sywUserId;
      const isTrackingEnabled = await deps.eventTrackerService.isTrackingEnabled();
      return {
        instance: 'sywmax',
        app_name: 'native',
        touchpoint: deps.nativeHelperService.platform.OS,
        page_name: getPageNameByRoute(deps.stateSnapshot.get().core.lastRouteKey),
        page_type: PAGE_TYPE_MAP[deps.stateSnapshot.get().core.lastRouteKey] ?? PageType.INFO,
        iframe: undefined,
        address: `${ENV.SCHEME}${deps.stateSnapshot.get().core.lastRouteKey}`,
        login_state: sywUserId ? 'authenticated' : 'anonymous',
        section: SECTION_MAP[tealiumEventName],
        search_term: undefined, // to be filled on some events
        select_category: undefined, // to be filled on some events
        sort_by: undefined,
        '5321_cardmember': deps.stateSnapshot.get().game.current.memberships.userHasSywCard ? 'yes' : 'no',
        syw_id: isTrackingEnabled ? sywUserId : undefined,
        tid: isTrackingEnabled ? deps.stateSnapshot.get().user.currentUser.personal.sywMemberNumber : undefined,
        member_level: undefined,
        error: undefined, // to be filled on some events
        event_name: tealiumEventName,
        event_type: undefined, // to be filled on some events
        event_detail: undefined, // to be filled on some events
        uxObject: undefined, // to be filled on some events
        exit_link: undefined,
        brand_name: undefined, // to be filled on some events
        brand_category: undefined, // to be filled on some events
        brand_id: undefined, // to be filled on some events
        marketing_id: undefined, // to be filled on some events
        push_trigger: undefined, // to be filled on some events
        user_type: undefined // to be filled on some events
      };
    },
    [deps.nativeHelperService, deps.stateSnapshot, deps.eventTrackerService]
  );

  const getBaseTrackingDataForViewEvents = useCallback(
    async (route: string) => {
      return {
        instance: 'sywmax',
        app_name: 'native',
        touchpoint: deps.nativeHelperService.platform.OS,
        page_name: getPageNameByRoute(route),
        page_type: PAGE_TYPE_MAP[route],
        section: SECTION_PAGE_MAP[route],
        address: `${ENV.SCHEME}${route}`
      };
    },
    [deps.nativeHelperService]
  );

  const trackSystemEvent = useCallback(
    async (
      tealiumEventName: TealiumEventType,
      data: Record<string, string | string[]>,
      forterActionType: ForterActionType,
      forterOverrideData?: Record<string, any>
    ) => {
      const tealiumEventData = { ...(await getBaseTrackingDataForSystemEvents(tealiumEventName)), ...data };
      const forterEventData = forterOverrideData || {
        event_name: tealiumEventData.event_name,
        event_type: tealiumEventData.event_type,
        event_detail: tealiumEventData.event_detail
      };
      if (tealiumEventName) deps.eventTrackerService.tealiumSDK.track(tealiumEventName, tealiumEventData);
      if (forterActionType) deps.eventTrackerService.forterSDK.fraudTrackAction(forterActionType, forterEventData);
    },
    [deps.eventTrackerService, getBaseTrackingDataForSystemEvents]
  );

  const trackUserEvent = useCallback(
    async (
      tealiumEventName: TealiumEventType,
      data: Record<string, string | string[]>,
      forterActionType: ForterActionType,
      forterOverrideData?: Record<string, any>
    ) => {
      const tealiumEventData = { ...(await getBaseTrackingDataForUserEvents(tealiumEventName)), ...data };
      const forterEventData = forterOverrideData || {
        event_name: tealiumEventData.event_name,
        event_type: tealiumEventData.event_type,
        event_detail: tealiumEventData.event_detail
      };
      if (tealiumEventName) deps.eventTrackerService.tealiumSDK.track(tealiumEventName, tealiumEventData);
      if (forterActionType) deps.eventTrackerService.forterSDK.fraudTrackAction(forterActionType, forterEventData);
    },
    [deps.eventTrackerService, getBaseTrackingDataForUserEvents]
  );

  const trackView = useCallback(
    async (route: string, data: Record<string, string | string[]> = {}) => {
      deps.eventTrackerService.tealiumSDK.trackView(route, { ...(await getBaseTrackingDataForViewEvents(route)), ...data });
      deps.eventTrackerService.forterSDK.fraudTrackNavigationEvent(route, FORTER_ROUTE_MAP[route] || ForterNavigationType.APP);
    },
    [deps.eventTrackerService, getBaseTrackingDataForViewEvents]
  );

  const getBaseConversionEventData = useCallback(
    () => ({
      date_time: new Date().toISOString(),
      os: deps.nativeHelperService.platform.OS,
      device_type: deps.nativeHelperService.deviceInfo.getDeviceId(),
      app_version: ENV.REMOTE_CONFIG.KEY.APP_VERSION
    }),
    [deps.nativeHelperService.platform.OS, deps.nativeHelperService.deviceInfo]
  );

  const trackConversionEvent = useCallback(
    (eventName: ConversionEventType, eventData: object) => {
      deps.eventTrackerService.appsFlyerSDK.trackConversionEvent(eventName, { ...getBaseConversionEventData(), ...eventData });
    },
    [deps.eventTrackerService, getBaseConversionEventData]
  );

  return useMemo(
    () => ({ trackSystemEvent, trackUserEvent, trackView, trackConversionEvent }),
    [trackSystemEvent, trackUserEvent, trackView, trackConversionEvent]
  );
};
