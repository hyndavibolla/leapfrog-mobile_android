import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../constants';

const styles = {
  scroll: css`
    background-color: ${COLOR.LIGHT_GRAY};
    flex: 1;
    margin-bottom: 0;
    padding-bottom: 0;
  `,
  rowHeader: css`
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  `,
  halfColumn: css`
    width: 50%;
  `,
  floatingText: css`
    font-weight: bold;
    letter-spacing: 1px;
    color: ${COLOR.WHITE};
    font-family: ${FONT_FAMILY.HEAVY};
    font-size: ${FONT_SIZE.MEDIUM};
  `,
  detailPage: css`
    background-color: ${COLOR.WHITE};
    flex-direction: column;
    justify-content: center;
    height: 100%;
    padding-bottom: 0;
  `,
  detailContainer: css`
    background-color: ${COLOR.WHITE};
  `,
  detailPageScrollView: css`
    padding-bottom: 0;
  `,
  action: css`
    justify-content: center;
    align-items: center;
    height: 50px;
    flex: 1;
  `,
  actionText: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.SMALL};
  `,
  description: css`
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.MEDIUM};
    font-family: ${FONT_FAMILY.MEDIUM};
    color: ${COLOR.DARK_GRAY};
  `,
  descriptionContainer: css`
    padding: 20px;
    border-bottom-color: ${COLOR.MEDIUM_GRAY};
    border-bottom-width: 1px;
    border-style: solid;
  `,
  separator: css`
    width: 1px;
    background-color: ${COLOR.MEDIUM_GRAY};
    height: 30px;
  `,
  detailSection: css`
    flex-direction: row;
    border-top-color: ${COLOR.MEDIUM_GRAY};
    border-top-width: 1px;
    border-style: solid;
  `,
  actionsLine: css`
    align-items: center;
  `,
  descriptionRow: css`
    flex-direction: row;
    border-bottom-color: ${COLOR.MEDIUM_GRAY};
    border-bottom-width: 1px;
    border-style: solid;
    height: 50px;
    align-items: center;
    padding: 0 20px;
  `,
  descriptionLabel: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
    padding-left: 16px;
  `,
  closeLabel: css`
    color: ${COLOR.RED};
    font-size: ${FONT_SIZE.PETITE};
    font-family: ${FONT_FAMILY.BOLD};
    padding-left: 16px;
  `,
  hourMightDifferLabel: css`
    color: ${COLOR.ORANGE};
    font-size: ${FONT_SIZE.PETITE};
    font-family: ${FONT_FAMILY.BOLD};
    padding-left: 16px;
  `,
  hotlinkMap: css`
    margin-top: 16px;
  `,
  hotlinkMapText: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-family: ${FONT_FAMILY.SEMIBOLD};
  `,
  modalClose: css`
    justify-content: center;
    width: 14%;
    align-items: center;
  `,
  modalURL: css`
    color: ${COLOR.WHITE};
    width: 72%;
    justify-content: center;
    font-size: ${FONT_SIZE.MEDIUM};
    text-align: center;
  `,
  modelLoading: css`
    background-color: ${COLOR.WHITE};
    height: 100%;
  `,
  modalWebView: css`
    height: 92%;
  `,
  modelContent: css`
    height: 100%;
  `,
  fullDollar: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  emptyDollar: css`
    font-family: ${FONT_FAMILY.MEDIUM};
    color: ${COLOR.MEDIUM_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
  `,
  container: css`
    margin-top: 32px;
    padding: 0 16px;
  `,
  showMoreDescription: css`
    color: ${COLOR.PRIMARY_BLUE};
    font-size: ${FONT_SIZE.PETITE};
    line-height: ${FONT_SIZE.MEDIUM};
    font-family: ${FONT_FAMILY.BOLD};
  `,
  showLessDescription: css`
    margin-top: -${FONT_SIZE.MEDIUM};
  `,
  descriptionDirection: css`
    flex-direction: column;
  `
};

export default styles;
