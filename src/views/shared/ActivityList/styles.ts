import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    flex-grow: 1;
    padding-horizontal: 16px;
  `,
  spinnerContainer: css`
    align-items: center;
    margin: 20px 0;
  `,
  spinnerText: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.PRIMARY_BLUE};
    margin-top: 16px;
  `,
  emptyStateContainer: css`
    flex: 1;
    align-items: center;
    justify-content: center;
  `,
  emptyStateTitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.BLACK};
    margin-top: 24px;
    text-align: center;
  `,
  emptyStateSubtitle: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.MEDIUM};
    color: ${COLOR.DARK_GRAY};
    margin-top: 16px;
    text-align: center;
  `,
  fallbackTransaction: css`
    padding: 34px 0;
  `,
  filterMargin: css`
    margin-top: 72px;
  `,
  firstSeparatorLabel: css`
    margin-top: 16px;
  `
};
