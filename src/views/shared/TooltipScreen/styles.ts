import { css } from '@emotion/native';
import { COLOR, FONT_SIZE, FONT_FAMILY } from '../../../constants';

export const styles = {
  container: css`
    justify-content: space-between;
    align-items: center;
    background-color: ${COLOR.WHITE};
  `,
  infoContainer: css`
    width: 100%;
    padding: 8%;
  `,
  title: css`
    margin-top: 20px;
    font-family: ${FONT_FAMILY.HEAVY};
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.BIG};
    line-height: 34px;
  `,
  subtitle: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.TINY};
  `,
  text: css`
    margin-top: 24px;
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: 25px;
  `,
  closeBtn: css`
    align-self: flex-end;
    margin: 32px;
  `,
  closeBtnInnerContainer: css`
    width: 30px;
    height: 30px;
  `,
  closeIconContainer: css`
    width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
  `,
  nextBtnInnerContainer: css`
    width: 64px;
    height: 64px;
    border-radius: 32px;
  `,
  progressContainer: css`
    position: relative;
    height: 85px;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
    margin-top: 8px;
  `,
  progressRing: css`
    position: absolute;
  `
};
