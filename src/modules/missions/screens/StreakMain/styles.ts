import { css } from '@emotion/native';

import { COLOR, colorWithOpacity, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    flex: 1;
  `,
  contentContainer: css`
    padding: 80px 16px 4px 16px;
  `,
  listContainer: css`
    margin-top: 20px;
  `,
  creditCardContainer: css`
    margin-top: 28px;
  `,
  columnContainer: css`
    flex-direction: column;
  `,
  columnItemContainer: css`
    margin-bottom: 21px;
  `,
  itemSeparator: css`
    width: 20px;
    height: 5px;
  `,
  listTitleContainer: css`
    margin-top: 28px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  searchTitle: css`
    color: ${COLOR.PRIMARY_BLUE};
  `,
  missionErrorContainer: css`
    align-items: center;
    padding-horizontal: 40px;
    padding-vertical: 20px;
  `,
  iconBackground: css`
    background-color: ${COLOR.SOFT_RED};
    align-items: flex-end;
  `,
  iconInnerBackground: css`
    background-color: ${COLOR.WHITE};
    border-radius: ${FONT_SIZE.XXL};
  `,
  missionErrorTitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.BLACK};
    margin-top: 21px;
    margin-bottom: 16px;
  `,
  missionErrorSubtitle: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${colorWithOpacity(COLOR.BLACK, 45)};
    text-align: center;
    line-height: ${FONT_SIZE.HUGE};
  `,
  cp: css`
    margin-bottom: 30px;
  `,
  cpTitle: css`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  `,
  cpProgressText: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.MEDIUM};
  `,
  cpMonth: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.TINY};
    text-transform: uppercase;
    margin-bottom: 10px;
  `,
  cpErrorContainer: css`
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  `,
  cpErrorTitles: css`
    flex: 1;
    margin-left: 10px;
  `,
  cpErrorTitle: css`
    font-family: ${FONT_FAMILY.BOLD};
  `,
  goToPurchasesBtn: css`
    border-radius: 8px;
    justify-content: space-between;
    padding: 15px 20px;
  `,
  goToPurchasesTextBtn: css`
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  creditCardModalContainer: css`
    padding: 0;
    height: 80%;
  `,
  list: css`
    padding-bottom: 0px;
    margin-horizontal: -16px;
  `,
  missionListContainer: css`
    padding-right: 16px;
    padding-left: 16px;
  `,
  fallbackContainer: css`
    height: 100%;
  `
};
