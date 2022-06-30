import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  listContainer: css`
    padding-top: 4px;
  `,
  button: css`
    padding: 16px 52px;
    margin-bottom: 8px;
  `,
  buttonContainer: css`
    align-items: center;
    margin: 16px 0 32px;
  `,
  loadingContainer: css`
    margin: 16px 0 32px;
  `,
  textButton: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
    text-align: center;
  `,
  locationFallbackContainer: css`
    flex: 2;
    padding-top: 0;
    margin-top: 0;
  `,
  locationFallbackSmallContainer: css`
    flex: 1;
    align-items: center;
    margin-top: 12px;
  `,
  locationButtonContainer: css`
    width: 295px;
    height: 50px;
    background-color: ${COLOR.PRIMARY_BLUE};
    border-radius: 30px;
  `,
  noteStyle: css`
    margin-top: 4px;
  `,
  descriptionStyle: css`
    margin-top: 12px;
  `,
  noLoadingMore: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    text-align: center;
    padding: 48px 20% 56px;
  `
};
