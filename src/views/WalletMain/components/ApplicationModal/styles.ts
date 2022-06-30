import { css } from '@emotion/native';

import { FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  modalContainer: css`
    align-items: center;
    justify-content: space-around;
    width: 100%;
  `,
  imageContainer: css`
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  plusContainer: css`
    height: 60px;
    align-items: center;
    margin-horizontal: 16px;
  `,
  plus: css`
    font-size: ${FONT_SIZE.HUGER};
  `,
  checkContainer: css`
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
  `,
  modalSubtitleContainer: css`
    padding: 0 8px;
  `,
  innerButton: css`
    padding: 16px 0;
    height: 50px;
    width: 295px;
    margin-top: 20px;
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  cardImage: css`
    width: 72px;
    height: 47px;
    border-radius: 4px;
  `
};
