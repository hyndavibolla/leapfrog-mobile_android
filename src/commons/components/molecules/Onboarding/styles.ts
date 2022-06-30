import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  onboardingContainer: css`
    background-color: ${COLOR.WHITE};
    flex: 1;
  `,
  stepContainer: css`
    flex: 1;
    justify-content: space-between;
  `,
  lottieContainer: css`
    height: 350px;
    justify-content: center;
    align-items: center;
    flex: 1;
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.REGULAR};
    line-height: 28px;
    font-weight: bold;
    margin-bottom: 8px;
  `,
  subtitle: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.TINY};
    margin-bottom: 16px;
    text-transform: uppercase;
  `,
  description: css`
    flex-direction: row;
    margin-bottom: 40px;
  `,
  descriptionText: css`
    font-size: ${FONT_SIZE.SMALL};
    line-height: 28px;
  `,
  bottomDrawer: css`
    background-color: ${COLOR.WHITE};
    padding: 24px 24px 0;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  `,
  topContainer: css`
    position: absolute;
    width: 100%;
    z-index: 100;
    padding: 0 24px;
    align-items: flex-end;
    top: 32px;
  `,
  skipButton: css`
    margin-top: 24px;
  `,
  skipButtonText: css`
    color: ${COLOR.BLACK};
    font-weight: bold;
  `,
  bottomContainer: css`
    position: static;
    bottom: 8px;
    left: 0;
    right: 0;
    padding: 0 24px 24px;
  `,
  mainButton: css`
    height: 56px;
    border-radius: 30px;
    background-color: ${COLOR.PRIMARY_BLUE};
    justify-content: center;
    align-items: center;
    margin-top: 28px;
  `,
  mainButtonText: css`
    color: ${COLOR.WHITE};
    font-size: 16px;
    font-weight: bold;
  `,
  positionIndicatorContainer: css`
    flex-direction: row;
  `,
  positionIndicator: css`
    width: 8px;
    height: 8px;
    margin-right: 6px;
    border-radius: 4px;
  `
};
