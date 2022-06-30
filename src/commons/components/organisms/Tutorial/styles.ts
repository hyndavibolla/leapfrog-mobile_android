import { css } from '@emotion/native';
import { COLOR, colorWithOpacity, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  facade: css`
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: ${colorWithOpacity(COLOR.BLACK, 50)};
  `,
  facadeComponent: css`
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: ${COLOR.TRANSPARENT};
  `,
  footer: css`
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 4;
    background-color: ${COLOR.WHITE};
    padding-top: 28px;
    padding-bottom: 40px;
    border-radius: 20px 20px 0px 0px;
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px -8px;
    shadow-opacity: 0.1;
    elevation: 24;
  `,
  container: css`
    position: absolute;
    width: 100%;
    z-index: 2;
    top: 0;
    left: 0;
  `,
  banner: css`
    opacity: 0;
  `,
  stepsContainer: css`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 28px 24px 0 24px;
  `,
  steps: css`
    flex-direction: row;
  `,
  indicator: css`
    margin-right: 4px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: ${COLOR.MEDIUM_GRAY};
  `,
  selected: css`
    background-color: ${COLOR.PRIMARY_BLUE};
  `,
  button: css`
    width: 200px;
    border-radius: 25px;
  `,
  buttonInner: css`
    padding: 16px 0;
  `,
  buttonText: css`
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  skip: css`
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 64px 8px 16px;
    position: relative;
    z-index: 2;
  `,
  skipButton: css`
    width: 56px;
    height: 28px;
    padding: 0;
    z-index: 2;
  `,
  skipButtonBody: css`
    margin-top: 8px;
    align-self: center;
  `,
  pointPill: css`
    background-color: red;
  `
};
