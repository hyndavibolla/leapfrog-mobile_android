import { css } from '@emotion/native';

import { COLOR } from '_constants';

export const styles = {
  container: css`
    position: relative;
    z-index: 100;
  `,
  headerTop: css`
    position: relative;
    padding: 8px 16px;
    background-color: ${COLOR.PRIMARY_BLUE};
    flex-direction: row;
    justify-content: space-between;
    z-index: 10;
  `,
  userContainer: css`
    flex-direction: row;
    align-items: center;
    flex: 0 1 auto;
    margin-left: 8px;
  `,
  logoContainer: css`
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex: 1 0 auto;
  `,
  tinyLogo: css`
    width: 40px;
    height: 40px;
    resize-mode: cover;
    border-radius: 50px;
  `,
  userTextContainer: css`
    flex-direction: row;
    align-items: flex-end;
    width: 100%;
    flex-shrink: 1;
  `,
  tutorialVisible: css`
    opacity: 0;
  `
};
