import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../constants';

export const styles = {
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    height: 100%;
    padding: 0;
    width: 100%;
  `,
  modalUnlinkContainer: css`
    align-items: center;
    width: 100%;
  `,
  cardBanner: css`
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
  `,
  imageBackgroundContainer: css`
    height: 72px;
    overflow: hidden;
  `,
  imageBackground: css`
    padding: 16px;
    height: 250px;
  `,
  creditCardAndText: css`
    flex-direction: row;
  `,
  cardTitle: css`
    color: ${COLOR.WHITE};
    flex: 1;
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
    margin-left: 8px;
  `,
  image: css`
    align-self: center;
    height: 40px;
    width: 60px;
    border-radius: 4px;
  `,
  smallImage: css`
    align-self: center;
    height: 32px;
    width: 50px;
    margin-right: 4px;
  `,
  buttonsContainer: css`
    align-items: center;
    flex-direction: row;
    justify-content: space-around;
    height: 72px;
  `,
  dangerButtonText: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
    color: ${COLOR.RED};
  `,
  primaryButtonText: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
  `,
  link: css`
    text-align: center;
    font-size: ${FONT_SIZE.SMALLER};
    line-height: 28px;
    color: ${COLOR.PRIMARY_BLUE};
    letter-spacing: 0;
  `,
  iconContainer: css`
    padding: 16px;
    background-color: ${COLOR.DARK_GRAY};
    border-radius: 50px;
  `,
  selectionBtnContainer: css`
    margin-top: 32px;
    width: 100%;
  `,
  button: css`
    padding: 16px;
    border-radius: 30px;
    align-items: center;
    background-color: ${COLOR.PRIMARY_BLUE};
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.SMALLER};
    text-align: center;
    color: ${COLOR.WHITE};
  `,
  textOutlineButton: css`
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.SMALLER};
    text-align: center;
    margin-top: 24px;
  `,
  modalTitle: css`
    margin-bottom: 64px;
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.REGULAR};
  `,
  modalTextConfirm: css`
    margin-vertical: 28px;
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.REGULAR};
  `,
  modalDescription: css`
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.DARK_GRAY};
    margin: 0 20px 40px;
    text-align: center;
  `,
  modalDescription2: css`
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.DARK_GRAY};
    margin-horizontal: 20px;
    text-align: center;
  `,
  modalCancel: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.REGULAR};
    font-family: ${FONT_FAMILY.MEDIUM};
  `,
  trashIcon: css`
    margin-bottom: 28px;
  `,
  transactionsContainer: css`
    margin: 20px 0 8px;
    padding: 0;
  `,
  transactionsTitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.BLACK};
  `
};
