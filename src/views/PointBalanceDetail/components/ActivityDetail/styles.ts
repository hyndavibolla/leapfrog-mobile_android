import { css } from '@emotion/native';
import { COLOR, FONT_SIZE, FONT_FAMILY } from '../../../../constants';

export const styles = {
  container: css`
    width: 100%;
  `,
  logoContainer: css`
    margin-bottom: 8px;
    align-items: center;
  `,
  activityName: css`
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.REGULAR};
    line-height: 30px;
    text-align: center;
  `,
  activityDescription: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: 26px;
    text-align: center;
  `,
  infoRow: css`
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-horizontal: 24px;
    padding-vertical: 4px;
  `,
  iconContainer: css`
    margin-right: 16px;
  `,
  dividerContainer: css`
    padding-vertical: 0;
  `,
  infoTitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.TINY};
    line-height: 18px;
  `,
  infoText: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
    line-height: 26px;
  `,
  containerPill: css`
    align-items: center;
  `,
  pill: css`
    margin-top: 8px;
    margin-bottom: 40px;
  `,
  pillLockedBG: css`
    font-size: ${FONT_SIZE.SMALL};
    background-color: ${COLOR.GRAY};
  `,
  pillActive: css`
    color: ${COLOR.PRIMARY_LIGHT_BLUE};
  `,
  stateLabel: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.EXTRA_TINY};
    color: ${COLOR.WHITE};
    line-height: 16px;
  `,
  stateContainer: css`
    align-self: flex-start;
    border-radius: 5px;
    padding: 4px 8px;
  `,
  returnedState: css`
    background-color: ${COLOR.ORANGE};
  `,
  pillStoreOffer: css`
    background-color: ${COLOR.SOFT_PURPLE};
    color: ${COLOR.BLACK};
  `,
  noPointsMargin: css`
    margin-bottom: 26px;
  `
};
