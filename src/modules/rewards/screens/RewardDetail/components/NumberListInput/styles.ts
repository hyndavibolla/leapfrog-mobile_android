import { css } from '@emotion/native';
import { COLOR, FONT_SIZE, FONT_FAMILY } from '_constants';

export const styles = {
  container: css`
    align-items: center;
  `,
  inputContainer: css`
    width: 100%;
    justify-content: center;
    margin-top: 16px;
  `,
  inputContainerError: css`
    border-color: ${COLOR.ORANGE};
  `,
  currency: css`
    font-size: ${FONT_SIZE.BIGGER};
    font-family: ${FONT_FAMILY.HEAVY};
    color: ${COLOR.BLACK};
    background-color: red;
  `,
  inputTextContainer: css`
    margin: 0 20px;
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    height: 56px;
    padding: 0 44px;
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 2.62px;
    elevation: 1;
  `,
  inputText: css`
    font-size: ${FONT_SIZE.SMALLER};
    font-family: ${FONT_FAMILY.BOLD};
    color: ${COLOR.BLACK};
    letter-spacing: 1px;
  `,
  inputTextPlaceholder: css`
    font-size: ${FONT_SIZE.PETITE};
  `,
  inputTextFocused: css`
    border: 1px ${COLOR.PRIMARY_BLUE} solid;
  `,
  inputTextInvalid: css`
    border: 1px ${COLOR.RED} solid;
  `,
  inputTextIcon: css`
    position: absolute;
    elevation: 1;
    z-index: 1;
    left: 40px;
  `,
  labelContainer: css`
    flex-direction: row;
    align-items: center;
  `,
  label: css`
    font-size: ${FONT_SIZE.PETITE};
    color: ${COLOR.DARK_GRAY};
  `,
  labelInput: css`
    margin-top: 20px;
  `,
  labelError: css`
    margin-top: 8px;
    font-size: ${FONT_SIZE.TINY};
    color: ${COLOR.RED};
  `,
  list: css`
    margin-top: 8px;
    padding-horizontal: 32px;
  `,
  listEnd: css`
    margin-right: 48px;
  `,
  item: css`
    padding: 4px;
    margin-right: 8px;
    justify-content: center;
  `,
  card: css`
    min-width: 95px;
    background-color: ${COLOR.WHITE};
  `,
  cardSelected: css`
    border: 1px solid ${COLOR.PRIMARY_BLUE};
    background-color: ${COLOR.SOFT_LIGHT_BLUE};
  `,
  itemText: css`
    font-size: ${FONT_SIZE.HUGE};
    color: ${COLOR.BLACK};
    align-self: center;
  `,
  itemTextSelected: css`
    color: ${COLOR.BLACK};
  `,
  disabledInputContainerStyle: css`
    border-color: ${COLOR.TRANSPARENT};
  `,

  disabledInputTextStyle: css`
    color: ${COLOR.MEDIUM_GRAY};
  `,
  disabledCardStyle: css`
    border: 0;
    background-color: ${COLOR.WHITE};
    shadow-color: ${COLOR.TRANSPARENT};
    elevation: 0;
  `,
  disabledTextStyle: css`
    color: ${COLOR.DARK_GRAY};
  `
};
