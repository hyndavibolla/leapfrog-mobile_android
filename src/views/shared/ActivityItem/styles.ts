import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    margin-vertical: 4px;
    background: ${COLOR.LIGHT_GRAY};
    padding: 16px 20px;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    border-radius: 8px;
    width: 100%;
  `,
  rightColumn: css`
    margin-horizontal: 16px;
    flex-direction: column;
    align-items: stretch;
    flex: 1;
  `,
  titleContainer: css`
    flex-direction: row;
    justify-content: flex-start;
  `,
  subtitleContainer: css``,
  stateLabel: css`
    font-size: ${FONT_SIZE.TINY};
    color: ${COLOR.WHITE};
  `,
  stateContainer: css`
    align-self: flex-start;
    border-radius: 5px;
    padding: 4px 8px;
  `,
  expiredState: css`
    background: ${COLOR.ORANGE};
  `,
  returnedState: css`
    background: ${COLOR.ORANGE};
  `,
  title: css`
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: 20px;
    flex-shrink: 4;
  `,
  subtitle: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
    flex-shrink: 1;
    line-height: 18px;
  `,
  pill: css`
    background-color: ${COLOR.LIGHT_GRAY};
    padding: 0 16px;
  `,
  logo: css`
    width: 40px;
    height: 40px;
    border-radius: 40px;
  `
};
