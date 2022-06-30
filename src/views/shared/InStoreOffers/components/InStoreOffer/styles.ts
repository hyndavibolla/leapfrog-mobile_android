import { css } from '@emotion/native';

import { FONT_FAMILY, FONT_SIZE, COLOR } from '../../../../../constants';

export const styles = {
  container: css`
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    height: 95px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
  `,
  informationContainer: css`
    flex-direction: row;
    align-items: center;
    width: 60%;
  `,
  dataContainer: css`
    margin-left: 10px;
    flex: 1;
  `,
  title: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    color: ${COLOR.BLACK};
  `,
  pill: css`
    align-self: flex-start;
  `,
  buttonContainer: css`
    align-items: flex-end;
    width: 40%;
  `,
  button: css`
    background-color: ${COLOR.PURPLE};
    border-radius: 20px;
    height: 40px;
    align-items: center;
    justify-content: center;
    width: 105px;
  `,
  buttonActivated: css`
    background-color: ${COLOR.TRANSPARENT};
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 40px;
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.REGULAR};
    color: ${COLOR.WHITE};
  `,
  buttonTextActivated: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.REGULAR};
    color: ${COLOR.PURPLE};
    margin-left: 5px;
  `
};
