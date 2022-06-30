import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    margin-vertical: 4px;
    background: ${COLOR.WHITE};
    padding: 16px 20px;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    border-radius: 8px;
  `,
  leftColumn: css`
    margin-horizontal: 16px;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    flex: 1;
  `,
  titleContainer: css`
    flex-direction: row;
    justify-content: flex-start;
  `,
  titlesContainer: css`
    flex-direction: column;
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.PETITE};
    margin-bottom: 4px;
    flex-shrink: 4;
  `,
  subtitle: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
    flex-shrink: 1;
  `,
  logo: css`
    width: 40px;
    height: 40px;
    border-radius: 40px;
  `
};
