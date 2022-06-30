import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  description: css`
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.MEDIUM};
    font-family: ${FONT_FAMILY.MEDIUM};
    color: ${COLOR.DARK_GRAY};
  `,
  descriptionContainer: css`
    padding: 20px;
    border-bottom-color: ${COLOR.MEDIUM_GRAY};
    border-bottom-width: 1px;
    border-style: solid;
  `,
  detailSection: css`
    flex-direction: row;
    border-top-color: ${COLOR.MEDIUM_GRAY};
    border-top-width: 1px;
    border-style: solid;
  `,
  showMoreDescription: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.MEDIUM};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  descriptionDirection: css`
    flex-direction: column;
  `
};
