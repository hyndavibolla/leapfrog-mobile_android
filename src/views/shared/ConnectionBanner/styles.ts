import { css } from '@emotion/native';
import { COLOR, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    flex-direction: row;
    background-color: ${COLOR.ORANGE};
    padding: 8px 16px;
    align-items: center;
  `,
  title: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.SMALL};
  `,
  icon: css`
    margin-right: 8px;
  `
};
