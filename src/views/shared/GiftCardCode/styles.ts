import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    align-items: center;
    justify-content: center;
  `,
  fallbackContainer: css`
    align-items: center;
    flex-direction: column;
  `,
  fallbackTitle: css`
    margin-top: 20px;
  `,
  fallbackSubtitle: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.HUGE};
    margin-top: 16px;
    text-align: center;
  `
};
