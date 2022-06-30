import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '_constants';

export const styles = {
  container: css`
    padding-horizontal: 24px;
    padding-bottom: 28px;
  `,
  bodyLink: css`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 12px;
  `,
  title: css`
    font-size: ${FONT_SIZE.REGULAR};
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.BLACK};
    line-height: 28px;
    padding-bottom: 8px;
  `,
  subtitle: css`
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.BLACK};
    line-height: ${LINE_HEIGHT.MEDIUM};
  `,
  link: css`
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${LINE_HEIGHT.MEDIUM};
    font-weight: bold;
    margin-left: 8px;
  `,
  linked: css`
    color: ${COLOR.PURPLE};
  `,
  bold: css`
    font-weight: bold;
  `,
  iconContainer: css`
    align-items: center;
    padding-left: 4px;
    padding-top: 20px;
  `,
  animation: css`
    width: 100%;
  `,
  animationMission: css`
    width: 100%;
  `,
  content: css`
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.BLACK_DARK};
  `
};
