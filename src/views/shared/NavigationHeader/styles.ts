import { css } from '@emotion/native';
import { COLOR, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    flex-direction: row;
    padding-horizontal: 20px;
    justify-content: space-between;
    align-items: center;
    height: 104px;
    padding-top: 44px;
  `,
  shadow: css`
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.1;
    elevation: 3;
  `,
  transparentContainer: css`
    background-color: none;
  `,
  coloredContainer: css`
    background-color: ${COLOR.WHITE};
  `,
  searchBarColored: css`
    background-color: ${COLOR.PRIMARY_BLUE};
  `,
  title: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.SMALLER};
    text-transform: uppercase;
    text-align: center;
  `,
  tinyAvatar: css`
    width: 40px;
    height: 40px;
    border-radius: 50px;
    align-self: flex-end;
  `,
  backBtn: css`
    padding: 0;
  `,
  closeBtn: css`
    position: absolute;
    right: 20px;
    bottom: 17px;
    justify-content: center;
    align-items: center;
  `,
  safeArea: css`
    background-color: ${COLOR.WHITE};
  `,
  centerContainer: css`
    flex: 1;
    padding-horizontal: 16px;
  `,
  removeRightPadding: css`
    padding-right: 0;
  `
};
