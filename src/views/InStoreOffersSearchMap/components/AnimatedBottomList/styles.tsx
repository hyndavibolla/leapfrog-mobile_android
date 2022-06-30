import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../../constants';

export const styles = {
  animatedContainer: css`
    position: absolute;
    bottom: 0;
    width: 100%;
    min-height: 280px;
    background-color: ${COLOR.TRANSPARENT};
    flex-direction: column;
    flex: 1;
  `,
  touchContainer: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  sectionContainer: css`
    flex-direction: column;
    flex: 1;
  `,
  offerContainer: css`
    flex: 1;
    background-color: ${COLOR.LIGHT_GRAY};
    justify-content: center;
    align-items: center;
  `,
  handle: css`
    width: 40px;
    height: 8px;
    margin-bottom: 8px;
    background-color: ${COLOR.BLACK};
    opacity: 0.2;
    border-radius: 5px;
  `,
  headerContainer: css`
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    background-color: ${COLOR.LIGHT_GRAY};
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px 0px;
    shadow-opacity: 0.4;
    shadow-radius: 6px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 16px 16px 8px;
  `,
  title: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
    font-weight: bold;
    color: ${COLOR.BLACK};
  `,
  note: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.REGULAR};
    color: ${COLOR.DARK_GRAY};
  `
};
