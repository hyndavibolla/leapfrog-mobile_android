import { css } from '@emotion/native';

import { COLOR } from '../../../../constants';

export const styles = {
  container: css`
    background-color: ${COLOR.MEDIUM_GRAY};
    padding: 35px 25px;
    border-radius: 8px;
    flex-direction: row;
    justify-content: center;
    align-item: center;
    margin-top: 30px;
  `,
  iconSection: css`
    flex: 1;
    margin-right: 15px;
  `,
  textSection: css`
    flex: 3;
  `
};
