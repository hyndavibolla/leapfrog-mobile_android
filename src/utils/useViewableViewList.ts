import { useState, useRef, useEffect, useMemo, MutableRefObject, useCallback } from 'react';
import { View } from 'react-native';

import { asyncMeasureInWindow } from './asyncMeasureInWindow';
import { isViewableInsideContainer } from './isViewableInsideContainer';
import { removeKeyList } from './removeKeyList';
import { usePrevious } from './usePrevious';

type TimeoutMap = Record<string, number>;

export const useViewableViewList = (
  timeThreshold: number,
  visibilityThreshold: number,
  isFocused: boolean
): [string[], () => Promise<void>, MutableRefObject<View>, (uuid: string, ref: View) => void] => {
  const [viewedMissionList, setViewedMissionList] = useState<string[]>([]);
  const timeoutMap = useRef<TimeoutMap>({});
  const containerRef = useRef<View>();
  const missionRefMap = useRef<{ [uuid: string]: View }>({});
  const wasFocused = usePrevious(isFocused);

  const setItemTimeoutMap = useCallback((update: (timeoutMap) => TimeoutMap) => (timeoutMap.current = { ...update(timeoutMap.current) }), []);
  const setMissionItemRef = useCallback((uuid: string, ref: View) => (missionRefMap.current = { ...missionRefMap.current, [uuid]: ref }), []);
  const addToViewedMissionList = useCallback((update: string[]) => setViewedMissionList(prev => Array.from(new Set([...prev, ...update])).sort()), []);
  const removeViewedMission = useCallback((uuid: string) => setViewedMissionList(prev => prev.filter(key => key !== uuid)), []);
  const removeItemTimeout = useCallback((uuid: string) => setItemTimeoutMap(prev => removeKeyList(prev, [uuid])), [setItemTimeoutMap]);

  const checkViewableMission = useCallback(
    async (missionUuid: string) => {
      const containerMeasure = await asyncMeasureInWindow(containerRef.current);
      const itemMeasure = await asyncMeasureInWindow(missionRefMap.current[missionUuid]);
      /** It is visible and past the time threshold */
      if (!isViewableInsideContainer(itemMeasure, containerMeasure, visibilityThreshold)) return;
      addToViewedMissionList([missionUuid]);
      removeItemTimeout(missionUuid);
    },
    [removeItemTimeout, addToViewedMissionList, visibilityThreshold]
  );

  const checkAllViewableMissions = useCallback(async () => {
    const containerMeasure = await asyncMeasureInWindow(containerRef.current);
    await Promise.all(
      Object.entries(missionRefMap.current).map(async ([uuid, missionView]: [string, View]) => {
        const itemMeasure = await asyncMeasureInWindow(missionView);
        if (isViewableInsideContainer(itemMeasure, containerMeasure, visibilityThreshold) && !timeoutMap.current[uuid]) {
          /** It's visible but the time check is missing. */
          if (!viewedMissionList.includes(uuid)) {
            const timer = setTimeout(checkViewableMission, timeThreshold, uuid);
            setItemTimeoutMap(prev => ({ ...prev, [uuid]: timer }));
          }
          return;
        }

        /** It was confirmed but now it's no longer visible */
        if (viewedMissionList.includes(uuid)) removeViewedMission(uuid);

        /** It wasn't confirmed yet but now it's no longer visible */
        if (timeoutMap.current[uuid]) {
          clearTimeout(timeoutMap.current[uuid]);
          removeItemTimeout(uuid);
        }
      })
    );
  }, [visibilityThreshold, viewedMissionList, removeViewedMission, checkViewableMission, timeThreshold, setItemTimeoutMap, removeItemTimeout]);

  useEffect(() => {
    if (isFocused === wasFocused) return; // checkAllViewableMissions reference needs to be up to date. This line avoids a setState loop

    if (isFocused) {
      checkAllViewableMissions();
      return;
    }

    Object.values(timeoutMap.current).forEach(timer => clearTimeout(timer));
    setItemTimeoutMap(() => ({}));
    setViewedMissionList([]);
  }, [checkAllViewableMissions, isFocused, setItemTimeoutMap, wasFocused]);

  return useMemo(
    () => [viewedMissionList, checkAllViewableMissions, containerRef, setMissionItemRef],
    [viewedMissionList, checkAllViewableMissions, setMissionItemRef]
  );
};
