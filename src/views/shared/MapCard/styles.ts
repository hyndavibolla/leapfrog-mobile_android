import { css } from '@emotion/native';

import { FONT_FAMILY, FONT_SIZE, COLOR } from '_constants';

export const styles = {
  title: css`
    margin-bottom: 4px;
    color: ${COLOR.BLACK};
  `,
  subtitle: css`
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.MEDIUM};
    color: ${COLOR.DARK_GRAY};
    margin-top: 4px;
    margin-bottom: 20px;
  `,
  cardContainer: css`
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    height: 121px;
  `,
  image: css`
    margin: 4px;
    flex: 1;
    align-items: center;
    justify-content: center;
  `,
  button: css`
    flex-direction: row;
    align-items: center;
    background-color: ${COLOR.PRIMARY_BLUE};
    padding: 8px 20px;
    border-radius: 100px;
  `,
  buttonText: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.PETITE};
    font-family: ${FONT_FAMILY.BOLD};
    line-height: ${FONT_SIZE.REGULAR};
    margin-left: 8px;
    text-align: center;
  `,
  buttonEditZipCode: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.TINY};
    line-height: ${FONT_SIZE.SMALL};
    margin-top: 16px;
    text-align: right;
  `
};
