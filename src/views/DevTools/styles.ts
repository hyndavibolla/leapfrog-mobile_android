import { css } from '@emotion/native';

import { COLOR, FONT_SIZE, MEASURE } from '../../constants';

export const styles = {
  listContainer: css`
    flex: 1;
  `,
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    flex: 1;
    padding: 8px;
  `,
  generalInfoContainer: css`
    margin: 0 4px 4px;
  `,
  navContainer: css`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  navButton: css`
    align-self: center;
  `,
  levelPicker: css`
    height: 70px;
    width: 100px;
    font-size: 10px;
  `,
  levelPickerItem: css`
    font-size: ${FONT_SIZE.SMALL};
    height: 70px;
  `,
  logItemContainer: css`
    margin-bottom: 8px;
    background-color: ${COLOR.WHITE};
    padding: 0;
  `,
  logItemHeader: css`
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: ${COLOR.GRAY};
    padding: 8px 8px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  logItemHeaderText: css`
    font-size: ${FONT_SIZE.TINY};
  `,
  logItemContent: css`
    padding: ${MEASURE.CARD_PADDING}px;
    width: 100%;
  `,
  logItemCopyContainer: css`
    flex-direction: row;
    align-items: center;
  `,
  logItemCopyIcon: css`
    margin-right: 4px;
    background: ${COLOR.WHITE};
    border-radius: 50px;
    width: 30px;
    height: 30px;
    justify-content: center;
    align-items: center;
    border: 1px solid ${COLOR.BLACK};
  `,
  logItemIconText: css`
    text-align: center;
  `,
  textInput: css`
    background-color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.SMALLER};
    padding: 8px 8px;
    border: 1px solid ${COLOR.GRAY};
    color: ${COLOR.BLACK};
    border-radius: 5px;
  `,
  additionalInfo: css`
    font-size: ${FONT_SIZE.TINY};
  `,
  accordionWrapper: css`
    width: 100%;
  `,
  apiOverrideMainConfigContainer: css`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  apiOverrideControlContainer: css`
    flex: 1;
    padding: 4px;
  `,
  apiOverrideItemContainer: css`
    padding: 8px;
  `,
  apiOverrideNavContainer: css`
    flex-direction: row;
    justify-content: space-between;
    padding-vertical: 8px;
    align-items: center;
  `,
  modal: css`
    padding-vertical: 8px;
  `
};
