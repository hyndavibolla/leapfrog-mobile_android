import { css } from '@emotion/native';

import { COLOR } from '_constants';

export const styles = {
  markerContainer: css`
    flex: 1;
    justify-content: center;
    align-items: center;
  `,
  marker: css`
    width: 28px;
    height: 28px;
    background-color: ${COLOR.WHITE};
    border-radius: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  markerSelected: css`
    border: 1px solid ${COLOR.PURPLE};
  `,
  image: css`
    width: 20px;
    height: 20px;
  `,
  triangle: css`
    border-style: solid;
    border-top-width: 5px;
    border-right-width: 5px;
    border-left-width: 5px;
    border-bottom-width: 0;
    border-top-color: ${COLOR.WHITE};
    border-right-color: ${COLOR.TRANSPARENT};
    border-bottom-color: ${COLOR.TRANSPARENT};
    border-left-color: ${COLOR.TRANSPARENT};
  `,
  triangleSelected: css`
    border-top-color: ${COLOR.PURPLE};
  `
};
