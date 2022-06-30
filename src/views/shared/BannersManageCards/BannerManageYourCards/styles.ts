import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../../constants';

export const styles = {
  container: css`
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    flex-direction: row;
    padding: 20px;
    width: 100%;
  `,
  imageContainer: css`
    border-radius: 50px;
    align-self: flex-start;
    margin-right: 20px;
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
  `,
  textContent: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.MEDIUM};
  `,
  infoContainer: css`
    flex: 1;
  `,
  button: css`
    flex-direction: row;
    margin-top: 4px;
  `,
  textButton: css`
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.SMALL};
    margin-right: 4px;
  `
};
