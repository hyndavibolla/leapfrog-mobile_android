import { css } from '@emotion/native';
import { COLOR } from '_constants';

export const styles = {
  container: css`
    color: ${COLOR.MEDIUM_GRAY};
    height: 108px;
    border-radius: 8px;
  `,
  list: css`
    flex-direction: row;
    padding: 24px 0 24px 15px;
  `,
  bubble: css`
    margin-right: 16px;
  `
};
