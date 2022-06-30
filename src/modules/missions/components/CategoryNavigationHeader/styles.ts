import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE, colorWithOpacity } from '_constants';

export const styles = {
  shadow: css`
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.1;
    elevation: 3;
  `,
  body: css`
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  `,
  closeBtn: css`
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
  `,
  container: css`
    flex-direction: row;
    padding-horizontal: 20px;
  `,
  safeArea: css`
    background-color: ${colorWithOpacity(COLOR.BLACK, 35)};
    height: 100%;
    justify-content: center;
  `,
  backgroundContainer: css`
    background-color: ${COLOR.WHITE};
    height: 108px;
    overflow: hidden;
  `,
  title: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.REGULAR};
    font-family: ${FONT_FAMILY.HEAVY};
    text-align: center;
    justify-content: center;
  `,
  searchBarContainer: css`
    flex-grow: 2;
    padding-left: 16px;
  `
};
