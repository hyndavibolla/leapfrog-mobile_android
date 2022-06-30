import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    flex: 1;
  `,
  footerContainer: css`
    height: 100px;
    padding-horizontal: 32px;
    justify-content: center;
    background-color: ${COLOR.WHITE};
  `,
  innerButton: css`
    padding: 16px 0;
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.REGULAR};
  `,
  toggleButtonContainer: css`
    flex-direction: row;
    align-items: center;
    background-color: ${COLOR.WHITE};
    height: 52px;
    border-radius: 52px;
    margin: 26px 16px;
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px 2px;
    shadow-opacity: 0.2;
    elevation: 4;
  `,
  toggleButton: css`
    align-items: center;
    flex: 1;
  `,
  toggleButtonText: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.PETITE};
  `,
  toggleButtonTextActive: css`
    color: ${COLOR.PRIMARY_BLUE};
  `,
  toggleButtonSeparator: css`
    height: 40px;
    border-right-width: 1px;
    border-right-color: ${COLOR.GRAY};
  `,
  fallback: css`
    flex: 1;
    align-items: center;
    margin-top: 80px;
  `,
  titleFallback: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
    font-family: ${FONT_FAMILY.BOLD};
    margin: 32px 36px 0;
    text-align: center;
  `,
  iconBackground: css`
    background-color: ${COLOR.SOFT_PRIMARY_BLUE};
    align-items: flex-end;
  `,
  iconInnerBackground: css`
    background-color: ${COLOR.WHITE};
    border-radius: ${FONT_SIZE.XXL};
  `
};
