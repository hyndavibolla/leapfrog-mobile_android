import { css } from '@emotion/native';

import { COLOR } from '_constants';

export const styles = {
  container: css`
    padding: 16px 20px;
    border-radius: 8px;
    background-color: ${COLOR.WHITE};
  `,
  first: css`
    margin-bottom: 8px;
  `,
  body: css`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  bodyItem: css`
    flex-direction: row;
    align-items: center;
    padding: 4px 0;
  `,
  text: css`
    margin-left: 4px;
    flex-direction: column;
    align-items: center;
  `
};
