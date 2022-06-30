import { css } from '@emotion/native';

import { FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    align-items: center;
    flex-direction: row;
  `,
  textContainer: css`
    margin-left: 8px;
  `,
  emptyStateIcon: css`
    border: 1.5px solid #979797;
    border-radius: 10px;
    width: ${FONT_SIZE.REGULAR};
    height: ${FONT_SIZE.REGULAR};
  `,
  selectedStateIcon: css`
    border: 0.5px solid #979797;
    border-radius: 10px;
    width: ${FONT_SIZE.REGULAR};
    height: ${FONT_SIZE.REGULAR};
  `,
  emptySquareStateIcon: css`
    border: 1.5px solid #979797;
    border-radius: 4px;
    width: ${FONT_SIZE.REGULAR};
    height: ${FONT_SIZE.REGULAR};
  `,
  selectedSquareStateIcon: css`
    border: 0.5px solid #979797;
    border-radius: 4px;
    width: ${FONT_SIZE.REGULAR};
    height: ${FONT_SIZE.REGULAR};
  `
};
