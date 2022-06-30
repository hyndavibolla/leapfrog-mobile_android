import { css } from '@emotion/native';

import { FONT_FAMILY, FONT_SIZE, COLOR } from '../../../constants';

export const styles = {
  container: css`
    margin-top: 16px;
  `,
  item: css`
    margin-bottom: 16px;
  `,
  lastItem: css`
    margin-bottom: 8px;
  `,
  footNote: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.EXTRA_TINY};
    line-height: ${FONT_SIZE.PETITE};
    margin-top: 4px;
    text-align: right;
  `,
  fallback: css`
    margin-top: 16px;
  `,
  loading: css`
    margin-top: 36px;
  `
};
