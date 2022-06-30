import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '../../../constants';

export const styles = {
  envBanner: css`
    padding: 8px 4px 4px;
    background: ${COLOR.PRIMARY_BLUE};
  `,
  envBannerOverride: css`
    background: ${COLOR.RED};
  `,
  envBannerTextContainer: css`
    justify-content: space-between;
    align-items: center;
    align-self: center;
    flex-direction: row;
  `,
  envBannerText: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.TINY};
  `,
  memberNumber: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.EXTRA_TINY};
  `
};
