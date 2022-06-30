import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants/styles';

export const styles = {
  barcodeModalBarcodeContainer: css`
    margin-top: 24px;
  `,
  barcodeModalNumberContainer: css`
    margin-top: 16px;
  `,
  barcodeModalNumber: css`
    font-size: ${FONT_SIZE.TINY};
    font-family: ${FONT_FAMILY.MEDIUM};
    color: ${COLOR.DARK_GRAY};
    line-height: 16px;
    text-align: center;
  `,
  subtitle: css`
    margin-top: 36px;
  `
};
