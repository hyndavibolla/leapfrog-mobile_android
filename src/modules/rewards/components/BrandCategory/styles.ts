import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '_constants';

export const styles = {
  sectionContainer: css`
    margin-top: 20px;
    margin-bottom: 8px;
  `,
  sectionHeader: css`
    padding-horizontal: 16px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  sectionTitle: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALLER}
    line-height: ${FONT_SIZE.REGULAR};
  `,
  link: css`
    color: ${COLOR.PRIMARY_BLUE};
  `,
  list: css`
    padding-vertical: 4px;
  `,
  listContainer: css`
    margin-left: 24px;
  `
};
