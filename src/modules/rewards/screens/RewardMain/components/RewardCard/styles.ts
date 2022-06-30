import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    padding: 0;
    border-radius: 8px;
    width: 335px;
  `,
  content: css`
    border-radius: 8px;
    width: 100%;
    height: 160px;
    padding: 20px;
  `,
  rowContainer: css`
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    flex: 1;
  `,
  infoContainer: css`
    margin-left: 4px;
    justify-content: space-between;
    flex: 1;
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.MEDIUM};
    font-family: ${FONT_FAMILY.HEAVY};
  `,
  logoContainer: css``,
  anchorContainer: css`
    flex-direction: row;
    align-items: center;
    margin-top: 8px;
  `,
  descriptionText: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.SEMIBOLD};
    line-height: ${FONT_SIZE.HUGE};
  `,
  anchorText: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.PETITE};
    font-family: ${FONT_FAMILY.BOLD};
    margin-right: 4px;
  `,
  whiteText: css`
    color: ${COLOR.WHITE};
  `,
  whiteBackground: css`
    background-color: ${COLOR.WHITE};
  `,
  darkBackground: css`
    background-color: ${COLOR.PRIMARY_BLUE};
  `
};
