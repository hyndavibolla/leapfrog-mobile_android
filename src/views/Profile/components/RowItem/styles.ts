import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants/styles';

export const styles = {
  linksCard: css`
    background-color: ${COLOR.WHITE};
    margin-bottom: 8px;
    flex-direction: row;
  `,
  linksText: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.BLACK};
  `,
  iconContainer: css`
    align-items: center;
    justify-content: center;
  `,
  rightContent: css`
    flex-direction: row;
    align-items: center;
  `,
  valueText: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.BIG};
    font-weight: 500;
    color: ${COLOR.DARK_GRAY};
    margin-right: 8px;
  `
};
