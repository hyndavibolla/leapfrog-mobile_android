import { css } from '@emotion/native';

import { COLOR, FONT_SIZE, FONT_FAMILY } from '../../../constants';

export const styles = {
  container: css`
    width: 100%;
    background-color: ${COLOR.WHITE};
    border-radius: 4px;
  `,
  error: css`
    border: 1px ${COLOR.RED} solid;
  `,
  errorText: css`
    padding-top: 4px;
    padding-horizontal: 8px;
    color: ${COLOR.RED};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.TINY};
  `
};
