import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '_constants/styles';

export const styles = {
  container: css`
    height: 104px;
    border-radius: 8px;
  `,
  image: css`
    padding: 12px 16px;
    flex-direction: row;
  `,
  circleContainer: css`
    flex: 1;
    flex-direction: row;
    align-items: center;
    padding-left: 12px;
  `,
  contentContainer: css`
    flex: 1;
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
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${LINE_HEIGHT.MEDIUM};
    margin-bottom: 8px;
  `,
  subtitle: css`
    color: ${COLOR.WHITE};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${LINE_HEIGHT.MEDIUM};
  `
};
