import { css } from '@emotion/native';

import { COLOR } from '_constants';

export const styles = {
  container: css`
    width: 100px;
    height: 100px;
    justify-content: center;
    align-items: center;
    background-color: ${COLOR.WHITE};
  `,
  logoContainer: css`
    width: 60px;
    height: 60px;
    border-radius: 60px;
    justify-content: center;
    align-items: center;
  `,
  logo: css`
    width: 100%;
    height: 100%;
  `
};
