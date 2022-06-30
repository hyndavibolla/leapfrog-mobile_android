import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 16px;
  `,
  detail: css`
    flex: 1;
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALL};
    margin-bottom: 4px;
    flex-shrink: 4;
  `,
  subTitle: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
    text-transform: uppercase;
  `
};
