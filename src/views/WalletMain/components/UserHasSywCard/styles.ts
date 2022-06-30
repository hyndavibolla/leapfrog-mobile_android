import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  title: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.BLACK};
    line-height: ${FONT_SIZE.BIG};
  `,
  card: css`
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    min-height: 68px;
    padding: 16px;
    flex-direction: row;
    align-items: center;
    margin-top: 12px;
    margin-bottom: 16px;
  `,
  cardTitle: css`
    flex: 1;
    margin-left: 16px;
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.SMALL};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  image: css`
    height: 28px;
    width: 48px;
    border-radius: 4px;
  `
};
