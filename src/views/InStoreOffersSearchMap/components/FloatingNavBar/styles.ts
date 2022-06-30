import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../../constants';

export const styles = {
  container: css`
    position: absolute;
    top: 50px;
    flex-direction: row;
    padding: 0 20px;
  `,
  backContainer: css`
    width: 15%;
  `,
  back: css`
    max-width: 250px;
    min-width: 40px;
    height: 40px;
    background-color: ${COLOR.WHITE};
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    margin-right: 8px;
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.2;
    elevation: 3;
  `,
  backButtonWithText: css`
    flex-direction: row;
    padding: 0 16px;
    align-items: center;
  `,
  search: css`
    width: 85%;
    height: 40px;
    background-color: ${COLOR.WHITE};
    border-radius: 20px;
    padding: 0 16px;
    flex-direction: row;
    align-items: center;
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.2;
    elevation: 3;
  `,
  searchText: css`
    width: 75%;
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.SMALL};
    color: ${COLOR.BLACK};
  `,
  searchIcon: css`
    margin-right: 16px;
    color: ${COLOR.BLACK};
  `,
  closeIcon: css`
    position: absolute;
    right: 15px;
  `,
  arrowText: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.SMALL};
    color: ${COLOR.BLACK};
    margin-left: 8px;
  `,
  closeIconBackground: css`
    height: 20px;
    width: 20px;
    border-radius: 20px;
    align-items: center;
    justify-content: center;
    background-color: ${COLOR.GRAY};
  `
};
