import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../constants';

export const styles = {
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    justify-content: space-between;
    flex-grow: 1;
  `,
  content: css`
    padding: 20px;
    z-index: 1;
  `,
  subtitle: css`
    font-size: ${FONT_SIZE.SMALLER};
    color: ${COLOR.DARK_GRAY};
    margin-top: 20px;
  `,
  fieldContainer: css`
    margin: 24px 0;
    z-index: 5;
  `,
  fieldLabel: css`
    color: ${COLOR.DARK_GRAY};
    margin-left: 8px;
    margin-bottom: 4px;
    font-size: ${FONT_SIZE.TINY};
    font-family: ${FONT_FAMILY.MEDIUM};
  `,
  fieldLabelBlue: css`
    color: ${COLOR.PRIMARY_BLUE};
  `,
  legend: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.PETITE};
    color: ${COLOR.DARK_GRAY};
    margin-top: 20px;
    text-align: center;
  `,
  tcText: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.TINY};
    color: ${COLOR.DARK_GRAY};
    text-align: center;
    margin-top: 20px;
  `,
  tcBtn: css`
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.TINY};
    color: ${COLOR.PRIMARY_BLUE};
    text-align: center;
  `,
  footer: css`
    align-items: center;
    background-color: ${COLOR.WHITE};
    padding-vertical: 20px;
    z-index: -1; // to not show footer over the bottom sheet
  `,
  outerButton: css`
    align-self: center;
    width: 100%;
    padding: 0 40px;
  `,
  innerButton: css`
    padding: 16px 0;
  `,
  buttonText: css`
    font-size: ${FONT_SIZE.SMALL};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  sheetContainer: css`
    margin: -252px -20px 0; // compensating for section horizontal padding and route header
  `
};
