import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../../constants';

export const styles = {
  card: css`
    background: ${COLOR.WHITE};
    border-radius: 8px;
    min-height: 68px;
    padding-horizontal: 16px;
    flex-direction: row;
    align-items: center;
    margin-bottom: 16px;
  `,
  cardContent: css`
    flex: 1;
    margin-left: 16px;
  `,
  cardTitle: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.SMALL};
    font-family: ${FONT_FAMILY.MEDIUM};
  `,
  cardTitleMasterCard: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.BIG};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  image: css`
    height: 30px;
    width: 50px;
    border-radius: 4px;
  `
};
