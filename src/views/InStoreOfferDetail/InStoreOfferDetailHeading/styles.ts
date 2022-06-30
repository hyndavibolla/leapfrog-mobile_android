import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

const styles = {
  backButton: css`
    margin-left: 20px;
    margin-top: 52px;
  `,
  header: css`
    background-color: ${COLOR.WHITE};
  `,
  imageContainer: css`
    padding-right: 16px;
  `,
  subtitleContainer: css`
    flex-direction: row;
    padding-top: 4px;
    align-items: center;
    justify-content: space-between;
  `,
  storeBrand: css`
    overflow: hidden;
    flex: 1;
  `,
  storeDistance: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
  `,
  storeInfo: css`
    flex-direction: row;
    padding: 24px;
    padding-top: 0;
    overflow: hidden;
  `,
  statusOfActivation: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    padding-left: 4px;
    font-size: ${FONT_SIZE.TINY};
    line-height: ${FONT_SIZE.SMALL};
  `,
  activated: css`
    color: ${COLOR.PURPLE};
  `,
  pending: css`
    color: ${COLOR.DARK_GRAY};
  `,
  storeNameContainer: css`
    flex-direction: row;
    padding-right: 20px;
  `,
  storeName: css`
    font-size: ${FONT_SIZE.MEDIUM};
    font-family: ${FONT_FAMILY.BOLD};
  `
};

export default styles;
