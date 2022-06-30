import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../../constants';

export const styles = {
  container: css`
    margin-top: 8px;
  `,
  title: css`
    margin-bottom: 20px;
  `,
  footerContainer: css`
    align-items: center;
    margin: 16px;
  `,
  fallBack: css`
    justify-content: center;
    align-items: center;
    margin-top: 16px;
  `,
  titleFallback: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
    font-family: ${FONT_FAMILY.BOLD};
    margin: 32px 36px 0;
    text-align: center;
  `,
  descriptionFallback: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.MEDIUM};
    font-family: ${FONT_FAMILY.MEDIUM};
    text-align: center;
    margin: 16px 36px 0;
  `,
  actionFallback: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.BOLD};
    margin-top: 20px;
    margin-bottom: 48px;
  `,
  titleContainer: css`
    flex-direction: row;
    justify-content: space-between;
    margin: 0 16px;
  `,
  link: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALL};
    color: ${COLOR.PRIMARY_BLUE};
  `,
  innerButton: css`
    padding: 16px 0;
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.REGULAR};
  `,
  emptyStateBtn: css`
    width: 294px;
  `
};
