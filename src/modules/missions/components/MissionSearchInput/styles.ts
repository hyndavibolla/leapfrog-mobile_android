import { css } from '@emotion/native';

import { COLOR, colorWithOpacity, FONT_SIZE } from '_constants';

export const styles = {
  dropdownContainer: css`
    background-color: ${COLOR.WHITE};
    width: 100%;
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
    overflow: hidden;
    z-index: 2;
    padding-bottom: 8px;
    position: absolute;
    top: 40px;
  `,
  backdrop: css`
    width: 200%;
    position: absolute;
    left: -48px;
    margin: -16px;
    z-index: -1;
    background: ${colorWithOpacity(COLOR.BLACK, 45)};
  `,
  dropdownItemContainer: css`
    padding: 12px 16px;
    border-color: ${COLOR.MEDIUM_GRAY};
    border-style: solid;
    border-top-width: 1px;
  `,
  dropdownItemText: css`
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.DARK_GRAY};
  `,
  dropdownItemHighlightText: css`
    color: ${COLOR.BLACK};
  `,
  backdropPressable: css`
    width: 100%;
    height: 100%;
  `,
  searchContainerOpen: css`
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    height: 40px;
    z-index: 10;
    width: 100%;
    position: absolute;
  `,
  searchInput: css`
    color: ${COLOR.WHITE};
  `,
  dropdownItemContent: css`
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  `,
  dropdownIconContainer: css`
    margin-right: 8px;
  `
};
