import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    padding: 16px;
    width: 100%;
    flex-direction: row;
  `,
  content: css`
    flex: 1;
    margin-left: 16px;
  `,
  textContainer: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.REGULAR};
  `,
  image: css`
    height: 52px;
    width: 64px;
  `,
  textButton: css`
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.TINY};
    margin-vertical: 12px;
  `,
  numberText: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  innerButton: css`
    padding: 12px 0;
  `,
  buttonText: css`
    font-family: ${FONT_FAMILY.SEMIBOLD};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.REGULAR};
  `,
  button: css`
    width: 200px;
  `
};
