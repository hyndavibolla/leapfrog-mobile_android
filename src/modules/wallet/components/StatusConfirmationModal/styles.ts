import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  modal: css`
    padding: 0px;
    padding-bottom: 32px;
  `,
  content: css`
    flex: 1;
    align-items: center;
    background-color: ${COLOR.WHITE};
    border-radius: 15px;
    width: 100%;
  `,
  title: css`
    text-align: center;
    font-size: ${FONT_SIZE.REGULAR};
    color: ${COLOR.BLACK};
    margin-top: 28px;
    margin-horizontal: 20px;
  `,
  iconContainer: css`
    height: 60px;
    width: 60px;
    border-radius: 30px;
    background-color: ${COLOR.DARK_GRAY};
    justify-content: center;
    align-items: center;
    margin-top: 60px;
  `,
  buttonContainer: css`
    width: 100%;
    padding-horizontal: 40px;
    margin-top: 28px;
  `,
  buttonContainerTransparent: css`
    margin-top: 16px;
  `,
  button: css`
    padding: 16px 0;
    width: 100%;
  `,
  buttonTransparent: css`
    background-color: ${COLOR.TRANSPARENT};
  `,
  buttonText: css`
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  indicatorContainer: css`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  `,
  indicator: css`
    height: 20px;
    width: 20px;
  `,
  loadingText: css`
    margin-left: 8px;
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
    font-family: ${FONT_FAMILY.HEAVY};
  `
};
