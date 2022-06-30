import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

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
  title: css`
    text-align: center;
    color: ${COLOR.BLACK};
  `,
  body: css`
    margin-top: 20px;
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
    min-width: 90%;
    height: 50px;
    margin-top: 44px;
  `,
  linkBtnText: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    width: 100%;
  `
};
