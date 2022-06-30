import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '../../../constants/styles';

export const styles = {
  containerGeneral: css`
    flex-direction: column;
    justify-content: space-between;
    background-color: ${COLOR.WHITE};
    padding: 0;
  `,
  backgroundContainer: css`
    background-color: transparent;
    height: 72px;
    width: 100%;
  `,
  gradient: css`
    bottom: 0;
    width: 100%;
    height: 72px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 4px;
  `,
  containerPoints: css`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 12px 16px 20px 20px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  `,
  containerAvailable: css`
    flex-direction: column;
    justify-content: space-between;
  `,
  containerPending: css`
    flex-direction: column;
    justify-content: space-between;
  `,
  containerPendingTitle: css`
    flex-direction: row;
    align-items: center;
  `,
  eachPointsContainer: css`
    flex-direction: row;
    align-items: center;
  `,
  icon: css`
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    margin-right: 4px;
  `,
  textTitle: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.TINY};
    text-transform: uppercase;
  `,
  textPoints: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.BIG};
    line-height: 28px;
  `,
  containerMember: css`
    background-color: ${COLOR.WHITE};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  `,
  containerBarcode: css`
    flex-direction: row;
    align-items: center;
  `,
  textMember: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
    text-transform: uppercase;
    margin-left: 8px;
  `,
  pointsContainer: css`
    flex-direction: row;
    align-items: center;
  `,
  buttonIcon: css`
    margin-right: 4px;
  `
};
