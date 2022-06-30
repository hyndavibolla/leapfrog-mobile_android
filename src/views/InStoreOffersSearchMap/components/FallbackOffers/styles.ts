import { css } from '@emotion/native';

import { FONT_FAMILY, FONT_SIZE } from '../../../../constants/styles';
import { COLOR } from '../../../../constants';

export const styles = {
  container: css`
    justify-content: center;
    align-items: center;
    height: 100%;
    padding-horizontal: 24px;
  `,
  description: css`
    margin-top: 24px;
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
    color: ${COLOR.BLACK};
    text-align: center;
  `,
  note: css`
    margin-top: 16px;
    font-family: ${FONT_FAMILY.MEDIUM}
    font-size: ${FONT_SIZE.PETITE};
    line-height:  ${FONT_SIZE.SMALL};
    text-align: center;
    color: ${COLOR.DARK_GRAY};
  `
};
