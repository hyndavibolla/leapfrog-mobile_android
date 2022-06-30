import { css } from '@emotion/native';
import { COLOR } from '_constants';

export const styles = {
  backButton: css`
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px 2px;
    shadow-opacity: 0.23;
    shadow-radius: 2.62px;
    elevation: 4;
    background-color: ${COLOR.WHITE};
    border-radius: 20px;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
  `
};
