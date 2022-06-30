import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '_constants/styles';

export const styles = {
  container: css`
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    padding: 16px 24px;
    background-color: ${COLOR.WHITE};
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.1;
    elevation: 3;
  `,
  fireIcon: css`
    align-self: center;
    width: 60px;
    height: 60px;
    margin-bottom: 16px;
  `,
  shadowContainer: css`
    padding: 20px 16px;
  `,
  iconContainer: css`
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background-color: ${COLOR.WHITE};
    justify-content: center;
    align-items: center;
    shadow-color: ${COLOR.BLACK};
    shadow-radius: 5px;
    shadow-opacity: 0.3;
    shadow-offset: 1px 1px;
    elevation: 4;
    margin-bottom: 16px;
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.BOLD};
    line-height: ${LINE_HEIGHT.MEDIUM};
    text-align: center;
    margin-bottom: 8px;
  `,
  subtitle: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
    text-align: center;
  `,
  closeIcon: css`
    position: absolute;
    right: 24px;
    top: 16px;
  `
};
