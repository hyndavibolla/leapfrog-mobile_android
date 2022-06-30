import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    width: 255px;
    height: 100px;
    margin: 8px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${COLOR.WHITE};
  `,
  verticalContainer: css`
    width: 105px;
    height: 155px;
    flex-direction: column;
  `,
  content: css`
    background-color: ${COLOR.WHITE};
    justify-content: flex-start;
  `,
  missionDetails: css`
    flex: 1;
  `,
  horizontalMissionDetails: css`
    margin-left: 20px;
  `,
  brandName: css`
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.BLACK};
  `,
  missionName: css`
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.BLACK};
  `,
  pointContainer: css`
    margin-top: 8px;
    flex-direction: row;
    align-items: center;
  `,
  verticalPointContainer: css`
    flex-direction: column;
  `,
  logoImage: css`
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background-color: ${COLOR.GRAY};
  `,
  perDollarText: css`
    font-size: ${FONT_SIZE.TINY};
    color: ${COLOR.DARK_GRAY};
  `,
  horizontalPillContainer: css`
    margin-right: 8px;
  `,
  verticalPillContainer: css`
    margin-bottom: 8px;
  `
};
