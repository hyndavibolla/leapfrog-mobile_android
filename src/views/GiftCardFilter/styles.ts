import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    flex: 1;
    background-color: ${COLOR.LIGHT_GRAY};
    padding-top: 28px;
  `,
  headerContainer: css`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-horizontal: 16px;
  `,
  footerContainer: css`
    height: 100px;
    padding-horizontal: 32px;
    justify-content: center;
    background-color: ${COLOR.WHITE};
  `,
  title: css`
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.BLACK};
  `,
  clearText: css`
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.PRIMARY_BLUE};
  `,
  listContainer: css`
    flex: 1;
    margin-top: 20px;
  `,
  innerButton: css`
    padding: 16px 0;
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.HEAVY};
  `,
  listContent: css`
    padding-horizontal: 16px;
  `
};
