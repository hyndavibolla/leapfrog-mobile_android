import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../constants';

export const styles = {
  container: css`
    padding: 0 40px 52px;
    background-color: ${COLOR.LIGHT_GRAY};
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.MEDIUM};
    text-align: center;
    margin-top: 32px;
  `,
  footerTextEmphasis: css`
    color: ${COLOR.PRIMARY_BLUE};
  `,
  section: css`
    margin-top: 32px;
  `,
  subtitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.BLACK};
    line-height: ${FONT_SIZE.REGULAR};
    margin-top: 16px;
  `,
  paragraph: css`
    margin-top: 8px;
    font-family: ${FONT_FAMILY.MEDIUM};
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
  `,
  arrowContainer: css`
    background-color: ${COLOR.ORANGE};
    width: 18px;
    height: 18px;
    border-radius: 18px;
    justify-content: center;
    align-items: center;
  `,
  lockContainer: css`
    opacity: 0.8;
  `
};
