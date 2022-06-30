import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

export const styles = {
  container: css`
    padding-horizontal: 16px;
  `,
  titleContainer: css`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 32px 0 0 4px;
  `,
  title: css`
    margin-bottom: 12px;
  `,
  subtitleContainer: css`
    flex-direction: row;
    margin-bottom: 16px;
  `,
  subtitle: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.TINY};
    line-height: ${FONT_SIZE.PETITE};
    font-family: ${FONT_FAMILY.MEDIUM};
    padding-left: 8px;
    flex-shrink: 1;
  `,
  modal: css`
    padding: 72px 20px 0;
  `,
  closeButtonModal: css`
    top: 20px;
    right: 20px;
  `,
  cardLinkMainTitle: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.BIG};
    line-height: 30px;
    font-family: ${FONT_FAMILY.HEAVY};
    margin-bottom: 24px;
    text-align: center;
  `,
  cardLinkTitle: css`
    color: ${COLOR.BLACK};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    font-family: ${FONT_FAMILY.HEAVY};
    margin-vertical: 4px;
  `,
  cardLinkSubtitle: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.SMALLER};
    line-height: ${FONT_SIZE.BIG};
    font-family: ${FONT_FAMILY.MEDIUM};
    margin-bottom: 32px;
  `,
  cardLinkSubtitleLastChild: css`
    margin-bottom: 72px;
  `,
  imageContainer: css`
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  checkImage: css`
    margin-bottom: 4px;
    margin-right: -4px;
  `,
  lightDescriptionText: css`
    font-size: ${FONT_SIZE.TINY};
    line-height: ${FONT_SIZE.PETITE};
    color: ${COLOR.DARK_GRAY};
    margin-top: 16px;
    margin-bottom: 20px;
  `
};
