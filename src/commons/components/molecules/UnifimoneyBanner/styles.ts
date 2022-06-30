import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '_constants/styles';

export const styles = {
  container: css`
    height: 304px;
    border-radius: 8px;
  `,
  image: css`
    padding: 32px 24px;
  `,
  circleContainer: css`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  `,
  circle: css`
    width: 60px;
    height: 60px;
    background-color: ${COLOR.WHITE};
    border-radius: 30px;
    justify-content: center;
    align-items: center;
  `,
  leftCircle: css`
    position: relative;
    left: 8px;
    z-index: 1;
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px 2px;
    shadow-opacity: 0.23;
    shadow-radius: 2.62px;
    elevation: 4;
  `,
  maxIcon: css`
    padding-top: 4px;
  `,
  title: css`
    color: ${COLOR.WHITE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.REGULAR};
    line-height: ${LINE_HEIGHT.MEDIUM};
    margin-bottom: 12px;
    text-align: center;
  `,
  subtitle: css`
    color: ${COLOR.WHITE};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${LINE_HEIGHT.MEDIUM};
    margin-bottom: 20px;
    text-align: center;
  `,
  innerContainerButton: css`
    background-color: ${COLOR.WHITE};
  `,
  button: css`
    width: 100%;
  `,
  textButton: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${LINE_HEIGHT.REGULAR};
    text-align: center;
    padding-vertical: 8px;
  `
};
