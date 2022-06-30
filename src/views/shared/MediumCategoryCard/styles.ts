import { css } from '@emotion/native';

import { COLOR, colorWithOpacity, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  defaultBoxStyle: css`
    border-radius: 8px;
    width: 100%;
    height: 100px;
  `,
  backgroundContainer: css`
    background-color: ${COLOR.PRIMARY_BLUE};
    overflow: hidden;
  `,
  container: css`
    flex: 1;
    align-items: stretch;
    justify-content: center;
    background-color: ${colorWithOpacity(COLOR.BLACK, 45)};
  `,
  title: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.SMALL};
    font-family: ${FONT_FAMILY.HEAVY};
    text-align: center;
    padding-horizontal: 20px;
  `
};
