import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../../../constants';

export const styles = {
  container: css`
    height: 125px;
    background-color: ${COLOR.MEDIUM_GRAY};
    padding: 28px 20px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
  `,
  dataContainer: css`
    width: 80%;
    padding-left: 20px;
  `,
  description: css`
    font-family: ${FONT_FAMILY.HEAVY}
    font-weight: bold;
    font-size: ${FONT_SIZE.SMALLER};
    line-height:  ${FONT_SIZE.BIG};
    color: ${COLOR.BLACK};
  `,
  note: css`
    font-family: ${FONT_FAMILY.MEDIUM}
    font-size: ${FONT_SIZE.PETITE};
    line-height:  ${FONT_SIZE.SMALL};
    color: ${COLOR.DARK_GRAY};
`
};
