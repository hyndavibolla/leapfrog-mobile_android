import { css } from '@emotion/native';
import { COLOR, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    align-items: center;
    justify-content: space-between;
    flex: 1;
    padding: 16px;
  `,
  infoContainer: css`
    align-items: center;
    justify-content: center;
    flex: 1;
  `,
  actionContainer: css`
    width: 100%;
    align-items: center;
  `,
  signOutBtn: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.SMALL};
    margin: 20px;
  `,
  titleText: css`
    text-align: center;
    margin-top: 16px;
    color: ${COLOR.BLACK};
  `,
  subtitleText: css`
    text-align: center;
    margin-top: 24px;
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  linkText: css`
    text-align: center;
    margin-top: 4px;
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  lineStyle: css`
    border-bottom-color: ${COLOR.DARK_GRAY};
  `,
  dividerContainer: css`
    width: 100%;
  `
};
