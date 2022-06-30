import { css } from '@emotion/native';

import { COLOR } from '_constants';

export const styles = {
  containerGeneral: css`
    flex-direction: column;
    justify-content: space-between;
    border-radius: 8px;
    padding-vertical: 16px;
  `,
  separator: css`
    border-bottom-color: ${COLOR.MEDIUM_GRAY};
    border-bottom-width: 1px;
  `
};
