import { css } from '@emotion/native';
import { COLOR } from '../../constants';

export const styles = {
  spinnerContainer: css`
    position: absolute;
    flex: 1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    background-color: ${COLOR.LIGHT_GRAY};
  `
};
