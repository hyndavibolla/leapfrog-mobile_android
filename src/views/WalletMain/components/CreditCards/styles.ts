import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE, MEASURE } from '_constants';

export const styles = {
  container: css`
    background-color: ${COLOR.LIGHT_GRAY};
    flex: 1;
  `,
  contentContainer: css`
    flex-grow: 1;
    justify-content: center;
  `,
  switchContainer: css`
    margin: 36px 40px 24px;
  `,
  imageContainer: css`
    margin: 0 32px 16px;
  `,
  image: css`
    align-self: center;
    border-radius: 4px;
  `,
  sectionContainer: css`
    margin: 0 16px;
  `,
  title: css`
    font-family: ${FONT_FAMILY.HEAVY};
    text-align: center;
    color: ${COLOR.BLACK};
    letter-spacing: 0;
    line-height: 30px;
  `,
  ecmTitle: css`
    margin-horizontal: 48px;
    margin-bottom: 4px;
  `,
  nonEcmTitle: css`
    margin-horizontal: 32px;
    margin-bottom: 4px;
  `,
  ecmParagraph: css`
    margin: 0 16px;
  `,
  nonEcmParagraph: css`
    margin-top: 8px;
    margin-bottom: 4px;
  `,
  text: css`
    text-align: center;
    font-size: ${FONT_SIZE.SMALLER};
    line-height: 28px;
    color: ${COLOR.DARK_GRAY};
  `,
  contactText: css`
    text-transform: uppercase;
    font-size: ${FONT_SIZE.TINY};
    letter-spacing: 0;
  `,
  availableText: css`
    font-size: ${FONT_SIZE.SMALLER};
    letter-spacing: 0;
    margin: 0 0 8px;
  `,
  link: css`
    color: ${COLOR.PRIMARY_BLUE};
    letter-spacing: 0;
  `,
  linkNonECM: css`
    margin-bottom: 8px;
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
    line-height: 30px;
    font-family: ${FONT_FAMILY.BOLD};
  `,
  spinnerContainer: css`
    position: absolute;
    flex: 1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    justify-content: center;
    background-color: ${COLOR.LIGHT_GRAY};
  `,
  modalContainer: css`
    flex: 1;
    width: 100%;
    align-items: center;
    background-color: ${COLOR.WHITE};
    padding-top: ${MEASURE.MODAL_PADDING}px;
    border-radius: 10px;
  `,
  modalTitle: css`
    padding-top: 0;
    font-weight: bold;
    color: ${COLOR.BLACK};
  `,
  modalImageContainer: css`
    margin: 20px 32px 16px;
  `,
  modalSectionContainer: css`
    margin: 0 44px 20px;
  `,
  modalText: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALLER};
    font-weight: bold;
    letter-spacing: 0;
    line-height: 20px;
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
    padding: 10px;
  `,
  modalBenefits: css`
    margin-top: 20px;
    align-self: center;
  `,
  cardLinkContainer: css`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${COLOR.LIGHT_GRAY};
    width: 100%;
    padding-top: 8px;
  `,
  /* TODO: Fix this color, which is not the standard BLACK, but it's the one that matches the design */
  cardLink: css`
    color: #161c19;
    font-size: ${FONT_SIZE.EXTRA_TINY};
    text-decoration: underline;
  `
};
