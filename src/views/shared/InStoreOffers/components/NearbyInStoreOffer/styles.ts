import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../../../constants';

export const styles = {
  container: css`
    align-items: center;
    justify-content: space-between;
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    flex-direction: row;
    padding: 8px 16px;
    height: 75px;
  `,
  imageContainer: css`
    border-radius: 50px;
    align-self: flex-start;
    margin-right: 8px;
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
  `,
  subtitle: css`
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.TINY};
    line-height: ${FONT_SIZE.BIG};
    margin-left: 4px;
  `,
  milesAway: css`
    background-color: ${COLOR.SOFT_PURPLE};
    border-radius: 3px;
    padding: 0 4px;
  `,
  textMilesAway: css`
    color: ${COLOR.DARK_GRAY};
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.TINY};
    line-height: ${FONT_SIZE.SMALL};
  `,
  textMilesAwayActive: css`
    color: ${COLOR.PURPLE};
  `,
  contentContainer: css`
    flex-direction: row;
    width: 50%;
    align-items: center;
    padding-right: 8px;
  `,
  milesAwayContainer: css`
    width: 50%;
    align-items: flex-end;
  `,
  streetContainer: css`
    flex-direction: row;
    align-items: center;
  `
};
