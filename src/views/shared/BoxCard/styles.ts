import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  itemBoxCard: css`
    max-width: 50%;
  `,
  itemBoxCardTitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.PETITE};
    color: ${COLOR.DARK_GRAY};
    line-height: ${FONT_SIZE.BIG};
  `,
  itemBoxCardValue: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.PETITE};
    color: ${COLOR.BLACK};
    line-height: 32px;
  `,
  itemBoxCardContent: css`
    flex-direction: row;
    justify-content: space-between;
  `,
  itemBoxCopyContent: css`
    width: 60px;
  `,
  itemBoxCopy: css`
    margin: 4px 0 0 16px;
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  itemBoxCopied: css`
    margin: 8px 0 0 12px;
  `
};
