import { css } from '@emotion/native';

import { FONT_SIZE, LINE_HEIGHT, FONT_FAMILY } from '_constants';

export const styles = {
  ctaButtonContainer: css`
    flex-direction: row;
    padding: 4px 12px;
    border-radius: 30px;
    margin-right: auto;
    align-items: center;
  `,
  ctaButtonContent: css`
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${LINE_HEIGHT.REGULAR};
    font-family: ${FONT_FAMILY.BOLD};
    margin-right: 8px;
  `
};
