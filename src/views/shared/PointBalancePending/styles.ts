import { css } from '@emotion/native';

import { COLOR, colorWithOpacity, FONT_FAMILY, FONT_SIZE } from '../../../constants/styles';

export const styles = {
  container: css`
    flex-direction: row;
    align-items: center;
    background-color: ${COLOR.WHITE};
  `,
  boldText: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  text: css`
    flex: 1;
    color: ${colorWithOpacity(COLOR.BLACK, 45)};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.BIG};
    margin: 8px 16px;
  `,
  clock: css`
    height: 47px;
    width: 47px;
  `
};
