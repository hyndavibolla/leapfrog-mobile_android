import { css } from '@emotion/native';

import { FONT_SIZE, LINE_HEIGHT, FONT_FAMILY, COLOR } from '_constants';

export const styles = {
  container: css`
    padding: 16px;
    border-radius: 8px;
    align-items: center;
    justify-content: center
    margin-horizontal: 16px;
    margin-bottom: 32px;
    background-color: ${COLOR.PRIMARY_BLUE};
  `,
  title: css`
    font-size: ${FONT_SIZE.HUGER};
    line-height: ${LINE_HEIGHT.HUGE};
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.WHITE};
    width: 100%;
    margin-bottom: 4px;
  `,
  subtitle: css`
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${LINE_HEIGHT.REGULAR};
    font-family: ${FONT_FAMILY.SEMIBOLD};
    color: ${COLOR.WHITE};
    width: 100%;
    margin-top: 104px;
  `,
  animationTitle: css`
    font-size: ${FONT_SIZE.REGULAR};
    line-height: ${LINE_HEIGHT.BIG};
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.WHITE};
    text-align: left;
    align-self: flex-start;
    width: 50%;
  `,
  animationContainer: css`
    width: 100%;
    justify-content: space-between;
    align-self: flex-start;
    margin-vertical: 20px;
  `,
  logo: css`
    margin-top: 8px;
  `,
  animation: css`
    width: 100%;
    height: 100%;
  `,
  bottomContainer: css`
    flex-direction: row;
    width: 100%;
    margin-top: 20px;
    align-items: center;
    justify-content: space-between;
  `,
  button: css`
    padding: 12px 0px;
    width: 90%;
    background-color: ${COLOR.WHITE};
  `,
  buttonRight: css`
    align-self: flex-end;
  `,
  buttonTransparent: css`
    background-color: ${COLOR.TRANSPARENT};
    width: auto;
    padding: 12px 8px;
  `,
  buttonText: css`
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.PRIMARY_BLUE};
  `,
  buttonShow: css`
    margin-right: 8px;
  `,
  buttonContent: css`
    flex-direction: row;
    align-items: center;
    justify-content: center;
  `,
  arrow: css`
    margin-left: 8px;
  `,
  lottieContainer: css`
    width: 50%;
    height: 100%;
    position: absolute;
    right: 0px;
    top: -16px;
    align-items: center;
    justify-content: center;
  `,
  topContainer: css`
    width: 100%;
    height: auto;
  `
};
