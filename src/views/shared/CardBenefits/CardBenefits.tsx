import React, { memo, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '../Text';
import { DateLike } from '../../../models/general';

import { styles } from './styles';
import { COLOR, FONT_FAMILY } from '../../../constants';
import { formatDateToDayAndMonth } from '../../../utils/formatDateToDayAndMonth';
import { getFormattedTimeDiff } from '../../../utils/getFormattedTimeDiff';
import { Card } from '../Card';
import { Divider } from '../Divider';
import { Pill } from '../Pill';
import { ProgressRing } from '../ProgressRing';
import { GameModel } from '../../../models';
import { formatNumber } from '../../../utils/formatNumber';
import { GlobalContext } from '../../../state-mgmt/GlobalState';
import { LogMethod } from '../../../services/Logger';

export interface Props {
  minimumPointsThreshold: number;
  maximumPointsThreshold: number | null;
  levelNumber?: number;
  userPoints?: number;
  reevaluationDate?: DateLike;
  subtype?: GameModel.LevelState;
  isECM?: boolean;
}

export const CardBenefits = ({
  minimumPointsThreshold,
  maximumPointsThreshold,
  levelNumber = 0,
  userPoints = 0,
  reevaluationDate = Date.now(),
  subtype = GameModel.LevelState.BASICLEVEL
}: Props) => {
  const { deps } = useContext(GlobalContext);

  const generalMap = useMemo(
    () => ({
      [GameModel.LevelState.BASICLEVEL]: {
        title: 'level 0',
        color: COLOR.PRIMARY_BLUE,
        unfilledColor: COLOR.GRAY,
        subtypeColor: styles.levelGray,
        icon: null
      },
      [GameModel.LevelState.SAFE]: {
        title: 'safezone',
        color: COLOR.PRIMARY_BLUE,
        unfilledColor: COLOR.GRAY,
        subtypeColor: styles.levelBlue,
        icon: null
      },
      [GameModel.LevelState.RELEGATION]: {
        title: 'relegation',
        color: COLOR.ORANGE,
        unfilledColor: COLOR.GRAY,
        subtypeColor: styles.levelOrange,
        icon: null
      },
      [GameModel.LevelState.PROMOTION]: {
        title: 'promotion',
        color: COLOR.GREEN,
        unfilledColor: COLOR.SOFT_GREEN,
        subtypeColor: styles.levelGreen,
        icon: '🎉'
      },
      [GameModel.LevelState.SPECIAL]: {
        title: 'special',
        color: COLOR.GREEN,
        unfilledColor: COLOR.SOFT_GREEN,
        subtypeColor: styles.levelGreen,
        icon: '🏁'
      },
      [GameModel.LevelState.OVERMAXPOINTS]: {
        title: 'overmaxpoints',
        color: COLOR.GRAY,
        unfilledColor: COLOR.GRAY,
        subtypeColor: styles.levelGray,
        icon: null
      }
    }),
    []
  );
  const formattedReevaluationDate = formatDateToDayAndMonth(reevaluationDate);
  const timeLeft = getFormattedTimeDiff(reevaluationDate, Date.now());

  const explanation = useMemo(
    () => ({
      [GameModel.LevelState.BASICLEVEL]: {
        subtitle: 'Promote and unlock benefits',
        text: (
          <Text>
            <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.levelBlack]}>
              Every point you earn helps you increase your level.
            </Text>
            <Text style={styles.text}> Higher levels have greater benefits.</Text>
          </Text>
        ),
        subtext: (
          <Text>
            <Text style={styles.text}>You have {timeLeft} until </Text>
            <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.levelBlack]}>
              {formattedReevaluationDate}!
            </Text>
          </Text>
        ),
        progressRingColor: COLOR.PRIMARY_BLUE,
        textColor: COLOR.PRIMARY_BLUE
      },
      [GameModel.LevelState.SAFE]: {
        subtitle: 'Secured Level',
        text: (
          <Text>
            <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.levelBlack]}>
              You earned enough points to secure your actual level.{' '}
            </Text>
            <Text style={styles.text}>Keep earning points to promote to level {levelNumber + 1}.</Text>
          </Text>
        ),
        subtext: (
          <Text>
            <Text style={styles.text}>You have {timeLeft} until </Text>
            <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.levelBlack]}>
              {formattedReevaluationDate}!
            </Text>
          </Text>
        ),
        progressRingColor: COLOR.PRIMARY_BLUE,
        textColor: COLOR.PRIMARY_BLUE
      },
      [GameModel.LevelState.RELEGATION]: {
        subtitle: 'keep it up!',
        text: (
          <Text>
            <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.levelBlack]}>
              {formatNumber(minimumPointsThreshold)} points are required to stay on level {levelNumber}.
            </Text>
            <Text style={styles.text}> Earn more points to keep your current level and benefits.</Text>
          </Text>
        ),
        subtext: (
          <Text>
            <Text style={styles.text}>If not reached, you'll level down on </Text>
            <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.levelBlack]}>
              {formattedReevaluationDate}.
            </Text>
          </Text>
        ),
        progressRingColor: COLOR.ORANGE,
        textColor: COLOR.ORANGE
      },
      [GameModel.LevelState.PROMOTION]: {
        subtitle: 'You’ve been promoted',
        text: (
          <Text>
            <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.levelBlack]}>
              You're now on level {levelNumber}! Your benefits have increased.
            </Text>
            <Text style={styles.text}>Keep earning your way to level {levelNumber + 1}</Text>
          </Text>
        ),
        subtext: (
          <Text>
            <Text style={styles.text}>You have {timeLeft} until </Text>
            <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.levelBlack]}>
              {formattedReevaluationDate}.
            </Text>
          </Text>
        ),
        progressRingColor: COLOR.GREEN,
        textColor: COLOR.GREEN
      },
      [GameModel.LevelState.SPECIAL]: {
        subtitle: 'You made it!',
        text: (
          <Text>
            <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.levelBlack]}>
              You made it to the ultimate level.{' '}
            </Text>
            <Text style={styles.text}>Congratulations! You’re the best.</Text>
          </Text>
        ),
        subtext: (
          <Text>
            <Text style={styles.text}>Points will reset on </Text>
            <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.levelBlack]}>
              {formattedReevaluationDate}.
            </Text>
          </Text>
        ),
        progressRingColor: COLOR.GREEN,
        textColor: COLOR.GREEN
      },
      [GameModel.LevelState.OVERMAXPOINTS]: {
        subtitle: 'Promote and unlock benefits',
        text: (
          <Text>
            <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.levelBlack]}>
              Every point you earn helps you increase your level.{' '}
            </Text>
            <Text style={styles.text}>Higher levels have greater benefits.</Text>
          </Text>
        ),
        subtext: (
          <Text>
            <Text style={styles.text}>You have {timeLeft} until </Text>
            <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.levelBlack]}>
              {formattedReevaluationDate}!
            </Text>
          </Text>
        ),
        progressRingColor: COLOR.GRAY,
        textColor: COLOR.PRIMARY_BLUE
      }
    }),
    [levelNumber, formattedReevaluationDate, timeLeft, minimumPointsThreshold]
  );
  const safeMaxThreshold = maximumPointsThreshold === null ? minimumPointsThreshold : maximumPointsThreshold;
  const min: string = `${maximumPointsThreshold === null ? '+ ' : ''}${formatNumber(minimumPointsThreshold)}`;
  const max: string = maximumPointsThreshold ? formatNumber(maximumPointsThreshold) : '';
  const rangeSeparator: string = maximumPointsThreshold ? '-' : '';
  const hasReevaluationPassed = !Math.max(0, new Date(reevaluationDate).getTime() - Date.now());
  const progress = Math.round(Math.min(Math.max((userPoints * 100) / safeMaxThreshold, 0), 100));
  const generalDataSet = generalMap[subtype];
  const explanationDataSet = explanation[subtype];

  const hasDataSetAvailable = !!generalDataSet && !!explanationDataSet;
  deps.logger.assert(LogMethod.WARN, !hasDataSetAvailable, `CardBenefits component found there is no data available to render the "${subtype}" subtype prop:`, {
    minimumPointsThreshold,
    maximumPointsThreshold,
    levelNumber,
    userPoints,
    reevaluationDate,
    subtype
  });
  if (!hasDataSetAvailable) return null;

  return (
    <Card style={styles.containerGeneral}>
      <View style={styles.containerMain}>
        <View style={styles.containerTitle}>
          <View style={styles.containerLevel}>
            <Text font={FONT_FAMILY.HEAVY} style={styles.levelTitle}>
              Level {levelNumber}
              {generalDataSet.icon}
            </Text>
            <Text font={FONT_FAMILY.BOLD} style={[styles.textTitle, generalDataSet.subtypeColor]}>
              {explanationDataSet.subtitle}
            </Text>
          </View>
          <Pill>{subtype === GameModel.LevelState.OVERMAXPOINTS ? '-' : `${min} ${rangeSeparator} ${max}`}</Pill>
        </View>
      </View>
      <View style={styles.containerExplanation}>
        <View style={[styles.textSection, generalDataSet.subtypeColor]}>{explanationDataSet.text}</View>
        <View style={styles.graphSection}>
          <ProgressRing
            width={130}
            strokeWidth={10}
            color={explanationDataSet.progressRingColor}
            textColor={explanationDataSet.textColor}
            progress={progress}
            label={subtype === GameModel.LevelState.OVERMAXPOINTS ? '-' : formatNumber(Math.min(userPoints, safeMaxThreshold))}
            sublabel={`OF ${formatNumber(safeMaxThreshold)}`}
          />
        </View>
      </View>
      <Divider />
      <View style={styles.containerDate}>
        {!hasReevaluationPassed ? (
          explanationDataSet.subtext
        ) : (
          <View style={styles.expiredContainer}>
            <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.levelBlack]}>
              Time's up.
            </Text>
            <Text style={styles.text}> Stay tuned, we'll have news soon.</Text>
          </View>
        )}
      </View>
    </Card>
  );
};

export default memo(CardBenefits);
