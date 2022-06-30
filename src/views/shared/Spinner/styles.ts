import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    flex: 1;
    padding: 16px;
    width: 100%;
  `,
  centerContainer: css`
    flex: 1;
    align-items: center;
    justify-content: center;
  `,
  textContainer: css`
    margin-top: 16px;
    min-height: 55px;
  `,
  text: css`
    text-align: center;
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.SMALL};
  `,
  footerContainer: css`
    align-items: center;
    padding: 16px;
  `,
  textFooter: css`
    padding: 8px 20px;
    text-align: center;
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
  `
};
