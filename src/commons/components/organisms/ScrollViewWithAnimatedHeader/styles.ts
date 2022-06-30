import { css } from '@emotion/native';
import { COLOR } from '_constants';

export const styles = {
  container: css`
    flex: 1;
    background-color: ${COLOR.WHITE};
  `,
  backBtn: css`
    position: absolute;
    top: 44px;
    left: 18px;
    z-index: 2;
  `,
  floatingComponent: css`
    position: absolute;
    z-index: 2;
  `,
  header: css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: ${COLOR.BLACK};
    overflow: hidden;
    z-index: 1;
  `
};
