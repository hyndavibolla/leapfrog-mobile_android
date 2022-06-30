import { css } from '@emotion/native';

import { MEASURE } from '../../../constants';

export const styles = {
  container: css`
    flex-direction: column;
    justify-content: space-between;
    padding: ${MEASURE.CARD_PADDING}px;
    border-radius: 8px;
  `
};
