import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    flex: 1;
    margin-bottom: -60px;
  `,
  icon: css`
    align-self: center;
  `,
  movingIcon: css`
    width: 100%;
    height: 100%;
  `,
  label: css`
    margin-top: 16px;
    font-family: ${FONT_FAMILY.HEAVY};
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.REGULAR};
    line-height: 30px;
    text-align: center;
  `,
  activityList: css`
    margin: 44px 0;
  `,
  footer: css`
    padding: 20px 40px 32px 40px;
  `,
  button: css`
    padding: 12px 0;
  `,
  buttonText: css`
    font-size: ${FONT_SIZE.PETITE};
  `,
  animationContainer: css`
    background-color: ${COLOR.WHITE};
    border-radius: 50px;
    position: absolute;
    right: 30px;
    z-index: 99999;
    opacity: 0;
  `
};
