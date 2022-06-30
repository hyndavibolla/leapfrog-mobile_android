import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '../../../constants';

export const styles = {
  shadowContainer: css`
    padding: 4px;
  `,
  container: css`
    height: 90px;
    padding: 20px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${COLOR.WHITE};
  `,
  verticalContainer: css`
    width: 150px;
    height: 175px;
    padding: 24px 16px;
    flex-direction: column;
  `,
  giftDetails: css`
    flex: 1;
    justify-content: center;
  `,
  horizontalGiftDetails: css`
    margin-left: 20px;
  `,
  verticalGiftDetails: css`
    margin-top: 20px;
  `,
  brandName: css`
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.BLACK};
  `,
  brandNameVertical: css`
    text-align: center;
  `,
  logoImage: css`
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background-color: ${COLOR.GRAY};
  `
};
