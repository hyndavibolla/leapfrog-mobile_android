import { css } from '@emotion/native';
import { COLOR, FONT_SIZE, LINE_HEIGHT, FONT_FAMILY } from '_constants';

export const styles = {
  container: css`
    height: 40px;
    background-color: ${COLOR.PRIMARY_BLUE};
    margin: 0 16px 32px 16px;
    padding: 8px 16px;
    border-radius: 8px;
  `,
  itemContainer: css`
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    margin-bottom: 16px;
  `,
  text: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.SMALL};
    line-height: ${LINE_HEIGHT.MEDIUM};
    font-family: ${FONT_FAMILY.MEDIUM};
  `,
  profileIcon: css`
    width: 24px;
    height: 24px;
  `
};
