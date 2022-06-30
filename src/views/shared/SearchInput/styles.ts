import { Platform } from 'react-native';
import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '_constants';

const android = Platform.OS === 'android';

export const styles = {
  container: css`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 40px;
  `,
  searchContainer: css`
    flex-direction: row;
    align-items: center;
    padding-horizontal: 16px;
    border-radius: 25px;
    height: 40px;
    flex: 1;
  `,
  searchInput: css`
    height: 100%;
    width: 100%;
    font-size: ${FONT_SIZE.PETITE};
    color: ${COLOR.BLACK};
  `,
  filterContainer: css`
    margin-left: 16px;
    flex-direction: row;
    border-radius: 25px;
    height: 40px;
    width: 40px;
  `,
  filterContainerActive: css`
    background-color: ${COLOR.BLUE_NAVIGATION};
  `,
  disabled: css`
    background-color: ${COLOR.MEDIUM_GRAY};
  `,
  placeholder: css`
    width: 100%;
    position: absolute;
    left: ${android && '4px'};
    top: ${android ? '8px' : '9px'};
    font-size: ${FONT_SIZE.PETITE};
  `,
  inputContainer: css`
    flex: 1;
    align-items: flex-start;
    justify-content: center;
    margin-horizontal: 8px;
  `
};
