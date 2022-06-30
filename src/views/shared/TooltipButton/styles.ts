import { css } from '@emotion/native';

import { COLOR } from '_constants';

export const styles = {
  container: css`
    position: relative;
    width: 54px;
    height: 54px;
    justify-content: center;
    align-items: center;
  `,
  flashyContainer: css`
    position: absolute;
    z-index: 1;
    top: 10px;
    left: 10px;
  `,
  inactiveContainer: css`
    margin: 4px;
    align-items: flex-end;
    justify-content: center;
    padding: 4px;
    width: 30px;
    border-radius: 50px;
    background-color: ${COLOR.GRAY};
  `
};
