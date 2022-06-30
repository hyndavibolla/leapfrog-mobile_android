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
    margin-bottom: 26px;
  `,
  title: css`
    text-align: center;
    color: ${COLOR.BLACK};
  `,
  body: css`
    margin-top: 10px;
  `,
  bodyText: css`
    text-align: center;
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.DARK_GRAY};
  `,
  list: css`
    margin-bottom: 20px;
  `,
  listItem: css`
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  listItemIcon: css`
    margin-right: 5px;
  `,
  plus: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.MEDIUM};
    line-height: ${FONT_SIZE.HUGE};
    font-family: ${FONT_FAMILY.HEAVY};
    margin: 0 14px;
  `,
  linkBtnInnerContainer: css`
    padding: 16px 120px;
    margin-top: 40px;
  `,
  linkBtnText: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
  `
};
