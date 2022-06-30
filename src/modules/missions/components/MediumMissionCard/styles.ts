import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '_constants';

export const styles = {
  cardContainer: css`
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    width: 160px;
    height: 200px;
    justify-content: flex-start;
    padding: 0;
    margin: 8px;
    overflow: hidden;
  `,
  backgroundContainer: css`
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    height: 80px;
    background-color: ${COLOR.GRAY};
    overflow: hidden;
  `,
  logoContainer: css`
    position: absolute;
    align-self: center;
    margin-top: 45px;
    border: 5px solid ${COLOR.WHITE};
    border-radius: 60px;
  `,
  logoImage: css`
    width: 60px;
    height: 60px;
    border-radius: 60px;
    background-color: ${COLOR.DARK_GRAY};
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALL};
    text-align: center;
    justify-content: center;
  `,
  infoContainer: css`
    padding: 40px 10px 10px 10px;
    flex: 1;
    align-items: center;
    justify-content: space-around;
  `,
  pill: css`
    align-self: center;
  `,
  missionOfferContainer: css`
    background-color: ${COLOR.PRIMARY_BLUE};
    width: 100%;
    height: 24px;
    position: absolute;
    top: 0;
    left: 0;
  `,
  missionOfferText: css`
    font-size: ${FONT_SIZE.TINY};
    color: ${COLOR.WHITE};
    text-align: center;
  `
};
