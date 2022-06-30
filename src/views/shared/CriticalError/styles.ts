import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    padding: 32px;
    flex: 1;
    justify-content: center;
    align-items: center;
  `,
  textContainer: css`
    margin-top: 40px;
    align-items: center;
  `,
  title: css`
    font-size: ${FONT_SIZE.MEDIUM};
    margin-bottom: 32px;
    text-align: center;
    color: ${COLOR.BLACK};
  `,
  text: css`
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.DARK_GRAY};
    text-align: center;
  `,
  button: css`
    margin-top: 40px;
    width: 100%;
    padding: 16px;
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.WHITE};
  `
};
