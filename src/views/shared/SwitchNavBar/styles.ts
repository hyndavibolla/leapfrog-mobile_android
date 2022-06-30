import { css } from '@emotion/native';

import { COLOR, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    align-items: center;
    justify-items: center;
  `,
  invalidContainer: css`
    border: 1px ${COLOR.RED} solid;
    border-radius: 4px;
  `,
  containerSwitch: css`
    flex-direction: row;
    align-items: center;
    justify-items: center;
  `,
  containerOptions: css`
    background-color: ${COLOR.MEDIUM_GRAY};
    flex: 1;
    border-radius: 50px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `,
  toggleContainer: css`
    flex: 1;
    padding: 12px 28px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  toggle: css`
    border-radius: 21px;
  `,
  toggleActive: css`
    background-color: ${COLOR.WHITE};
    position: absolute;
    height: 100%;
  `,
  toggleInactive: css``,
  text: css`
    text-transform: uppercase;
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.TINY};
    letter-spacing: 1px;
    line-height: 14px;
  `,
  containerToggle: css`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `,
  hiddenPill: css`
    width: 0;
    height: 0;
  `,
  altContainer: css`
    background-color: ${COLOR.WHITE};
  `,
  altActivePill: css`
    background-color: ${COLOR.PRIMARY_BLUE};
    border-radius: 8px;
  `,
  altActiveText: css`
    color: ${COLOR.WHITE};
  `,
  altInactiveText: css`
    color: ${COLOR.DARK_GRAY};
  `
};
