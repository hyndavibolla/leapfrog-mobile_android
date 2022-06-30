import { css } from '@emotion/native';

import { FONT_FAMILY } from '_constants/styles';
import { COLOR, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
  `,
  headerContainer: css`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 32px 20px;
    background-color: ${COLOR.LIGHT_GRAY};
  `,
  pill: css`
    height: 36px;
  `,
  emailWarningContainer: css`
    margin: 0 20px 40px;
    padding: 16px 24px 16px 16px;
    border-radius: 8px;
    background-color: ${COLOR.ORANGE};
    flex-direction: row;
    align-items: center;
  `,
  emailWarningText: css`
    color: ${COLOR.WHITE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALL};
    line-height: 25px;
    padding-right: 24px;
  `,
  logoContainer: css`
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-horizontal: 44px;
    margin-bottom: 24px;
  `,
  logo: css`
    margin-bottom: 8px;
  `,
  numberInputContainer: css`
    flex-direction: column;
    margin-bottom: 36px;
    margin-top: 44px;
  `,
  activityName: css`
    text-align: center;
  `,
  giftCardInformationContainer: css`
    padding: 0 32px;
    margin-bottom: 32px;
  `,
  giftCardAccordionContainer: css`
    padding: 0 40px;
    margin-bottom: 32px;
  `,
  redeemContainer: css`
    flex-direction: column;
    justify-content: center;
    align-self: center;
    align-items: center;
    margin-bottom: 32px;
  `,
  buttonInner: css`
    width: auto;
    min-width: 295px;
    height: 50px;
    background-color: ${COLOR.PRIMARY_BLUE};
  `,
  titleContainer: css`
    flex-direction: row;
    align-items: flex-start;
  `,
  textContainer: css`
    margin-top: 16px;
    flex-direction: row;
    width: 100%;
    overflow: hidden;
  `,
  claimNote: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALL};
    text-align: center;
    margin-top: 8px;
  `,
  text: css`
    color: ${COLOR.DARK_GRAY};
    line-height: 28px;
    text-align: left;
    font-size: ${FONT_SIZE.SMALL};
  `,
  legals: css`
    font-size: ${FONT_SIZE.PETITE};
    line-height: 25px;
  `,
  footer: css`
    padding: 20px 16px 60px;
    justify-content: center;
    align-items: center;
  `,
  touchable: css`
    align-self: flex-start;
    border-radius: 30px;
    padding-horizontal: 40px;
  `,
  disabledBtn: css`
    background-color: ${COLOR.DARK_GRAY};
  `,
  baseButtonText: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.SMALL};
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: center;
  `,
  buttonContainer: css`
    padding: 8px 12px;
    min-width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: center;
  `,
  lockModalContent: css`
    align-items: center;
  `,
  lockedTitle: css`
    padding: 0 40px;
  `,
  lockBtn: css`
    margin-top: 20px;
  `,
  lockedBtnInnerContainer: css`
    padding: 16px 60px;
  `,
  lockedBtnTextStyle: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  emailModalOuterContainer: css`
    height: 100%;
  `,
  emailModalContainer: css`
    align-items: center;
    padding-top: 60px;
  `,
  emailModalText: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: 26px;
    color: ${COLOR.DARK_GRAY};
    margin: 0 24px;
    text-align: center;
  `,
  emailModalTitle: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.BIG};
    line-height: 30px;
    color: ${COLOR.BLACK};
  `,
  emailModalEmail: css`
    margin-bottom: 8px;
  `,
  emailModalCardContainer: css`
    background-color: ${COLOR.WHITE};
    margin-bottom: 4px;
  `,
  emailModalFaqContainer: css`
    margin: 36px 20px 24px;
    align-items: center;
  `,
  emailModalFaqs: css`
    margin-top: 24px;
  `,
  emailModalFaqTitle: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.DARK_GRAY};
  `,
  emailModalFaqText: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.PETITE};
    color: ${COLOR.DARK_GRAY};
    line-height: 26px;
  `,
  emailModalFaqTextSecond: css`
    margin-top: 24px;
  `,
  emailModalLink: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.PETITE};
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.PETITE};
  `,
  verifiedModalOuterContainer: css`
    flex-direction: row;
    flex: 1;
    padding: 40px 20px;
    justify-content: center;
    background-color: ${COLOR.LIGHT_GRAY};
    align-items: center;
  `,
  verifiedModalMessageContainer: css`
    flex: 1;
    align-items: center;
    justify-content: center;
  `,
  verifiedModalContainer: css`
    align-items: center;
  `,
  verifiedModalBtnInnerContainer: css`
    width: 100%;
  `,
  verifiedModalTitle: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.BIG};
    line-height: 30px;
    color: ${COLOR.BLACK};
    margin: 40px 0 8px;
    text-align: center;
  `,
  verifiedModalText: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALL};
    line-height: 26px;
    color: ${COLOR.DARK_GRAY};
    margin: 0 36px 24px;
    text-align: center;
  `,
  verifiedModalBtnContainer: css`
    width: 100%;
  `,
  verifiedModalBtnText: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.SMALL};
    line-height: 26px;
    text-align: center;
    padding: 4px 0;
  `,
  dividerStyle: css`
    color: ${COLOR.DARK_GRAY};
  `,
  redeemCard: css`
    background-color: ${COLOR.WHITE};
    border-radius: 10px;
    padding: 20px;
  `,
  redeemCardContainer: css`
    padding-horizontal: 32px;
    margin-bottom: 32px;
  `
};
