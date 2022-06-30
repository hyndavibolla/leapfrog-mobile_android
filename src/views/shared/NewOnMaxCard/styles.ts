import { css } from '@emotion/native';

import { COLOR, FONT_SIZE, FONT_FAMILY } from '../../../constants';

const ICON_SIZE = '40px';

export const styles = {
  container: css`
    height: 148px;
    background-color: ${COLOR.MEDIUM_GRAY};
    border-radius: 8px;
    flex-direction: row;
    padding: 16px 16px 16px 20px;
    margin: 8px;
  `,
  icon: css`
    height: ${ICON_SIZE};
    width: ${ICON_SIZE};
  `,
  contentContainer: css`
    flex: 1;
    padding: 4px 16px 0 20px;
  `,
  title: css`
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.BOLD};
    line-height: ${FONT_SIZE.REGULAR};
    color: ${COLOR.BLACK};
    margin-bottom: 4px;
  `,
  description: css`
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.MEDIUM};
    line-height: ${FONT_SIZE.REGULAR};
    color: ${COLOR.DARK_GRAY};
    margin-bottom: 16px;
  `,
  callToActionContainer: css`
    flex-direction: row;
    align-items: center;
  `,
  callToActionText: css`
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.BOLD};
    line-height: ${FONT_SIZE.SMALLER};
    color: ${COLOR.PRIMARY_BLUE};
    margin-right: 4px;
  `
};
