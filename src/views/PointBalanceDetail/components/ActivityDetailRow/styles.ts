import { css } from '@emotion/native';
import { COLOR, FONT_SIZE, FONT_FAMILY } from '../../../../constants';

export const styles = {
  infoRow: css`
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-horizontal: 24px;
    padding-vertical: 4px;
  `,
  iconContainer: css`
    margin-right: 16px;
  `,
  dividerContainer: css`
    padding-vertical: 0;
  `,
  infoTitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.TINY};
    line-height: 18px;
  `,
  infoText: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
    line-height: 26px;
  `
};
