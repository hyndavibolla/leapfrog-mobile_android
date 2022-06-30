import { css } from '@emotion/native';
import { COLOR } from '../../../constants/styles';

export const styles = {
  container: css`
    padding: 24px 20px;
    background-color: ${COLOR.LIGHT_GRAY};
    flex: 1;
  `,
  horizontalContent: css`
    margin-bottom: 32px;
  `,
  horizontalItem: css`
    margin-right: 16px;
  `
};
