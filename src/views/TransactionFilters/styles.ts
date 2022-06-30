import { css } from '@emotion/native';

import { COLOR, FONT_SIZE, LINE_HEIGHT } from '_constants';

export const styles = {
  container: css`
    flex: 1;
    background-color: ${COLOR.LIGHT_GRAY};
  `,
  allOffers: css`
    padding-left: 8px;
  `,
  pillContainer: css`
    height: 30px;
    margin-right: 8px;
    background-color: ${COLOR.WHITE};
  `,
  pillActivated: css`
    background-color: ${COLOR.PRIMARY_BLUE};
  `,
  fallbackContainer: css`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${COLOR.LIGHT_GRAY};
  `,
  filtersMargin: css`
    margin-bottom: 4px;
    margin-top: 28px;
  `,
  textPill: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${LINE_HEIGHT.SMALL};
    font-weight: 600;
  `,
  textPillActivated: css`
    color: ${COLOR.WHITE};
  `
};
