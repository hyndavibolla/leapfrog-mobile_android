import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

const styles = {
  container: css`
    padding: 32px 20px;
  `,
  howItWorkSection: css`
    margin-top: 16px;
  `,
  topDescription: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    font-size: ${FONT_SIZE.PETITE};
    color: ${COLOR.DARK_GRAY};
    line-height: ${FONT_SIZE.MEDIUM};
    margin-top: 16px;
  `,
  termsSection: css`
    margin-top: 32px;
  `,
  bottomDescription: css`
    margin-top: 16px;
    font-size: ${FONT_SIZE.TINY};
    color: ${COLOR.DARK_GRAY};
    line-height: ${FONT_SIZE.SMALL};
  `
};

export default styles;
