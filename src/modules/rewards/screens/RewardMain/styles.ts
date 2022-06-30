import { css } from '@emotion/native';
import { Dimensions } from 'react-native';

import { COLOR, FONT_SIZE, CONTAINER_STYLE } from '_constants';

const borderPaddingSize = 32;

const screenWidth = `${Dimensions.get('window').width - borderPaddingSize}px`;

export const styles = {
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    flex: 1;
  `,
  scrollViewContainer: css`
    flex-grow: 1;
    min-height: 100%;
    padding-top: 64px;
  `,

  onboardingTooltipContainer: css`
    padding-horizontal: 16px;
    padding-top: 24px;
  `,
  sectionContainer: css`
    margin-top: 20px;
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
  contentContainer: css`
    position: relative;
  `,
  sectionSearch: css`
    position: absolute;
    z-index: 10;
    width: 100%;
    padding-horizontal: 16px;
  `,
  link: css`
    color: ${COLOR.PRIMARY_BLUE};
  `,
  itemSeparator: css`
    width: 5px;
    height: 5px;
  `,
  trendingFooter: css`
    background-color: ${COLOR.WHITE};
    margin: 20px 16px 0;
    padding: 20px 16px 16px;
  `,
  trendingFooterContainer: css`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  `,
  trendingContent: css`
    margin-left: 16px;
  `,
  trendingDescription: css`
    font-size: ${FONT_SIZE.PETITE};
    color: ${COLOR.DARK_GRAY};
  `,
  columnContainer: css`
    flex-direction: row;
  `,
  list: css`
    padding-horizontal: 20px;
    padding-vertical: 4px;
  `,
  listContainerEnd: css`
    padding-right: 8px;
  `,
  outerColumnItemContainer: css`
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
  `,
  columnItemContainer: css`
    margin: 8px 0 8px 16px;
    justify-content: center;
    align-items: center;
  `,
  rowItemContainer: css`
    margin-left: 16px;
  `,
  featuredList: css`
    width: 100px;
  `,
  footerContainer: css`
    padding: 16px 16px 32px;
    justify-content: center;
  `,
  footerCategoryList: css`
    margin-top: 28px;
  `,
  giftCardWaterMarkContainer: css`
    align-items: center;
    margin-top: 32px;
  `,
  rewardCardContainerStyles: css`
    width: ${screenWidth};
    margin-top: 16px;
  `,
  rewardCardTitle: css`
    font-size: ${FONT_SIZE.SMALLER};
  `,
  rewardCardDescription: css`
    color: ${COLOR.BLACK};
    font-weight: 500;
    line-height: ${FONT_SIZE.BIG};
  `,
  rewardCardImage: css`
    width: 108px;
    height: 108px;
    margin-right: 16px;
    border-radius: 50px;
  `,
  rewardCardAnchor: css`
    font-size: ${FONT_SIZE.SMALLER};
    margin-top: 4px;
  `,
  cardContainer: css`
    height: 100px;
    width: 158px;
    margin-left: 16px;
    margin-vertical: 8px;
    border-radius: 8px;
  `,
  simpleCard: css`
    ${CONTAINER_STYLE.shadow}
    background-color: ${COLOR.WHITE};
    justify-content: center;
    align-items: center;
  `,
  moreCategoriesList: css`
    margin: 16px;
  `,
  moreCategoriesBox: css`
    background-color: ${COLOR.WHITE};
    width: 150px;
    height: 90px;
    margin-right: 16px;
  `,
  moreCategoriesItemContainerStyle: css`
    background-color: ${COLOR.WHITE};
  `,
  moreCategoriesTextStyle: css`
    color: ${COLOR.BLACK};
    padding-horizontal: 4px;
  `
};
