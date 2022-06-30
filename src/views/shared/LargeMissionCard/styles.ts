import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '../../../constants';

export const styles = {
  shadowContainer: css`
    padding-bottom: 4px;
  `,
  cardContainer: css`
    padding: 0;
    border-radius: 8px;
  `,
  fullSize: css`
    width: 100%;
  `,
  containerGeneral: css`
    justify-content: space-between;
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    width: 335px;
    min-height: 230px;
  `,
  mainImageContainer: css`
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    width: 100%;
    height: 120px;
    background-color: ${COLOR.GRAY};
  `,
  mainImage: css`
    height: 120px;
  `,
  content: css`
    background-color: ${COLOR.WHITE};
    padding: 20px;
    border-radius: 8px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  `,
  logoImage: css`
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background-color: ${COLOR.GRAY};
  `,
  infoSection: css`
    justify-content: space-between;
    align-items: flex-start;
    padding-left: 20px;
    flex: 1;
  `,
  subtitle: css`
    color: ${COLOR.DARK_GRAY};
    text-transform: uppercase;
    font-size: ${FONT_SIZE.PETITE};
  `,
  title: css`
    width: 100%;
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALL};
    padding-vertical: 4px;
  `
};
