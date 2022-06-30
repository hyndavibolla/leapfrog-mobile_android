import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  pointsContainer: css`
    flex: 0 1 auto;
  `,
  points: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.SMALL};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-weight: 500;
  `,
  pillContainer: css`
    background-color: ${COLOR.BLUE_NAVIGATION};
    color: ${COLOR.WHITE};
    padding: 0 8px;
    height: 40px;
  `,
  iconBackground: css`
    height: ${FONT_SIZE.BIG};
    width: ${FONT_SIZE.BIG};
    border-radius: ${FONT_SIZE.REGULAR};
    background-color: ${COLOR.PRIMARY_BLUE};
  `
};
