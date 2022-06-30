import { css } from '@emotion/native';

import { COLOR } from '_constants';

export const styles = {
  containerTitle: css`
    padding-bottom: 18px;
    flex-direction: row;
    justify-content: space-between;
  `,
  link: css`
    color: ${COLOR.PRIMARY_BLUE};
  `,
  containerList: css`
    align-self: flex-start;
  `,
  rowContainer: css`
    flex-direction: column;
  `,
  gridRow: css`
    flex-direction: row;
    flex-basis: 1px;
  `,
  activeMissionContainer: css`
    width: 33%;
  `,
  activeMission: css`
    width: 100%;
  `
};
