import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../constants';

export const styles = {
  mainContainer: css`
    flex: 1;
    background-color: ${COLOR.LIGHT_GRAY};
    padding-top: 100px;
  `,
  scrollContainer: css`
    padding-horizontal: 40px;
    padding-bottom: 40px;
  `,
  contentContainer: css`
    justify-content: space-evenly;
  `,
  title: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.MEDIUM};
    line-height: 30px;
    color: ${COLOR.BLACK};
    text-align: center;
    margin-bottom: 8px;
  `,
  text: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: 26px;
    color: ${COLOR.DARK_GRAY};
    text-align: center;
    margin-bottom: 32px;
  `,
  buttonItem: css`
    margin-bottom: 4px;
    height: 50px;
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.SMALLER};
    padding-vertical: 4px;
  `,
  sywLogo: css`
    width: 70px;
    height: 70px;
    border-radius: 4px;
    align-self: center;
    margin-top: 48px;
    margin-bottom: 20px;
  `,
  linkToSettings: css`
    align-items: center;
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.PRIMARY_BLUE};
  `,
  itemImage: css`
    width: 40px;
    height: 40px;
  `,
  stepsContainer: css`
    margin-top: 40px;
    flex: 1;
  `,
  step: css`
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
  `,
  stepText: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.DARK_GRAY};
    margin-left: 20px;
  `,
  titlePushNotification: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.REGULAR};
    line-height: 30px;
    color: ${COLOR.BLACK};
    text-align: center;
  `,
  lottieContainer: css`
    height: 400px;
  `
};
