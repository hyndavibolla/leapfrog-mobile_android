import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    align-items: center;
  `,
  header: css`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;
  `,
  brandIcon: css`
    min-width: 60px;
    min-height: 60px;
  `,
  title: css`
    text-align: center;
    color: ${COLOR.BLACK};
  `,
  body: css`
    margin-top: 8px;
  `,
  bodyText: css`
    text-align: center;
    font-size: ${FONT_SIZE.SMALLER};
  `,
  plus: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.MEDIUM};
    line-height: ${FONT_SIZE.HUGE};
    font-family: ${FONT_FAMILY.HEAVY};
    margin: 0 12px;
  `,
  linkBtnInnerContainer: css`
    padding: 16px 100px;
    margin-top: 40px;
  `,
  linkBtnText: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  dismissBtnInnerContainer: css`
    margin-top: 16px;
    background-color: transparent;
  `,
  dismissBtnText: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
  `
};
