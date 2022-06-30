import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '_constants';

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
    line-height: ${LINE_HEIGHT.BIG};
    font-family: ${FONT_FAMILY.BOLD};
    margin-horizontal: 20px;
  `,
  image: css`
    margin-top: 16px;
    width: 50%;
    aspect-ratio: 1;
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
    font-family: ${FONT_FAMILY.SEMIBOLD};
  `
};
