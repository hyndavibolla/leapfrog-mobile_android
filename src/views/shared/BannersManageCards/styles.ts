import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  title: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    margin-top: 28px;
    margin-bottom: 12px;
    line-height: ${FONT_SIZE.BIG};
  `
};
