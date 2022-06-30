import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  shadowContainer: css`
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px 1px;
    shadow-opacity: 0.2;
    shadow-radius: 12px;
    elevation: 3;
    background-color: transparent;
    position: absolute;
  `,
  container: css`
    background-color: ${COLOR.WHITE};
    height: 100%;
    padding: 16px;
  `,
  btnContainer: css`
    flex-direction: row;
    justify-content: space-between;
  `,
  cancelText: css`
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.DARK_GRAY};
  `,
  confirmText: css`
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.PRIMARY_BLUE};
  `,
  optionText: css`
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.DARK_GRAY};
  `,
  androidPickerContainer: css`
    min-height: 50%;
    justify-content: center;
  `,
  activeOptionText: css`
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.BLACK};
  `
};
