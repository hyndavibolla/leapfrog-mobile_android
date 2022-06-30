import { css } from '@emotion/native';

import { COLOR } from '_constants';

export const styles = {
  container: css`
    flex: 1;
    align-items: center;
  `,
  progressRing: css`
    border-radius: 8px;
    background-color: ${COLOR.WHITE};
    transform: rotateZ(270deg);
  `
};
