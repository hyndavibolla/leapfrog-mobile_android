import styled, { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export interface Props {
  isInvalid?: boolean;
}

export const TextInputStyled = styled.TextInput<Props>`
  background-color: ${COLOR.WHITE};
  border: 1px ${({ isInvalid }) => (isInvalid ? COLOR.RED : COLOR.TRANSPARENT)} solid;
  border-radius: 50px;
  height: 40px;
  padding: 0 16px;
  width: 190px;
`;

export const styles = {
  inputIconContainer: css`
    justify-content: center;
  `,
  inputIcon: css`
    position: absolute;
    padding: 8px;
    right: 0;
  `,
  inputIconSmallContainer: css`
    padding: 0;
  `,
  lottieContainer: css`
    position: absolute;
    right: 15px;
  `,
  lottieIcon: css`
    height: 20px;
    width: 20px;
  `,
  subTitle: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.TINY};
    font-family: ${FONT_FAMILY.MEDIUM};
    line-height: ${FONT_SIZE.SMALLER};
    text-align: center;
    margin-top: 4px;
  `,
  subTitleError: css`
    color: ${COLOR.RED};
  `,
  blueSubTitle: css`
    color: ${COLOR.PRIMARY_BLUE};
  `,
  toast: css`
    background-color: ${COLOR.GREEN};
    padding: 8px 0;
    border-radius: 100px;
    width: 190px;
  `,
  toastText: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.PETITE};
    font-family: ${FONT_FAMILY.BOLD};
    line-height: ${FONT_SIZE.REGULAR};
    margin-left: 8px;
    text-align: center;
  `,
  button: css`
    flex-direction: row;
    align-items: center;
    background-color: ${COLOR.PRIMARY_BLUE};
    padding: 8px 20px;
    border-radius: 100px;
  `,
  buttonText: css`
    color: ${COLOR.WHITE};
    font-size: ${FONT_SIZE.PETITE};
    font-family: ${FONT_FAMILY.BOLD};
    line-height: ${FONT_SIZE.REGULAR};
    margin-left: 8px;
    text-align: center;
  `
};
