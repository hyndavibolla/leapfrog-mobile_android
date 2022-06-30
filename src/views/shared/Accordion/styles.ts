import { css } from '@emotion/native';

import { FONT_SIZE, COLOR } from '../../../constants';

export const styles = {
  container: css`
    flex-direction: column;
    width: 100%;
  `,
  paddingDefaultContainer: css`
    padding-horizontal: 8px;
  `,
  titleContainer: css`
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  `,
  textContainer: css`
    margin-top: 16px;
    flex-direction: row;
    width: 100%;
    overflow: hidden;
  `,
  text: css`
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.DARK_GRAY};
    line-height: 28px;
    text-align: left;
  `,
  hidden: css`
    height: 0;
    margin-top: 0;
  `
};
