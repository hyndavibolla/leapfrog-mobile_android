import { css } from '@emotion/native';

import { COLOR } from '_constants';

export const styles = {
  cardInfoContent: css`
    flex-direction: row;
    justify-content: space-between;
    padding: 8px 20px;
    border-top-width: 1px;
    border-top-color: ${COLOR.GRAY};
  `
};
