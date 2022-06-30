import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE, MEASURE } from '../../constants';

export const styles = {
  contentContainer: css`
    flex: 1;
    justify-content: center;
    background-color: ${COLOR.LIGHT_GRAY};
  `,
  switchContainer: css`
    margin: 36px 40px 24px 40px;
  `,
  imageContainer: css`
    margin: 0px 28px 16px 28px;
  `,
  image: css`
    align-self: center;
  `,
  sectionContainer: css`
    margin: 0 16px;
  `,
  title: css`
    font-family: ${FONT_FAMILY.HEAVY};
    text-align: center;
    letter-spacing: 0;
  `,
  ecmTitle: css`
    margin-horizontal: 52px;
    margin-bottom: 4px;
  `,
  nonEcmTitle: css`
    margin: 28px 28px 4px;
  `,
  nonEcmParagraph: css`
    margin-top: 8px;
    margin-bottom: 4px;
  `,
  text: css`
    text-align: center;
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.HUGE};
    color: ${COLOR.DARK_GRAY};
  `,
  link: css`
    color: ${COLOR.PRIMARY_BLUE};
    letter-spacing: 0;
  `,
  linkNonECM: css`
    margin-bottom: 8px;
    margin-top: 0px;
  `,
  buttonContainer: css`
    margin: 8px 40px 20px;
  `,
  buttonOuter: css`
    width: 100%;
  `,
  buttonInner: css`
    padding: 8px 0;
    background-color: ${COLOR.PRIMARY_BLUE};
  `,
  buttonText: css`
    font-size: ${FONT_SIZE.SMALL};
    letter-spacing: 0;
    line-height: ${FONT_SIZE.HUGE};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  modalContainer: css`
    flex: 1;
    align-items: center;
    background-color: ${COLOR.WHITE};
    padding-top: ${MEASURE.MODAL_PADDING}px;
    border-radius: 10px;
  `,
  modalTitle: css`
    padding-top: 40px;
  `,
  modalImageContainer: css`
    margin: 20px 28px 16px;
  `,
  modalSectionContainer: css`
    margin: 0 20px 20px;
  `,
  modalText: css`
    font-size: ${FONT_SIZE.SMALLER};
    letter-spacing: 0;
    text-align: center;
  `,
  modalImage: css`
    align-self: center;
    width: 80px;
    height: 50px;
    border-radius: 4px;
  `,
  modalBenefitsContainer: css`
    background-color: ${COLOR.LIGHT_GRAY};
    width: 100%;
  `,
  modalBenefits: css`
    margin-top: 20px;
    align-self: center;
  `,
  cardLinkContainer: css`
    flex: 1;
    align-items: center;
    background-color: ${COLOR.LIGHT_GRAY};
    width: 100%;
    padding-bottom: 52px;
    padding-top: 8px;
  `,
  cardLink: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.EXTRA_TINY};
    text-decoration: underline;
  `,
  modal: css`
    padding-bottom: 0px;
    padding-top: 8px;
    height: 95%;
  `,
  largeContainer: css`
    flex: 1;
    align-items: center;
    background-color: ${COLOR.LIGHT_GRAY};
    padding-top: 20px;
  `,
  closeButton: css`
    top: 20px;
  `
};
