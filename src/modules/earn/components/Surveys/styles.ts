import { css } from '@emotion/native';

import { COLOR } from '_constants';

export const styles = {
  sectionMain: css`
    padding-horizontal: 16px;
    padding-bottom: 24px;
  `,
  surveySectionHeader: css`
    padding-bottom: 16px;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
  `,
  link: css`
    color: ${COLOR.PRIMARY_BLUE};
  `
};
