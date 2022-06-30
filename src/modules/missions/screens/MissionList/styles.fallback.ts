import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '_constants';

export const styles = {
  listContainer: css`
    flex: 1;
  `,
  container: css`
    flex: 1;
    justify-content: space-around;
    padding-vertical: 32px;
  `,
  messageContainer: css`
    justify-content: center;
    align-items: center;
    padding-horizontal: 32px;
    flex: 1;
  `,
  title: css`
    margin-top: 24px;
    text-align: center;
    font-size: ${FONT_SIZE.SMALLER};
  `,
  text: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    text-align: center;
    margin-top: 16px;
  `,
  iconInnerBackground: css`
    background-color: ${COLOR.WHITE};
    border-radius: ${FONT_SIZE.XXL};
  `,
  footer: css`
    padding-horizontal: 16px;
  `
};
