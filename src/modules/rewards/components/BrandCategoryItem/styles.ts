import { css } from '@emotion/native';

import { COLOR, CONTAINER_STYLE } from '_constants';

export const styles = {
  cardContainer: css`
    height: 100px;
    width: 158px;
    margin-left: 16px;
    margin-vertical: 8px;
    border-radius: 8px;
  `,
  simpleCard: css`
    ${CONTAINER_STYLE.shadow}
    background-color: ${COLOR.WHITE};
    justify-content: center;
    align-items: center;
  `
};
