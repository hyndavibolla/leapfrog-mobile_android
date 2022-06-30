import { css } from '@emotion/native';
import { COLOR, colorWithOpacity, FONT_FAMILY, FONT_SIZE } from '../../../constants';

const styles = {
  button: css`
    background-color: ${COLOR.PRIMARY_BLUE};
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    height: 52px;
    width: 168px;
  `,
  buttonActivated: css`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 52px;
    width: 168px;
  `,
  buttonText: css`
    color: ${COLOR.WHITE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  buttonTextActivated: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALLER};
    margin-left: 4px;
  `,
  container: css`
    background-color: ${COLOR.WHITE};
    justify-content: space-between;
    padding: 24px 20px 28px 20px;
    box-shadow: 0px -2px 10px ${colorWithOpacity(COLOR.DARK_GRAY, 20)};
    elevation: 3;
    flex-direction: row;
  `,
  rowContainer: css`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: flex-end;
  `,
  rewardsCol: css`
    margin-right: 28px;
  `,
  rewardsPill: css`
    padding: 8px;
  `,
  pillActivated: css`
    background-color: ${COLOR.SOFT_PRIMARY_BLUE};
  `,
  pillText: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.MEDIUM};
  `,
  pillTextActivated: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.MEDIUM};
  `,
  rewardsPillIcon: css`
    width: 18px;
    height: 18px;
  `,
  rewardsTitle: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.BOLD};
    margin-bottom: 8px;
  `
};

export default styles;
