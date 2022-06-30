import { css } from '@emotion/native';

import { COLOR, FONT_SIZE, FONT_FAMILY } from '../src/constants';

export const styles = {
  container: css`
    padding: 10px;
    background-color: ${COLOR.MEDIUM_GRAY};
    flex: 1;
  `,
  selfishContainer: css`
    flex: 1;
  `,
  subcontainer: css`
    padding-top: 10px;
    padding-bottom: 10px;
  `,
  componentContainer: css`
    padding: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
    background-color: ${COLOR.WHITE};
    align-items: center;
    width: 100%;
  `,
  title: css`
    font-size: ${FONT_SIZE.MEDIUM};
    font-family: ${FONT_FAMILY.BOLD};
    margin-bottom: 5px;
  `,
  subtitle: css`
    font-size: ${FONT_SIZE.SMALL};
    font-family: ${FONT_FAMILY.BOLD};
    margin-bottom: 5px;
  `,
  text: css`
    font-size: ${FONT_SIZE.PETITE};
  `,
  dark: css`
    background-color: ${COLOR.DARK_GRAY};
  `,
  division: css`
    height: 10px;
  `,
  horizontalFlatlistContainer: css`
    padding: -10px;
  `,
  closeIconContainer: css`
    width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
  `
};
