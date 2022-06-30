import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  selectionBtnContainer: css`
    margin-top: 60px;
    width: 100%;
  `,
  button: css`
    padding: 16px;
    border-radius: 30px;
    align-items: center;
    background-color: ${COLOR.PRIMARY_BLUE};
    margin-horizontal: 40px;
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.SMALLER};
    text-align: center;
    color: ${COLOR.WHITE};
  `,
  notNowButton: css`
    padding: 16px;
    border-radius: 30px;
    align-items: center;
    background-color: ${COLOR.WHITE};
    margin-horizontal: 40px;
    margin-top: 24px;
  `,
  textOutlineButton: css`
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.SMALLER};
    text-align: center;
  `,
  modalDescription: css`
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.DARK_GRAY};
    margin-top: 24px;
    text-align: center;
  `,
  trashIcon: css`
    margin-bottom: 28px;
  `
};
