import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '_constants';

export const styles = {
  cardContainer: css`
    padding: 20px;
    border-radius: 8px;
    background-color: ${COLOR.WHITE};
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-vertical: 8px;
    margin-horizontal: 16px;
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
  `,
  missionText: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.TINY};
  `
};
