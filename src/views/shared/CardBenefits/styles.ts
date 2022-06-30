import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '../../../constants';

export const styles = {
  containerGeneral: css`
    flex-direction: column;
    justify-content: space-between;
    background-color: ${COLOR.WHITE};
    padding: 0;
  `,
  containerMain: css`
    padding: 20px 20px 0;
  `,
  containerTitle: css`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  containerLevel: css`
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  `,
  levelTitle: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.BIG};
  `,
  textTitle: css`
    color: ${COLOR.PRIMARY_LIGHT_BLUE};
    font-size: ${FONT_SIZE.TINY};
    text-transform: uppercase;
    margin-bottom: 8px;
  `,
  containerPoints: css`
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    margin: 8px 0;
  `,
  icon: css`
    background-color: ${COLOR.WHITE};
    width: 15px;
    height: 15px;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
  `,
  containerExplanation: css`
    padding: 8px 20px 0;
    flex-direction: row;
    min-height: 110px;
  `,
  graphSection: css`
    width: 40%;
  `,
  textSection: css`
    width: 60%;
    justify-content: flex-start;
    align-items: flex-start;
  `,
  containerDate: css`
    padding: 0 20px 20px;
  `,
  text: css`
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.DARK_GRAY};
    line-height: 26px;
  `,
  separator: css`
    border-bottom-color: ${COLOR.GRAY};
    border-bottom-width: 1px;
  `,
  levelOrange: css`
    color: ${COLOR.ORANGE};
  `,
  levelGreen: css`
    color: ${COLOR.GREEN};
  `,
  levelBlue: css`
    color: ${COLOR.PRIMARY_BLUE};
  `,
  levelBlack: css`
    color: ${COLOR.BLACK};
  `,
  levelGray: css`
    color: ${COLOR.DARK_GRAY};
  `,
  pillContainer: css`
    z-index: 1;
  `,
  expiredContainer: css`
    flex-direction: row;
  `
};
