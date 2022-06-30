import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants/styles';

export const styles = {
  topContainer: css`
    border-bottom-left-radius: 17px;
    border-bottom-right-radius: 17px;
    overflow: hidden;
  `,
  backgroundContainer: css`
    align-items: center;
    padding-top: 20px;
    padding-bottom: 40px;
    background-color: ${COLOR.PRIMARY_BLUE};
  `,
  fakeNavigation: css`
    flex-direction: row;
    padding: 24px 20px;
    align-items: center;
  `,
  navigationTitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.WHITE};
    line-height: 35px;
    text-transform: uppercase;
    text-align: center;
    flex: 1;
  `,
  avatar: css`
    width: 120px;
    height: 120px;
    border-radius: 120px;
  `,
  profileName: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.HUGE};
    color: ${COLOR.WHITE};
    margin-top: 8px;
    padding: 4px;
  `,
  profileEmail: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.WHITE};
  `,
  card: css`
    background-color: ${COLOR.WHITE};
    margin: 20px;
    padding: 40px 20px;
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.MEDIUM};
    margin-bottom: 4px;
    text-align: center;
  `,
  text: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALL};
    line-height: 26px;
    color: ${COLOR.DARK_GRAY};
    margin-bottom: 20px;
    text-align: center;
  `,
  buttonOuter: css`
    width: 100%;
  `,
  buttonInner: css`
    background-color: ${COLOR.PRIMARY_BLUE};
    padding: 16px 24px;
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.SMALL};
    text-align: center;
  `,
  linksContainer: css`
    margin: 8px 20px;
  `,
  linksTitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.BLACK};
    margin-vertical: 20px;
  `,
  linksCard: css`
    background-color: ${COLOR.WHITE};
    margin-bottom: 8px;
    flex-direction: row;
  `,
  linksText: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.DARK_GRAY};
  `,
  signOutText: css`
    margin-top: 32px;
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.RED};
    text-align: center;
  `,
  deleteAccountTitle: css`
    margin-top: 32px;
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: 18px;
    color: ${COLOR.DARK_GRAY};
    text-align: center;
  `,
  logoutContainer: css`
    align-items: center;
  `,
  dividerContainer: css`
    margin-vertical: 32px;
  `,
  dividerStyle: css`
    border-bottom-color: ${COLOR.DARK_GRAY};
  `,
  supportTitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.TINY};
    line-height: 18px;
    color: ${COLOR.DARK_GRAY};
    text-align: center;
  `,
  supportText: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: 22px;
    color: ${COLOR.PRIMARY_BLUE};
    text-align: center;
    margin-bottom: 16px;
  `,
  selectionBtnContainer: css`
    margin-top: 32px;
    width: 80%;
  `,
  btnText: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: 16px;
    text-align: center;
    color: ${COLOR.WHITE};
  `,
  btnTextCancel: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  cancelBtn: css`
    margin-top: 16px;
    align-items: center;
  `,
  btn: css`
    padding: 16px;
    border-radius: 30px;
    align-items: center;
    background-color: ${COLOR.PRIMARY_BLUE};
  `,
  backButton: css`
    width: 35px;
    height: 35px;
  `,
  backButtonContainer: css`
    position: absolute;
    left: 20px;
    top: 25px;
    z-index: 1;
  `,
  scrollContentContainer: css`
    padding-bottom: 16px;
    background-color: ${COLOR.LIGHT_GRAY};
  `
};
