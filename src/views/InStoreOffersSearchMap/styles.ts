import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../constants';

export const styles = {
  floatingActionsContainer: css`
    position: absolute;
    top: 100px;
    width: 100%;
    flex-direction: row;
    justify-content: center;
  `,
  floatingButton: css`
    background-color: ${COLOR.PURPLE};
    padding: 4px 16px;
    border-radius: 24px;
  `,
  floatingButtonText: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.TINY};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  item: css`
    margin-bottom: 16px;
    margin-horizontal: 16px;
  `,
  itemSelectedAndroid: css`
    border: 1px solid ${COLOR.PURPLE};
  `,
  itemSelectedIos: css`
    shadow-color: ${COLOR.PURPLE};
    shadow-offset: 0px 0px;
    shadow-opacity: 0.8;
    shadow-radius: 6px;
  `,
  connectionBanner: css`
    position: absolute;
    top: 50px;
    width: 100%;
    justify-content: center;
  `,
  search: css`
    top: 110px;
  `
};
