import React, { memo, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Platform } from 'react-native';

import { ENV } from '_constants';
import { MissionModel } from '_models';
import { ButtonCreativeType, FeatureFlag } from '_models/general';
import { CPAMissionCard } from '_modules/missions/components/CPAMissionCard';
import { MediumMissionCard } from '_modules/missions/components/MediumMissionCard';
import ErrorBoundary from '_components/ErrorBoundary';
import { shouldShowFeature } from '_components/Flagged';
import { ImpressionView } from '_components/ImpressionView';
import { LargeMissionCard } from '_components/LargeMissionCard';
import { PetiteMissionCard } from '_components/PetiteMissionCard';
import { Orientation, SmallMissionCard } from '_components/SmallMissionCard';
import { LogMethod } from '_services/Logger';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { actions as missionActions } from '_state_mgmt/mission/actions';
import { getVisibleRateForButton } from '_utils/getVisibleRateForButton';

import { styles } from './styles';

export interface Props {
  missionCardComponent: typeof PetiteMissionCard | typeof SmallMissionCard | typeof MediumMissionCard | typeof LargeMissionCard | typeof CPAMissionCard;
  mission: MissionModel.IMission;
  fullSize?: boolean;
  orientation?: Orientation;
  wasViewed: boolean;
  creativeType: ButtonCreativeType;
  streakIndicator: boolean;
  hasStreakTag?: boolean;
  onPress?: (mission?: MissionModel.IMission, isAvailableStreakIndicator?: boolean) => void;
}

export const MissionImpressionView = ({
  missionCardComponent: MissionCard,
  mission,
  fullSize,
  orientation,
  onPress,
  wasViewed,
  creativeType,
  streakIndicator,
  hasStreakTag
}: Props) => {
  const { state, deps, dispatch } = useContext(GlobalContext);
  const impressionRef = useRef<ImpressionView>();
  const visibleRate = getVisibleRateForButton(mission.pointsAwarded, state.game.current.missions.pointsPerCent);

  useEffect(() => {
    if (!state.mission.isButtonInit && state.mission.buttonUserId) {
      const { buttonAppId } = deps.nativeHelperService.platform.select({
        ios: { buttonAppId: ENV.BUTTON.APP_ID_IOS },
        android: { buttonAppId: ENV.BUTTON.APP_ID_ANDROID },
        default: { buttonAppId: null }
      });
      deps.nativeHelperService.buttonSdk.configure(buttonAppId, shouldShowFeature(FeatureFlag.BUTTON_DEBUG));
      // TODO: Check if this is compliant with App Transparency

      deps.nativeHelperService.buttonSdk.setUserId(state.mission.buttonUserId);
      deps.logger.debug('Set Button User Id', state.mission.buttonUserId);
      dispatch(missionActions.setIsButtonInit(true));
    }
  }, [deps.nativeHelperService.platform, deps.nativeHelperService.buttonSdk, dispatch, state.mission.isButtonInit, state.mission.buttonUserId, deps.logger]);

  useEffect(() => {
    if (wasViewed) {
      deps.logger.assert(
        LogMethod.WARN,
        !Object.values(MissionModel.RedemptionType).includes(mission?.pointsAwarded?.rewardType),
        `Invalid rewardType value: ${mission?.pointsAwarded?.rewardType} for offer: ${mission?.offerId}`
      );

      impressionRef?.current?.configureWithDetails(
        mission.callToActionUrl,
        mission.offerId,
        visibleRate,
        mission.pointsAwarded.rewardType === MissionModel.RedemptionType.FIXED_POINTS,
        creativeType
      );
    }
  }, [wasViewed, impressionRef, mission, creativeType, visibleRate, deps.logger]);

  const onPressOnCard = useCallback(() => onPress(mission, streakIndicator), [onPress, mission, streakIndicator]);

  const missionCard = useMemo(
    () => (
      <View style={Platform.OS === 'ios' && styles.container}>
        <MissionCard
          streakIndicator={streakIndicator}
          mission={mission}
          image={mission.brandLogo}
          category={mission.pointsAwarded.conditions[0]?.category}
          onPress={onPressOnCard}
          fullSize={fullSize}
          orientation={orientation}
          hasStreakTag={hasStreakTag}
        />
      </View>
    ),
    [mission, fullSize, onPressOnCard, orientation, MissionCard, streakIndicator, hasStreakTag]
  );

  if (!state.mission.isButtonInit) return null;

  return deps.nativeHelperService.platform.select({
    ios: (
      <ErrorBoundary>
        <ImpressionView ref={impressionRef}>{missionCard}</ImpressionView>
      </ErrorBoundary>
    ),
    android: (
      <ErrorBoundary>
        <ImpressionView ref={impressionRef}>{missionCard}</ImpressionView>
      </ErrorBoundary>
    ),
    default: missionCard
  });
};

export default memo(MissionImpressionView);
