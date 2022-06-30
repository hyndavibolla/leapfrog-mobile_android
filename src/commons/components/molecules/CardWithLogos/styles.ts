import { css } from '@emotion/native';
import { COLOR } from '_constants/styles';

export const styles = {
  cardContainer: css`
    align-items: center;
    background-color: ${COLOR.WHITE};
    border-radius: 8px;
    flex-direction: row;
    justify-content: space-around;
    padding: 16px;
  `,
  itemsContainer: css`
    flex: 1;
    margin-left: 16px;
    justify-content: flex-end;
  `,
  /** @todo Height & width should not be sent like this. The size prop of BrandLogo is not doing anything. */
  item: css`
    height: 36px;
    width: 36px;
  `,
  itemSpacing: css`
    margin-left: 8px;
  `
};
