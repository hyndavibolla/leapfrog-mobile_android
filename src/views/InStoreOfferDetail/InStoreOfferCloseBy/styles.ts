import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  titleContent: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
  `,
  headerContainer: css`
    margin-top: 28px;
    margin-bottom: 8px;
    flex-direction: row;
  `,
  viewOnMapButton: css`
    flex-grow: 1;
    align-items: flex-end;
  `,
  viewOnMapButtonText: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
  `,
  nearbyInStoreOffer: css`
    margin: 4px 0;
  `
};
