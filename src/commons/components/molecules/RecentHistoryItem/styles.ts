import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  itemSearchHistory: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 16px;
  `,
  textSearchHistory: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    margin-left: 16px;
  `
};
