import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    padding: 16px;
    width: 100%;
  `,
  creditCardAndText: css`
    flex-direction: row;
  `,
  backgroundIcon: css`
    align-items: center;
    background-color: ${COLOR.MEDIUM_GRAY};
    border-radius: 50px;
    justify-content: center;
    width: 25px;
    height: 25px;
  `,
  lockIcon: css`
    text-align: center;
  `,
  cardTitle: css`
    flex: 1;
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
    margin-left: 8px;
  `,
  bodyText: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.SMALLER};
    margin-top: 8px;
    line-height: ${FONT_SIZE.MEDIUM};
  `,
  buttonContainer: css`
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 16px;
  `,
  buttonInner: css`
    background-color: ${COLOR.PRIMARY_BLUE};
    height: 40px;
    width: 145px;
    border-radius: 30px;
    align-items: center;
    justify-content: center;
  `,
  buttonTextSecondLevel: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
    color: ${COLOR.WHITE};
  `
};
