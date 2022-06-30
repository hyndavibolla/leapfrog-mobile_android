import { css } from '@emotion/native';
import { Platform } from 'react-native';

import { COLOR, colorWithOpacity, FONT_FAMILY, FONT_SIZE } from '_constants';

const shadowColor = Platform.select({ android: COLOR.BLACK, ios: colorWithOpacity(COLOR.DARK_GRAY, 20) });

export const styles = {
  contentContainer: css`
    padding-horizontal: 20px;
  `,
  subHeader: css`
    flex-direction: row;
    align-items: center;
  `,
  logoImage: css`
    background-color: ${COLOR.DARK_GRAY};
    border-radius: 30px;
    height: 60px;
    width: 60px;
  `,
  brandInfoContainer: css`
    flex-direction: column;
    align-items: flex-start;
    flex: 1;
    margin-left: 24px;
  `,
  brandName: css`
    font-size: ${FONT_SIZE.REGULAR};
    color: ${COLOR.BLACK};
  `,
  missionInfoContainer: css`
    background-color: ${COLOR.MEDIUM_GRAY};
    margin-top: 16px;
    padding: 16px 20px;
  `,
  brandDescription: css`
    font-size: ${FONT_SIZE.BIG};
    color: ${COLOR.BLACK};
    margin-bottom: 16px;
  `,
  footer: css`
    background-color: ${COLOR.WHITE};
    box-shadow: 0 -2px 10px ${shadowColor};
    elevation: 20;
    flex-direction: row;
    justify-content: center;
    padding: 20px 40px;
    width: 100%;
  `,
  footerShadow: css`
    background-color: ${COLOR.MEDIUM_GRAY};
    height: 1px;
  `,
  buttonText: css`
    font-size: ${FONT_SIZE.PETITE};
    margin-vertical: 8px;
  `,
  purchasePlus: css`
    font-size: ${FONT_SIZE.BIG};
    margin: 0 24px;
  `,
  purchaseLogo: css`
    width: 70px;
    height: 70px;
  `,
  purchaseHeader: css`
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  purchaseAcceptBtn: css`
    margin-top: 36px;
  `,
  purchaseAcceptBtnText: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  purchaseAcceptBtnInnerContainer: css`
    padding: 12px;
    width: 80%;
    align-self: center;
  `,
  rowHeader: css`
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  `,
  nestedOfferContainer: css`
    border-color: ${COLOR.GRAY};
    border-width: 1px;
    border-radius: 8px;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 16px;
    padding: 16px 20px;
    width: 100%;
  `,
  halfColumn: css`
    width: 50%;
  `,
  nestedModalOffersModal: css`
    margin-bottom: 16px;
    width: 100%;
  `,
  modal: css`
    flex-shrink: 1;
    padding: 44px 20px;
    width: 100%;
  `,
  modalTitleContainer: css`
    margin-top: 20px;
  `,
  nestedModalTitle: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.MEDIUM};
    color: ${COLOR.BLACK};
    margin-top: 20px;
  `,
  nestedModalOffers: css`
    margin-vertical: 20px;
  `,
  nestedModalButtons: css`
    width: 100%;
    padding: 16px 40px 28px;
    flex-direction: column;
    box-shadow: 0 -2px 10px ${shadowColor};
    elevation: 20;
    background-color: white;
  `,
  modalGreenButton: css`
    padding: 16px 36px;
  `,
  modalGreenButtonText: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALL};
  `,
  modalCancelText: css`
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.PRIMARY_BLUE};
    align-self: center;
    margin-top: 24px;
  `,
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
  `,
  pillsContainer: css`
    align-self: center;
  `,
  subTitleContainer: css`
    flex-direction: row;
    justify-content: space-between;
    margin-top: 4px;
    width: 100%;
  `,
  clearDividerPadding: css`
    padding: 0;
  `,
  contentSpace: css`
    margin-top: 20px;
  `,
  progressContainer: css`
    margin-vertical: 24px;
  `,
  termsSection: css`
    margin-top: 32px;
  `,
  termsContent: css`
    margin-vertical: 16px;
  `,
  button: css`
    width: 100%;
  `,
  modalButton: css`
    margin-vertical: 24px;
    padding-horizontal: 20px;
  `,
  floatingTitle: css`
    font-weight: bold;
    letter-spacing: 1px;
    color: ${COLOR.WHITE};
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.MEDIUM};
  `
};
