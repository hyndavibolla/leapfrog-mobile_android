import { css } from '@emotion/native';

import { COLOR, colorWithOpacity, FONT_FAMILY, FONT_SIZE } from '../../constants';

export const styles = {
  container: css`
    width: 100%;
    height: 100%;
    background-color: ${COLOR.LIGHT_GRAY};
  `,
  containerError: css`
    display: flex;
    width: 100%;
    height: 100%;
    padding-horizontal: 10%;
  `,
  containerBox: css`
    padding-vertical: 20px;
  `,
  scroll: css`
    padding: 0 20px 16px;
  `,
  headerContainer: css`
    padding: 48px 16px 16px;
    background-color: ${COLOR.WHITE};
    flex-direction: row;
    align-items: center;
  `,
  searchContainer: css`
    flex: 1;
  `,
  back: css`
    width: 40px;
    height: 40px;
    background-color: ${COLOR.WHITE};
    justify-content: center;
    align-items: center;
    margin-right: 8px;
  `,
  searchContainerStyle: css`
    shadow-color: ${COLOR.TRANSPARENT};
    background-color: ${COLOR.LIGHT_GRAY};
    flex: 1;
  `,
  searchInputStyle: css`
    margin-left: 16px;
    padding-right: 8px;
    flex: 1;
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.MEDIUM};
    line-height: ${FONT_SIZE.SMALL};
  `,
  searchInputEmptyStyle: css`
    margin-right: 0;
    padding-right: 0;
  `,
  titleSection: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    color: ${COLOR.BLACK};
    margin-bottom: 16px;
  `,
  itemsSearchHistory: css`
    margin-bottom: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  itemZipCode: css`
    margin-left: 16px;
    margin-right: 4px;
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  itemText: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    flex: 1;
  `,
  addressMain: css`
    border-bottom-color: ${colorWithOpacity(COLOR.DARK_GRAY, 20)};
    border-bottom-width: 1px;
    padding-vertical: 16px;
  `,
  address: css`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  addressContainer: css`
    margin-left: 12px;
  `,
  addressIcon: css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background-color: ${colorWithOpacity(COLOR.DARK_GRAY, 50)};
    border-radius: 15px;
  `,
  addressTitle: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  addressTitleMatch: css`
    font-family: ${FONT_FAMILY.BOLD};
  `,
  addressTitleSecondary: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  addressSubTitle: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.PETITE};
  `,
  offers: css`
    margin-bottom: 16px;
    box-shadow: 0px -2px 10px ${colorWithOpacity(COLOR.GRAY_SHADOW, 20)};
    elevation: 3;
  `,
  closeIcon: css`
    position: absolute;
    right: 15px;
    top: 10px;
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
