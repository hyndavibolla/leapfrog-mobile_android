import { css } from '@emotion/native';

import { COLOR } from '_constants';

export const styles = {
  container: css`
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 214px;
  `,
  mainImage: css`
    width: 100%;
    height: 184px;
    background-color: ${COLOR.GRAY};
    resize-mode: contain;
  `
};
