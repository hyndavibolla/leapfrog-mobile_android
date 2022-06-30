import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../constants';

export const styles = {
  contentContainer: css`
    flex: 1;
    justify-content: center;
  `,
  imageContainer: css`
    margin: 0 32px 16px;
  `,
  image: css`
    align-self: center;
    border-radius: 4px;
  `,
  sectionContainer: css`
    margin: 0 16px;
  `,
  title: css`
    font-family: ${FONT_FAMILY.HEAVY};
    color: ${COLOR.BLACK};
    text-align: center;
    margin-top: 20px;
    margin-bottom: 8px;
  `,
  text: css`
    text-align: center;
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.HUGE};
    color: ${COLOR.DARK_GRAY};
  `,
  textSpacing: css`
    margin: 8px 0;
  `,
  link: css`
    color: ${COLOR.PRIMARY_BLUE};
    letter-spacing: 0;
  `,
  buttonContainer: css`
    margin: 8px 40px 20px;
  `,
  buttonOuter: css`
    width: 100%;
  `,
  buttonInner: css`
    padding: 8px 0;
    background-color: ${COLOR.PRIMARY_BLUE};
  `,
  buttonText: css`
    font-size: ${FONT_SIZE.SMALL};
    letter-spacing: 0;
    line-height: ${FONT_SIZE.HUGE};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  contactText: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.HUGE};
    font-size: ${FONT_SIZE.TINY};
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0;
  `
};
