import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '_constants';

export const styles = {
  container: css`
    width: 100%;
  `,
  imageContent: css`
    padding: 20px 16px 16px;
    width: 60%;
  `,
  title: css`
    font-size: ${FONT_SIZE.SMALL};
    font-family: ${FONT_FAMILY.BOLD};
    line-height: ${LINE_HEIGHT.MEDIUM};
    margin-bottom: 4px;
  `,
  description: css`
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${LINE_HEIGHT.REGULAR};
    margin-bottom: 12px;
  `,
  light: css`
    color: ${COLOR.WHITE};
  `,
  dark: css`
    color: ${COLOR.BLACK};
  `,
  backgroundImage: css`
    width: 100%;
    height: 100%;
    border-radius: 8px;
  `
};
