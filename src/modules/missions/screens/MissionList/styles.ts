import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    flex: 1;
  `,
  itemContainer: css`
    width: 100%;
  `,
  upButtonContainer: css`
    position: absolute;
    right: 15px;
    bottom: 30px;
  `,
  list: css`
    align-self: center;
    width: 100%;
  `,
  listContentContainer: css`
    padding-vertical: 8px;
  `,
  itemSeparator: css`
    margin-top: 16px;
  `,
  sectionHeader: css`
    color: ${COLOR.BLACK};
    margin-bottom: 8px;
    margin-top: 32px;
  `,
  containerSearchHistory: css`
    margin-top: 16px;
  `,
  containerSearchHistoryTop: css`
    margin-bottom: 16px;
  `,
  titleSearchHistory: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    color: ${COLOR.BLACK};
    margin-bottom: 4px;
  `,
  itemSearchHistory: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 16px;
  `,
  textSearchHistory: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    margin-left: 16px;
  `,
  footerSeparator: css`
    margin-top: 32px;
  `,
  horizontalMargin: css`
    margin-horizontal: 16px;
  `,
  categoryItem: css`
    margin-vertical: 8px;
    margin-horizontal: 16px;
  `
};
