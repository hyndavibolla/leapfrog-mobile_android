import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  card: css`
    justify-content: center;
    align-items: center;
    width: 104px;
    border-radius: 8px;
    background-color: white;
    padding: 8px;
    margin-bottom: 16px;
  `,
  logo: css`
    margin-bottom: 12px;
    margin-top: 4px;
  `,
  typePill: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.EXTRA_TINY};
    font-family: ${FONT_FAMILY.BOLD};
    line-height: ${FONT_SIZE.PETITE};
    margin-top: 4px;
    text-transform: uppercase;
  `
};
