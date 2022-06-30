import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../constants';

export const styles = {
  container: css`
    flex: 1;
    padding: 4px;
    background-color: ${COLOR.LIGHT_GRAY};
  `,
  title: css`
    margin-bottom: 20px;
  `,
  flatListContainer: css`
    padding: 16px;
  `,
  headerCard: css`
    background-color: ${COLOR.WHITE};
    margin-bottom: 32px;
  `,
  listContainer: css``,
  emptyListContainer: css`
    flex: 1;
  `,
  spinnerContainer: css`
    justify-content: center;
    align-items: center;
    margin: 20px 0;
  `,
  availablePointsText: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.MEDIUM};
    color: ${COLOR.PRIMARY_BLUE};
    margin-left: 4px;
  `,
  pendingPointsText: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.DARK_GRAY};
    margin-left: 4px;
  `,
  headerCardTitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.DARK_GRAY};
  `,
  headerCardSubtitle: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.MEDIUM};
    color: ${COLOR.DARK_GRAY};
  `,
  headerCardPointsTitleContainer: css`
    flex-direction: row;
    align-items: center;
  `,
  headerCardPointsTitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.PRIMARY_BLUE};
    margin-left: 4px;
  `,
  headerCardPointsSubtitle: css`
    color: ${COLOR.ORANGE};
  `,
  balanceTextContainer: css`
    flex-direction: row;
    align-items: center;
  `,
  headerContainer: css`
    margin-vertical: 16px;
  `,
  cardInfoContainer: css`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  spinnerText: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.PRIMARY_BLUE};
    margin-top: 16px;
  `,
  emptyStateSubtitle: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.MEDIUM};
    color: ${COLOR.DARK_GRAY};
    margin-top: 16px;
    text-align: center;
  `,
  emptyStateContainer: css`
    flex: 1;
    align-items: center;
    justify-content: center;
  `,
  iconContainer: css`
    padding: 4px;
  `,
  faqSection: css`
    margin-top: 32px;
  `,
  faqSectionTitle: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.BLACK};
    line-height: 20px;
    margin-top: 16px;
  `,
  faqText: css`
    text-align: left;
  `,
  modalFaqContainer: css`
    padding: 60px 4px;
  `,
  modalFaqScrollViewContainer: css`
    padding: 0 16px;
  `,
  rowContainer: css`
    flex-direction: row;
    justify-content: space-between;
  `,
  link: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.PRIMARY_BLUE};
  `,
  fallbackContainer: css`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${COLOR.LIGHT_GRAY};
  `
};
