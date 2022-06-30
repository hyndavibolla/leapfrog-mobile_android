import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const NUMBER_SIZE = 20;

export const styles = {
  container: css`
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  value: css`
    height: ${String(NUMBER_SIZE)}px;
    color: ${COLOR.PRIMARY_LIGHT_BLUE};
    font-size: ${FONT_SIZE.PETITE};
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-weight: 700;
    text-align: center;
  `,
  numberContainer: css`
    height: ${String(NUMBER_SIZE)}px;
    overflow: hidden;
  `,
  numberInnerContainer: css`
    top: 0;
  `
};
