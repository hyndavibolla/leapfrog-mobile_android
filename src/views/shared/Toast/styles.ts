import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '../../../constants';

export const styles = {
  info: css`
    background-color: ${COLOR.PRIMARY_BLUE};
  `,
  success: css`
    background-color: ${COLOR.GREEN};
  `,
  warning: css`
    background-color: ${COLOR.ORANGE};
  `,
  error: css`
    background-color: ${COLOR.RED};
  `,
  container: css`
    left: 0;
    right: 0;
    position: absolute;
    align-items: center;
    z-index: 900;
  `,
  innerContainer: css`
    flex-direction: row;
    flex: 1;
    align-items: center;
    justify-content: space-between;
  `,
  textContainer: css`
    flex-direction: row;
    align-items: center;
    max-width: 85%;
    flex: 1;
  `,
  exclamationIcon: css`
    margin-right: 8px;
  `,
  closeIcon: css`
    margin-left: 8px;
  `,
  closeIconContainer: css`
    width: 50px;
    height: 50px;
    justify-content: center;
    align-items: center;
  `,
  toast: css`
    width: 93%;
    padding: 12px 20px;
    border-radius: 5px;
    background-color: ${COLOR.RED};
    color: ${COLOR.WHITE};
  `,
  textWhite: css`
    color: ${COLOR.WHITE};
  `,

  textBlack: css`
    color: ${COLOR.BLACK};
  `,
  title: css`
    font-size: ${FONT_SIZE.SMALL};
    padding-bottom: 4px;
  `,
  description: css`
    font-size: ${FONT_SIZE.SMALLER};
  `
};
