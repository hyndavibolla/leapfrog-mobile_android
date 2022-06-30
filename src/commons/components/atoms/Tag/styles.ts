import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    border-color: ${COLOR.PRIMARY_BLUE};
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
  `,
  text: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.PETITE};
    padding-horizontal: 4px;
  `
};
