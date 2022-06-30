import { css } from '@emotion/native';

import { COLOR, FONT_SIZE, FONT_FAMILY } from '_constants';

export const styles = {
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    flex: 1;
    position: relative;
    padding-top: 32px;
  `,
  emptyStateContainer: css`
    flex: 1;
    justify-content: space-around;
    padding: 28px;
  `,
  emptyStateMessageContainer: css`
    justify-self: center;
    align-items: center;
    padding: 28px;
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
  `,
  list: css`
    padding: 0px 20px 0px;
    align-self: center;
    width: 100%;
  `,
  itemContainer: css`
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 8px;
  `,
  itemIndividualContainer: css`
    width: 100%;
  `,
  listContainer: css`
    flex: 1;
  `,
  listContainerEnd: css`
    margin-bottom: 40px;
  `,
  itemSeparator: css`
    width: 30px;
    height: 30px;
  `,
  cardContainer: css`
    width: 100%;
  `,
  searchedText: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    margin-bottom: 20px;
  `,
  recentHistoryList: css`
    margin-bottom: 20px;
    margin-top: 0;
  `,
  footerContainer: css`
    margin-top: 24px;
  `,
  upButtonContainer: css`
    position: absolute;
    right: 15px;
    bottom: 30px;
  `,
  upButtonContent: css`
    width: 50px;
    height: 50px;
  `
};
