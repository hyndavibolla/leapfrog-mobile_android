import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css``,
  innerContainer: css`
    padding: 8px 12px;
    background-color: ${COLOR.PRIMARY_BLUE};
    border-radius: 30px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  `,
  childContainerPadding: css`
    margin-left: 8px;
  `,
  text: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.PETITE};
    text-align: center;
  `,
  disabled: css`
    opacity: 0.5;
  `
};
