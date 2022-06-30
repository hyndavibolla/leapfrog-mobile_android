import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '_constants';

export const styles = {
  content: css`
    border-color: ${COLOR.GRAY};
    border-width: 1px;
    border-radius: 8px;
    margin-top: 8px;
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    flex-direction: row;
    align-items: center;
    padding: 16px;
  `,
  completeContent: css`
    background-color: ${COLOR.LIGHT_GRAY};
  `,
  streakImageContainer: css`
    background-color: ${COLOR.GRAY};
    border-radius: 40px;
  `,
  streakImage: css`
    width: 40px;
    height: 40px;
  `,
  infoContainer: css`
    flex: 1;
    margin-left: 12px;
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALL};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  completeTitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.DARK_GRAY};
  `,
  completeSubtitle: css`
    font-family: ${FONT_FAMILY.MEDIUM};
  `,
  progressContainer: css`
    flex-direction: row;
    justify-content: space-between;
  `,
  footerContainer: css`
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-top: 20px;
  `,
  progressText: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${LINE_HEIGHT.SMALL};
  `,
  footerText: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
    font-family: ${FONT_FAMILY.HEAVY};
    margin-right: 8px;
  `,
  completeText: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  iconListContainer: css`
    flex-direction: row;
  `,
  icon: css`
    margin-right: 4px;
  `,
  progressTextWarn: css`
    color: ${COLOR.ORANGE};
  `,
  daysDiffContainer: css`
    justify-content: center;
  `
};
