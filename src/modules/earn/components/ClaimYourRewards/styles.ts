import { FONT_SIZE, LINE_HEIGHT, FONT_FAMILY } from '_constants';
import { css } from '@emotion/native';

export const styles = {
  list: css`
    padding-bottom: 0px;
  `,
  sectionMain: css`
    padding-horizontal: 16px;
    padding-bottom: 4px;
  `,
  streakSectionHeader: css`
    padding-bottom: 16px;
    justify-content: space-between;
  `,
  claimRewardsListContainer: css`
    padding-horizontal: 16px;
  `,
  ctaButtonContainer: css`
    flex-direction: row;
    padding: 4px 12px;
    border-radius: 30px;
    margin-right: auto;
    align-items: center;
  `,
  ctaButtonContent: css`
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${LINE_HEIGHT.REGULAR};
    font-family: ${FONT_FAMILY.BOLD};
    margin-right: 8px;
  `
};
