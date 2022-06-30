import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE, MEASURE } from '_constants';

export const styles = {
  container: css`
    padding-top: ${MEASURE.MODAL_PADDING}px;
    padding-horizontal: 16px;
    flex: 1;
  `,
  brandsContainer: css`
    margin-top: 24px;
  `,
  brandContainer: css`
    background-color: ${COLOR.WHITE};
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 8px;
    padding: 16px;
  `,
  brandLogo: css`
    margin-right: 16px;
  `,
  brandName: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.BLACK};
  `,
  emptyStateContainer: css`
    flex: 1;
    justify-content: space-around;
    padding: 32px;
  `,
  emptyStateMessageContainer: css`
    justify-self: center;
    align-items: center;
    padding: 32px;
  `,
  emptyStateTitle: css`
    margin-top: 20px;
    text-align: center;
  `,
  emptyStateText: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALL};
    text-align: center;
    margin-top: 20px;
  `
};
