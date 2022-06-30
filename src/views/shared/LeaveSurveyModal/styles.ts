import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    align-items: center;
  `,
  swyLogo: css`
    width: 65px;
    height: 65px;
    margin-bottom: 16px;
  `,
  title: css`
    text-align: center;
    margin-bottom: 32px;
  `,
  message: css`
    text-align: center;
    margin-bottom: 32px;
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
  `,
  updateBtnInnerContainer: css`
    padding: 16px 32px;
  `,
  updateBtnText: css`
    font-family: ${FONT_FAMILY.HEAVY};
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
