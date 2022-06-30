import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  shadowContainer: css`
    padding-bottom: 0;
  `,
  container: css`
    padding: 0;
    border-radius: 8px;
  `,
  content: css`
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    width: 100%;
    padding: 0;
    overflow: hidden;
  `,
  mainImage: css`
    width: 100%;
    height: 184px;
    background-color: ${COLOR.WHITE};
    resize-mode: contain;
  `,
  imageContent: css`
    padding: 36px 0 20px 20px; // padding top is arbitrary on the design
    width: 60%;
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALL};
    font-family: ${FONT_FAMILY.BOLD};
    margin-bottom: 16px;
  `,
  cta: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.BOLD};
    margin-right: 8px;
  `,
  ctaContainer: css`
    flex-direction: row;
    align-items: center;
  `
};
