import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '../../../constants';

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
  `,
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    padding: 16px;
    flex: 1;
    justify-content: center;
    align-items: center;
  `,
  textContainer: css`
    margin-top: 40px;
    align-items: center;
  `,
  title: css`
    font-size: ${FONT_SIZE.REGULAR};
    margin-bottom: 8px;
    text-align: center;
  `,
  text: css`
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.DARK_GRAY};
    text-align: center;
  `
};
