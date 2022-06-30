import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../constants';

export const styles = {
  loadingContainer: css`
    flex: 1;
    align-items: center;
    justify-content: center;
  `,
  loadingTextContainer: css`
    margin-top: 8px;
  `,
  loadingText: css`
    text-align: center;
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
  `
};
