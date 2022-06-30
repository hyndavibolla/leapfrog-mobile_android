import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    padding: 20px 8px;
    border-radius: 8px;
    width: 100%;
    background-color: ${COLOR.WHITE};
    flex-direction: row;
  `,
  image: css`
    margin-right: 8px;
    width: 75px;
    height: 46px;
    border-radius: 4px;
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    margin-bottom: 16px;
    line-height: ${FONT_SIZE.BIG};
  `,
  titleUserDoesNotHaveSywCard: css`
    line-height: ${FONT_SIZE.REGULAR};
  `,
  progressText: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
    font-family: ${FONT_FAMILY.MEDIUM};
    margin-top: 20px;
  `,
  link: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.SMALL};
  `,
  content: css`
    flex: 1;
  `
};
