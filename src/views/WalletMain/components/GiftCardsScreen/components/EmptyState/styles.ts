import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  emptyStateContainer: css`
    margin-horizontal: 40px;
    margin-top: 8px;
  `,
  emptyStateTitle: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    text-align: center;
    color: ${COLOR.BLACK};
    margin: 20px 24px 12px 24px;
  `,
  emptyStateSubtitle: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    text-align: center;
    color: ${COLOR.DARK_GRAY};
    margin: 0 24px 28px 24px;
  `,
  innerButton: css`
    padding: 16px 0;
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.REGULAR};
  `,
  emptyStateBtn: css`
    margin-bottom: 32px;
  `,
  emptyStateIconsContainer: css`
    justify-content: center;
    flex-direction: row;
  `,
  iconContainer: css`
    border-radius: 50px;
    height: 60px;
    width: 60px;
    justify-content: center;
    align-items: center;
  `,
  iconContainerLeft: css`
    background-color: ${COLOR.PRIMARY_BLUE};
    left: 11px;
  `,
  iconContainerRight: css`
    background-color: ${COLOR.PINK};
    right: 11px;
  `
};
