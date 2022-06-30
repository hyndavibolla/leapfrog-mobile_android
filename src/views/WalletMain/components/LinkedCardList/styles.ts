import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../../constants';

export const styles = {
  banner: css`
    background: ${COLOR.WHITE};
    border-radius: 8px;
    padding: 20px 16px;
    margin-bottom: 8px;
    flex-direction: row;
  `,
  bannerContent: css`
    flex: 1;
    margin-left: 20px;
  `,
  bannerTitle: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    font-family: ${FONT_FAMILY.HEAVY};
  `,
  bannerDescription: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.REGULAR};
    font-family: ${FONT_FAMILY.MEDIUM};
    margin-bottom: 4px;
  `,
  bannerActionsContainer: css`
    flex-direction: row;
    align-items: center;
  `,
  bannerTextAction: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.SMALL};
    font-family: ${FONT_FAMILY.HEAVY};
    margin-right: 8px;
  `,
  footNote: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.TINY};
    line-height: ${FONT_SIZE.SMALL};
    margin-top: 8px;
    text-align: right;
  `,
  cardFootNote: css`
    margin-top: 4px;
    text-align: left;
  `,
  loading: css`
    margin-top: 48px;
  `,
  image: css`
    height: 30px;
    width: 50px;
  `,
  addAnotherCardContainer: css`
    align-items: flex-end;
    margin-bottom: 28px;
  `,
  addAnotherCardText: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.SMALL};
    font-family: ${FONT_FAMILY.BOLD};
  `
};
