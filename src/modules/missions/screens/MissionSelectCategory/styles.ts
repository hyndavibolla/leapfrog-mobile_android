import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    padding-top: 20px;
    background-color: ${COLOR.LIGHT_GRAY};
    padding-horizontal: 16px;
    flex: 1;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  `,
  categoryContainer: css`
    flex-direction: column;
    justify-content: center;
  `,
  categoryItem: css`
    padding-vertical: 4px;
  `,
  headerContainer: css`
    padding-top: 8px;
    flex-direction: row;
    justify-content: space-between;
  `,
  clearBtn: css`
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.PRIMARY_BLUE};
    margin-bottom: 16px;
  `,
  headerTitle: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALL};
  `,
  footerContainer: css`
    padding: 20px 32px;
    align-items: center;
  `,
  innerButton: css`
    height: 50px;
    width: 295px;
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.HEAVY};
  `,
  scrollViewContent: css`
    padding-bottom: 16px;
  `
};
