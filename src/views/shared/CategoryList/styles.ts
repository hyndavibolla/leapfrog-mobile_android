import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE, MEASURE } from '../../../constants';

export const styles = {
  container: css`
    padding-vertical: ${MEASURE.MODAL_PADDING}px;
    padding-horizontal: 16px;
    flex: 1;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  `,
  categoryContainer: css`
    flex-direction: column;
    justify-content: center;
  `,
  categoryItem: css`
    margin-top: 4px;
  `,
  headerContainer: css`
    padding-top: 8px;
  `,
  title: css`
    text-align: center;
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALLER};
    margin-bottom: 24px;
  `,
  clearBtn: css`
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.PRIMARY_BLUE};
    margin-bottom: 16px;
  `,
  headerTitle: css`
    font-size: 14px;
    font-weight: bold;
    margin-right: 4px;
  `,
  footerContainer: css`
    padding: 20px 32px 0;
    align-items: center;
  `,
  innerButton: css`
    padding: 16px 0;
    height: 50px;
    width: 295px;
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.HEAVY};
  `
};
