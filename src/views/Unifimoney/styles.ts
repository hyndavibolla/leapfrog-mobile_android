import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '_constants/styles';

export const styles = {
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    padding: 70px 32px;
    flex: 1;
  `,
  circleContainer: css`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;
  `,
  circle: css`
    width: 90px;
    height: 90px;
    background-color: ${COLOR.WHITE};
    border-radius: 45px;
    justify-content: center;
    align-items: center;
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px 2px;
    shadow-opacity: 0.23;
    shadow-radius: 2.62px;
    elevation: 4;
  `,
  leftCircle: css`
    position: relative;
    left: 8px;
    z-index: 1;
  `,
  maxIcon: css`
    padding-top: 8px;
  `,
  descriptionContainer: css`
    margin-bottom: 32px;
  `,
  title: css`
    color: ${COLOR.BLACK_DARK};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.REGULAR};
    line-height: ${LINE_HEIGHT.MEDIUM_2X};
    margin-bottom: 24px;
    text-align: center;
  `,
  description: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${LINE_HEIGHT.MEDIUM};
    text-align: center;
  `,
  itemTitle: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${LINE_HEIGHT.REGULAR};
    text-align: center;
    margin-bottom: 20px;
  `,
  itemsContainer: css`
    margin-bottom: 32px;
  `,
  items: css`
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  item: css`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: ${COLOR.SOFT_PRIMARY_BLUE};
    justify-content: center;
    align-items: center;
    margin-right: 32px;
    margin-bottom: 4px;
  `,
  lastItem: css`
    margin-right: 0px;
  `,
  itemDescription: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.TINY};
    line-height: ${LINE_HEIGHT.SMALL};
  `,
  innerContainerButton: css`
    background-color: ${COLOR.PRIMARY_BLUE};
  `,
  button: css`
    width: 100%;
  `,
  textButton: css`
    color: ${COLOR.WHITE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${LINE_HEIGHT.REGULAR};
    text-align: center;
    padding-vertical: 8px;
  `,
  link: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${LINE_HEIGHT.REGULAR};
    text-align: center;
    margin-top: 24px;
  `,
  modal: css`
    padding: 60px 40px;
  `,
  modalTitle: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.REGULAR};
    line-height: ${LINE_HEIGHT.BIG};
    text-align: center;
    margin: 32px 0;
  `,
  modalDescription: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${LINE_HEIGHT.MEDIUM};
    text-align: center;
    margin-bottom: 32px;
  `,
  modalQuestion: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.REGULAR};
    line-height: ${LINE_HEIGHT.MEDIUM_2X};
    text-align: center;
    margin-bottom: 32px;
  `,
  cancelModal: css`
    margin-top: 36px;
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${LINE_HEIGHT.SMALL};
  `
};
