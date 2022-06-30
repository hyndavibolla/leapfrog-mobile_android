import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    flex-direction: row;
    background-color: ${COLOR.MEDIUM_GRAY};
    border-color: ${COLOR.MEDIUM_GRAY};
    border-style: solid;
    border-width: 2px;
    border-radius: 10px;
    padding: 4px 20px 4px 8px;
    width: 100%;
  `,
  selected: css`
    border-color: ${COLOR.PRIMARY_BLUE};
  `,
  mainContainer: css`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 1;
  `,
  image: css`
    height: 50px;
    width: 50px;
    resize-mode: contain;
    margin-right: 8px;
  `,
  fallbackStyle: css`
    height: 15px;
    width: 20px;
    resize-mode: contain;
    margin: 16px 24px 16px 16px;
  `,
  text: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALL};
    flex: 1;
  `,
  selectedText: css`
    color: ${COLOR.PRIMARY_BLUE};
  `,
  categoryContainer: css`
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  `
};
