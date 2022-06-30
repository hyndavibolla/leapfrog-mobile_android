import { css } from '@emotion/native';

import { FONT_FAMILY } from '_constants/styles';
import { COLOR, FONT_SIZE } from '_constants';

export const styles = {
  emptyStateContainer: css`
    flex: 1;
  `,
  emptyStateHeader: css`
    width: 100%;
    height: 200px;
  `,
  emptyStateHeaderContent: css`
    align-items: flex-end;
    padding: 16px;
  `,
  emptyStateBody: css`
    align-items: center;
    justify-content: center;
    padding: 32px;
    flex: 1;
    margin-top: -30%; // design's position is arbitrary
  `,
  iconBackground: css`
    background-color: ${COLOR.SOFT_PRIMARY_BLUE};
    align-items: flex-end;
  `,
  iconInnerBackground: css`
    background-color: ${COLOR.WHITE};
    border-radius: ${FONT_SIZE.XXL};
  `,
  emptyStateTitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.MEDIUM};
    color: ${COLOR.BLACK};
    margin-top: 36px;
    text-align: center;
  `,
  emptyStateSubtitle: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.DARK_GRAY};
    margin-top: 8px;
    text-align: center;
  `
};
