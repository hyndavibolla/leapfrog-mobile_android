import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';
import { hexToRgba } from '../../../utils/hexToRgba';

export const styles = {
  backdrop: css`
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${hexToRgba(COLOR.BLACK, 0.45)};
  `,
  backdropContent: css`
    width: 100%;
    height: 100%;
  `,
  container: css`
    background-color: ${COLOR.WHITE};
    position: absolute;
    z-index: 9999;
    bottom: 0;
    align-items: center;
  `,
  containerCenter: css`
    left: 5%;
    width: 90%;
    border-radius: 7px;
  `,
  containerCenterDynamic: css`
    flex: 0;
    height: auto;
    justify-content: center;
    align-items: center;
  `,
  containerBottom: css`
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 60px 20px;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
  `,
  containerBottomFullScreen: css`
    padding: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    height: 100%;
  `,
  innerCloseBtn: css`
    width: 30px;
    height: 30px;
  `,
  closeIconContainer: css`
    width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
  `,
  closeBtnWrapper: css`
    position: absolute;
    right: 30px;
    top: 30px;
    z-index: 1;
  `,
  closeBtnWrapperIOS: css`
    top: 60px;
  `,
  closeBtnWrapperCenter: css`
    top: 20px;
    right: 20px;
  `,
  title: css`
    margin-top: 16px;
    font-family: ${FONT_FAMILY.HEAVY};
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.REGULAR};
    line-height: 30px;
    text-align: center;
  `,
  subtitle: css`
    margin-top: 8px;
    font-family: ${FONT_FAMILY.MEDIUM};
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: 26px;
    text-align: center;
  `
};
