import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../constants';

export const styles = {
  container: css`
    text-align: center;
    padding: 0 40px 48px;
    background-color: ${COLOR.LIGHT_GRAY};
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.MEDIUM};
    text-align: center;
    margin-top: 32px;
    line-height: 30px;
  `,
  firstQuestion: css`
    margin-top: 48px;
  `,
  question: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.BLACK};
    line-height: ${FONT_SIZE.REGULAR};
    margin-top: 32px;
  `,
  answer: css`
    margin-top: 8px;
    font-family: ${FONT_FAMILY.MEDIUM};
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
  `,
  link: css`
    color: ${COLOR.PRIMARY_LIGHT_BLUE};
  `
};
