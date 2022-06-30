import { css } from '@emotion/native';

import { COLOR, FONT_SIZE, FONT_FAMILY } from '../../../constants';

export const styles = {
  emptyStateContainer: css`
    flex: 1;
    justify-content: center;
  `,
  emptyStateMessageContainer: css`
    justify-self: center;
    align-items: center;
    padding: 32px 20px;
  `,
  emptyStateTitle: css`
    margin-top: 32px;
    margin-bottom: 16px;
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.MEDIUM};
    text-align: center;
  `,
  emptyStateText: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    text-align: center;
    margin-top: 4px;
  `,
  emptyStateContainerHorizontal: css`
    height: 125px;
    background-color: ${COLOR.MEDIUM_GRAY};
    padding: 28px 20px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    border-radius: 8px;
  `,
  emptyStateMessageContainerHorizontal: css`
    width: 80%;
    padding-left: 20px;
  `,
  emptyStateTitleHorizontal: css`
    font-weight: bold;
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    color: ${COLOR.BLACK};
  `,
  emptyStateTextHorizontal: css`
    font-family: ${FONT_FAMILY.MEDIUM}
    font-size: ${FONT_SIZE.PETITE};
    line-height:  ${FONT_SIZE.SMALL};
    color: ${COLOR.DARK_GRAY};
  `
};
