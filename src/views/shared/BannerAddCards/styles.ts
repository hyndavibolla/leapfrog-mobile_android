import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    margin-top: 16px;
  `,
  bannerContainer: css`
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    padding: 16px;
    width: 100%;
  `,
  emptyContainer: css`
    align-items: center;
    background-color: ${COLOR.MEDIUM_GRAY};
    border-radius: 8px;
    flex-direction: row;
    justify-content: center;
    margin-top: 16px;
    padding: 28px 20px;
    width: 100%;
  `,
  creditCardAndText: css`
    flex-direction: row;
  `,
  backgroundIcon: css`
    background-color: ${COLOR.MEDIUM_GRAY};
    border-radius: 20px;
    padding: 4px;
  `,
  lockIcon: css`
    text-align: center;
  `,
  cardTitle: css`
    flex: 1;
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    margin-left: 8px;
  `,
  cardFallbackTitle: css`
    margin-left: 24px;
  `,
  image: css`
    align-self: center;
    height: 40px;
    width: 60px;
    border-radius: 4px;
  `,
  buttonsContainer: css`
    flex-direction: row;
    justify-content: space-around;
    margin-top: 16px;
  `,
  addCardButtonContainer: css`
    justify-content: flex-start;
  `,
  buttonInner: css`
    background-color: ${COLOR.PRIMARY_BLUE};
    height: 40px;
    width: 145px;
  `,
  buttonInnerText: css`
    background-color: ${COLOR.MEDIUM_GRAY};
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.REGULAR};
  `,
  secondaryButtonText: css`
    color: ${COLOR.PRIMARY_BLUE};
  `,
  buttonTextSecondLevel: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
  `,
  bodyText: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.SMALLER};
    margin-top: 8px;
    line-height: ${FONT_SIZE.MEDIUM};
  `,
  loading: css`
    margin-top: 36px;
  `
};
