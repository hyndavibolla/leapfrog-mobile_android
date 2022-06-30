import { css } from '@emotion/native';

import { COLOR, FONT_SIZE, FONT_FAMILY, LINE_HEIGHT } from '../../../constants';

export const styles = {
  container: css`
    background-color: ${COLOR.SOFT_PRIMARY_BLUE};
    padding-left: 4px;
    padding-right: 10px;
    border-radius: 20px;
    flex-direction: row;
    align-items: center;
  `,
  sizeContainerM: css`
    height: 28px;
  `,
  sizeContainerS: css`
    height: 24px;
  `,
  disabledContainer: css`
    background-color: ${COLOR.MEDIUM_GRAY};
  `,
  icon: css`
    background-color: ${COLOR.WHITE};
    align-items: center;
    justify-content: center;
    border-radius: 50px;
  `,
  points: css`
    padding-left: 4px;
  `,
  pointsText: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.PETITE};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  sizePointTextM: css`
    line-height: ${LINE_HEIGHT.REGULAR};
  `,
  sizePointTextS: css`
    line-height: ${LINE_HEIGHT.SMALL};
  `,
  disabledText: css`
    color: ${COLOR.DARK_GRAY};
  `,
  strikeThroughText: css`
    font-size: ${FONT_SIZE.TINY};
    font-family: ${FONT_FAMILY.THIN};
    text-decoration: line-through;
    padding-right: 12px;
  `
};
