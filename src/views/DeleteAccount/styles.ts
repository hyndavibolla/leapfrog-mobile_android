import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    height: 100%;
    padding: 0 40px;
    flex: 1;
    justify-content: center;
    align-items: center;
  `,
  deleteIcon: css`
    width: 48px;
    height: 48px;
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.MEDIUM};
    text-align: center;
    margin-top: 16px;
  `,
  textContent: css`
    margin-top: 8px;
    font-family: ${FONT_FAMILY.MEDIUM};
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    text-align: center;
  `,
  email: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.BLACK};
    line-height: ${FONT_SIZE.REGULAR};
    margin-top: 32px;
    text-align: center;
  `,
  link: css`
    margin-top: 16px;
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: 22px;
    color: ${COLOR.PRIMARY_BLUE};
    text-align: center;
    margin-bottom: 16px;
  `
};
