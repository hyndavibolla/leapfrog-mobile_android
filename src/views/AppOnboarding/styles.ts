import { FONT_FAMILY, FONT_SIZE } from '_constants/styles';
import { css } from '@emotion/native';

export const styles = {
  descriptionContainer: css`
    margin-top: 24px;
    flex-direction: row;
    align-items: center;
  `,
  customText: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  pillContainer: css`
    height: auto;
    padding: 8px 16px 8px 8px;
    margin-right: 8px;
  `
};
