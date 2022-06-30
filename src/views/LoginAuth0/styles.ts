import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../constants';

export const styles = {
  spinnerContainer: css`
    flex: 1;
    justify-content: center;
  `,
  loginContainer: css`
    flex-direction: row;
    height: 100%;
  `,
  loginContent: css`
    justify-content: center;
    width: 100%;
    background-color: ${COLOR.LIGHT_GRAY};
    padding-horizontal: 32px;
    border: 1px solid black;
  `,
  loginAlignmentContainer: css`
    justify-content: flex-start;
    padding-top: 12px;
  `,
  loginTitle: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.REGULAR};
    text-align: center;
  `,
  loginText: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.DARK_GRAY};
    text-align: center;
    line-height: ${FONT_SIZE.MEDIUM};
  `,
  buttonContainer: css`
    margin-top: 20px;
    margin-bottom: 40px;
  `,
  innerButtonContainer: css`
    padding: 16px;
    color: ${COLOR.PRIMARY_BLUE};
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    font-weight: 700;
  `,
  registerText: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    text-align: center;
    margin: 20px 10px 0 20px;
  `,
  toastTitle: css`
    font-size: ${FONT_SIZE.SMALLER};
  `,
  toastDescription: css`
    font-size: ${FONT_SIZE.TINY};
  `
};
