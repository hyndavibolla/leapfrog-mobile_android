import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  card: css`
    background: ${COLOR.WHITE};
    border-radius: 8px;
    padding: 12px;
    flex-direction: row;
    margin-bottom: 16px;
    margin-horizontal: 16px;
  `,
  cardContent: css`
    flex: 1;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 16px;
  `,
  cardTitle: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.SMALL};
    font-family: ${FONT_FAMILY.SEMIBOLD};
  `,
  cardValue: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.SMALL};
    font-family: ${FONT_FAMILY.SEMIBOLD};
  `,
  cardValueDate: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.TINY};
    line-height: ${FONT_SIZE.PETITE};
  `,
  cardValueDateDays: css`
    font-family: ${FONT_FAMILY.SEMIBOLD};
  `,
  faceplateImage: css`
    height: 68px;
    width: 104px;
    border-radius: 8px;
    overflow: hidden;
  `,
  logoContainer: css`
    height: 68px;
    width: 104px;
    border-radius: 8px;
    background-color: ${COLOR.WHITE};
    justify-content: center;
    align-items: center;
  `,
  logo: css`
    width: 40px;
    height: 40px;
    border-radius: 40px;
  `
};
