import React, { memo, useCallback, useState, useEffect, useContext, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { View as AnimatedView } from 'react-native-animatable';

import { Text } from '_components/Text';
import { Button } from '_components/Button';
import { ActivityItem } from '_components/ActivityItem/ActivityItem';
import { BrandLogo } from '_components/BrandLogo';
import { Icon } from '_commons/components/atoms/Icon';
import { useTestingHelper } from '_utils/useTestingHelper';
import { ActivityModel } from '_models';
import { COLOR, ENV, FONT_SIZE, ICON } from '_constants';
import { wait } from '_utils/wait';
import { GlobalContext } from '_state_mgmt/GlobalState';

import { styles } from './styles';

export interface Props {
  activityList: ActivityModel.IActivity[];
  showAnimation: boolean;
  onRequestClose?: () => void;
}

export const ClaimPointsModal = ({ activityList, onRequestClose, showAnimation }: Props) => {
  const { getTestIdProps } = useTestingHelper('claim-points');
  const { deps } = useContext(GlobalContext);
  const [closeWasRequested, setCloseWasRequested] = useState<boolean>(false);
  const fullAnimationDuration = ENV.ANIMATION.EARN_POINTS;
  const height = deps.nativeHelperService.dimensions.getWindowHeight();
  const animatedItemCount = 3;

  useEffect(() => {
    if (!closeWasRequested) return;
    (async () => {
      await wait(fullAnimationDuration);
      onRequestClose();
    })();
  }, [closeWasRequested, onRequestClose, fullAnimationDuration]);

  const animation = useMemo(
    () => ({
      0: { height: 70, width: 70, opacity: 0, bottom: 150 },
      0.1: { height: 70, width: 70, opacity: 0, bottom: 150 },
      0.4: { height: 70, width: 70, opacity: 1, bottom: 150 },
      1: { height: 20, width: 20, opacity: 0, bottom: height }
    }),
    [height]
  );

  const onClose = useCallback(async () => {
    setCloseWasRequested(true);
  }, []);

  const offerList = activityList.map(activity => activity.offers.map(offer => ({ activity, offer })));
  const brandLogoList = Array.from(new Set(activityList.map(a => a.brandDetails?.brandLogo)));
  const categoryList = Array.from(
    new Set(activityList.map(a => a.offers.map(o => o.programSubCategory || o.programType)).reduce((total, c) => [...total, ...c], []))
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {brandLogoList.length === 1 && categoryList.length === 1 ? (
          <BrandLogo image={brandLogoList[0]} category={categoryList[0]} activityType={activityList[0]?.activityType} style={styles.icon} size={60} />
        ) : (
          <Icon name={ICON.SYW_CIRCLE} size={FONT_SIZE.XL} color={COLOR.PRIMARY_LIGHT_BLUE} style={styles.icon} />
        )}

        <Text style={styles.label}>You've earned points! </Text>
        <View style={styles.activityList} {...getTestIdProps('activity-list')}>
          {offerList
            .reduce((total, curr) => [...total, ...curr], [])
            .map(({ activity, offer }, index) => (
              <ActivityItem key={index} activity={activity} offer={offer} />
            ))}
        </View>
      </ScrollView>
      {!closeWasRequested || !showAnimation
        ? null
        : Array(animatedItemCount)
            .fill(null)
            .map((_, index) => (
              <AnimatedView
                key={index}
                animation={animation}
                style={styles.animationContainer}
                duration={fullAnimationDuration / animatedItemCount}
                delay={(fullAnimationDuration / animatedItemCount) * index}
              >
                <Icon name={ICON.SYW_CIRCLE} size={FONT_SIZE.BIGGER} color={COLOR.PRIMARY_LIGHT_BLUE} style={styles.movingIcon} />
              </AnimatedView>
            ))}
      <View style={styles.footer}>
        <Button innerContainerStyle={styles.button} textStyle={styles.buttonText} onPress={onClose} {...getTestIdProps('continue-btn')}>
          Continue
        </Button>
      </View>
    </View>
  );
};

export default memo(ClaimPointsModal);
