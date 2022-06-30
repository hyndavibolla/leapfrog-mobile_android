import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE, MEASURE } from '../../../constants';

export const styles = {
  container: css`
    padding: 0 ${MEASURE.CARD_PADDING}px 20px;
    width: 100%;
  `,
  switchContainer: css`
    margin: 36px 40px 24px;
  `,
  image: css`
    align-self: center;
    margin: 24px 0;
    width: 120px;
    height: 90px;
  `,
  listContainer: css`
    margin: 20px;
  `,
  listItemContainer: css`
    flex-direction: row;
    align-items: center;
    margin: 20px 32px 4px;
  `,
  icon: css`
    margin-right: 20px;
    width: 42px;
    height: 42px;
  `,
  text: css`
    font-size: ${FONT_SIZE.SMALL};
    line-height: 20px;
  `,
  pointsText: css`
    font-size: ${FONT_SIZE.REGULAR};
  `,
  description: css`
    font-size: ${FONT_SIZE.TINY};
    line-height: 14px;
    margin-right: 32px;
  `,
  textCenter: css`
    text-align: center;
  `,
  percentageText: css`
    color: ${COLOR.PRIMARY_BLUE};
  `,
  percentage: css`
    font-size: ${FONT_SIZE.SMALL};
    line-height: ${FONT_SIZE.SMALL};
  `,
  linkContainer: css`
    align-items: center;
    margin-bottom: 8px;
  `,
  link: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.EXTRA_TINY};
    font-family: ${FONT_FAMILY.SEMIBOLD};
    text-decoration: underline;
    text-decoration-color: ${COLOR.PRIMARY_BLUE};
    margin-bottom: 8px;
  `,
  extraNote: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.EXTRA_TINY};
    margin: 0 24px;
    text-align: center;
  `,
  buttonContainer: css`
    margin: 8px 40px;
  `,
  buttonInner: css`
    padding: 8px 0;
    background-color: ${COLOR.PRIMARY_BLUE};
  `,
  buttonText: css`
    font-size: ${FONT_SIZE.SMALL};
    line-height: 30px;
    font-family: ${FONT_FAMILY.BOLD};
  `
};
