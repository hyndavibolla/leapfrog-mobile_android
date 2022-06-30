import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  shadowContainer: css`
    padding-bottom: 20px;
  `,
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    flex: 1;
  `,
  scrollViewContainer: css`
    flex-grow: 1;
    padding: 84px 0 16px;
  `,
  sectionSearch: css`
    width: 100%;
  `,
  sectionSearchHidden: css`
    display: none;
  `,
  sectionSubtitle: css`
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.MEDIUM};
    color: ${COLOR.DARK_GRAY};
    margin-vertical: 4px;
  `,
  link: css`
    color: ${COLOR.PRIMARY_BLUE};
  `,
  itemSeparator: css`
    width: 5px;
    height: 5px;
  `,
  featureList: css`
    margin-horizontal: 0px;
  `,
  list: css`
    padding-bottom: 0px;
  `,
  listContainerEnd: css`
    padding-right: 8px;
  `,
  cardContent: css`
    margin-left: 16px;
  `,
  horizontalListContainer: css`
    padding-right: 20px;
  `,
  trendingFooter: css`
    background-color: ${COLOR.WHITE};
    margin: 20px 16px 24px;
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
  spinnerContainer: css`
    flex: 1;
    justify-content: center;
  `,
  columnContainer: css`
    flex-direction: column;
    margin-left: 16px;
  `,
  columnItemContainer: css`
    margin-bottom: 20px;
  `,
  featuredList: css`
    width: 100px;
  `,
  headerContainer: css`
    margin-top: 28px;
  `,
  headerSubtitle: css`
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.DARK_GRAY};
    margin-top: 20px;
  `,
  headerTitleContainer: css`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `,
  streakSectionHeader: css`
    padding-bottom: 16px;
    justify-content: space-between;
  `,
  mainTitleContainer: css`
    padding-bottom: 8px;
  `,
  mainSubtitle: css`
    font-size: ${FONT_SIZE.SMALL};
    font-family: ${FONT_FAMILY.MEDIUM};
    color: ${COLOR.DARK_GRAY};
    margin-top: 4px;
  `,
  claimRewardsListContainer: css`
    padding-horizontal: 24px;
  `,
  emptyStateContainer: css`
    margin-bottom: 24px;
    padding-bottom: 32px;
    padding-horizontal: 24px;
    align-items: center;
  `,
  newOnMaxCarrousel: css`
    padding-horizontal: 12px;
    align-items: center;
  `,
  topBrandCarrousel: css`
    padding-horizontal: 16px;
  `,
  activeMissionsOffersSection: css`
    padding-horizontal: 16px;
    padding-bottom: 8px;
  `,
  headerAnimated: css`
    position: relative;
    z-index: 100;
  `
};
