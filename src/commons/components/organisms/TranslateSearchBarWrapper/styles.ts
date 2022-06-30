import { css } from '@emotion/native';
import { COLOR } from '_constants/styles';

export const styles = {
  container: css`
    background-color: ${COLOR.PRIMARY_BLUE};
    position: absolute;
    padding: 8px 16px 8px;
    width: 100%;
    z-index: 1;
  `
};
