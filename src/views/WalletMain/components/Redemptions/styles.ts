import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    flex: 1;
  `,
  sywCardContainer: css`
    margin-top: 32px;
    margin-horizontal: 16px;
  `,
  lightDescriptionText: css`
    font-size: ${FONT_SIZE.TINY};
    line-height: ${FONT_SIZE.PETITE};
    color: ${COLOR.DARK_GRAY};
    margin-top: 16px;
    margin-bottom: 20px;
  `
};
