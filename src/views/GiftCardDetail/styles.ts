import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  addToWalletContainer: css`
    margin-vertical: 0;
  `,
  addToWalletImage: css`
    margin-vertical: 0;
    width: 100%;
  `,
  saveToPhoneImage: css`
    background-color: ${COLOR.BLACK_DARK};
    border-radius: 8px;
    margin-top: 32px;
    width: 100%;
    height: 44px;
  `,
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    padding: 28px 16px;
  `,
  boxCard: css`
    width: 100%;
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    overflow: hidden;
  `,
  boxCardHeader: css`
    background-color: ${COLOR.PRIMARY_BLUE};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 12px 20px;
  `,
  boxCardHeaderGray: css`
    background-color: ${COLOR.DARK_GRAY};
  `,
  giftIconContainer: css`
    background-color: ${COLOR.WHITE};
    height: 40px;
    width: 40px;
    border-radius: 20px;
  `,
  boxCardHeaderTitle: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.REGULAR};
    font-family: ${FONT_FAMILY.BOLD};
    margin-left: 8px;
    flex: 1;
  `,
  boxCardCover: css`
    margin: 0 20px;
    padding-top: 28px;
    padding-bottom: 20px;
    border-bottom-color: ${COLOR.MEDIUM_GRAY};
    border-bottom-width: 1px;
    justify-content: space-between;
    align-items: center;
  `,
  boxCardCoverTitle: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.DARK_GRAY};
    text-align: center;
  `,
  barCode: css`
    padding-top: 20px;
  `,
  boxCardItems: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 8px 20px 32px 20px;
  `,
  itemBoxCard: css`
    width: 100%;
    margin-top: 16px;
  `,
  itemBoxCardTitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.PETITE};
    color: ${COLOR.DARK_GRAY};
    line-height: ${FONT_SIZE.BIG};
  `,
  itemBoxCardValue: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.REGULAR};
    color: ${COLOR.BLACK};
    line-height: 30px;
    max-width: 80%;
  `,
  itemBoxCardContent: css`
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
  `,
  itemBoxCopy: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  balanceContainer: css`
    margin-top: 4px;
    flex-direction: row;
  `,
  iconBalanceContainer: css`
    margin-left: 8px;
  `,
  textDisabled: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  article: css`
    width: 100%;
    padding-vertical: 28px;
  `,
  itemArticle: css`
    margin-bottom: 36px;
    font-size: ${FONT_SIZE.TINY};
    line-height: ${FONT_SIZE.SMALL};
  `,
  termsAndConditions: css`
    font-size: ${FONT_SIZE.TINY};
    line-height: ${FONT_SIZE.SMALL};
  `,
  itemArticleTitle: css`
    margin-bottom: 8px;
  `,
  itemArticleText: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.DARK_GRAY};
    line-height: ${FONT_SIZE.HUGE};
  `,
  footer: css`
    align-items: center;
    padding-bottom: 60px;
  `,
  fallbackContainer: css`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 0 52px;
  `,
  fallbackTitle: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    margin-top: 20px;
    text-align: center;
  `,
  fallbackSubtitle: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.MEDIUM};
    text-align: center;
    margin-top: 8px;
  `,
  loading: css`
    align-items: flex-start;
  `,
  logo: css`
    width: 40px;
    height: 40px;
    border-radius: 40px;
  `
};
