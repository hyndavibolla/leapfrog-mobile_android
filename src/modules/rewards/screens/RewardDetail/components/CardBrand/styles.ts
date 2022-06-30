import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants/styles';

export const styles = {
  container: css`
    width: 252px;
    height: 192px;
    align-self: center;
    border-radius: 16px;
    background-color: ${COLOR.WHITE};
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 2.62px;
    elevation: 1;
    overflow: hidden;
  `,
  imageBackground: css`
    height: 164px;
    overflow: hidden;
    transform: translateY(-4px);
  `,
  logo: css`
    align-self: center;
    top: 48px;
  `,
  footer: css`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: ${COLOR.WHITE};
    padding: 0px 12px;
    height: 48px;
    width: 100%;
    position: absolute;
    bottom: 0;
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px -1px;
    shadow-opacity: 0.1;
    elevation: 1;
  `,
  brandName: css`
    flex: 1;
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.BLACK};
  `,
  cardValue: css`
    margin-left: 16px;
    font-size: ${FONT_SIZE.PETITE};
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.BLACK};
  `
};
