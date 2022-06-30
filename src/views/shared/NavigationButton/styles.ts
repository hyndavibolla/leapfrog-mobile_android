import { css } from '@emotion/native';
import { COLOR, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    align-self: flex-start;
  `,
  buttonContainer: css`
    width: 75px;
    height: 75px;
    align-items: center;
    justify-content: center;
  `,
  active: css`
    fill: ${COLOR.PRIMARY_BLUE};
  `,
  title: css`
    opacity: 0.5;
    margin-top: 8px;
    font-size: ${FONT_SIZE.TINY};
    color: ${COLOR.DARK_GRAY};
  `,
  textActive: css`
    color: ${COLOR.PRIMARY_BLUE};
  `
};
