import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    padding: 60px 20px 40px;
  `,
  containerData: css`
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-horizontal: 30px;
  `,
  icon: css`
    margin-bottom: 20px;
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    margin-bottom: 20px;
  `,
  subtitle: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.MEDIUM};
    margin-bottom: 30px;
    text-align: center;
  `,
  button: css`
    margin-bottom: 75px;
    width: 295px;
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
  `,
  innerButton: css`
    height: 50px;
  `
};
