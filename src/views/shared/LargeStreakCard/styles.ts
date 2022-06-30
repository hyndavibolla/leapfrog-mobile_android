import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  shadowContainer: css`
    padding-bottom: 4px;
  `,
  container: css`
    padding: 0;
    border-radius: 8px;
  `,
  content: css`
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    width: 100%;
    padding: 20px;
  `,
  rowContainer: css`
    justify-content: space-between;
    flex-direction: row;
  `,
  completeContent: css`
    background-color: ${COLOR.MEDIUM_GRAY};
  `,
  infoContainer: css`
    flex: 1;
    margin-left: 24px;
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  progressContainer: css`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
  `,
  progressText: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
    font-family: ${FONT_FAMILY.MEDIUM};
  `,
  endedContainer: css`
    margin: 24px 20px 0;
  `,
  completeText: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.PETITE};
    font-family: ${FONT_FAMILY.MEDIUM};
  `,
  iconListContainer: css`
    flex-direction: row;
  `,
  icon: css`
    margin-right: 4px;
  `
};
