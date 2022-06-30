import { css } from '@emotion/native';

import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../../constants';

export const styles = {
  container: css`
    width: 100%;
    height: 121px;
    padding: 0 16px;
    margin-top: 20px;
  `,
  mapContainer: css`
    width: 100%;
    height: 100%;
    border-radius: 6px;
    overflow: hidden;
  `,
  map: css`
    width: 100%;
    height: 100%;
  `,
  image: css`
    width: 20px;
    height: 20px;
  `,
  markerContainer: css`
    flex: 1;
    justify-content: center;
    align-items: center;
  `,
  marker: css`
    width: 28px;
    height: 28px;
    background-color: ${COLOR.WHITE};
    border-radius: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid ${COLOR.PURPLE};
  `,
  triangle: css`
    border-style: solid;
    border-top-width: 5px;
    border-right-width: 5px;
    border-left-width: 5px;
    border-bottom-width: 0;
    border-top-color: ${COLOR.PURPLE};
    border-right-color: ${COLOR.TRANSPARENT};
    border-bottom-color: ${COLOR.TRANSPARENT};
    border-left-color: ${COLOR.TRANSPARENT};
  `,
  milesLabelContainer: css`
    position: absolute;
    top: 4px;
    left: 4px;
  `,
  milesLabel: css`
    height: 22px;
    padding: 0 4px;
    border-radius: 3px;
    margin-top: 4px;
    margin-left: 4px;
    background-color: ${COLOR.WHITE};
    justify-content: center;
    align-items: center;
  `,
  milesLabelText: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.TINY};
    color: ${COLOR.DARK_GRAY};
    text-align: center;
  `,
  milesLabelSelected: css`
    background-color: ${COLOR.SOFT_PURPLE};
  `,
  milesLabelTextSelected: css`
    color: ${COLOR.PURPLE};
  `,
  cardContainer: css`
    flex: 1;
    background-color: ${COLOR.WHITE};
    padding: 4px;
    border-radius: 6px;
  `,
  imageBackground: css`
    flex: 1;
    align-items: center;
    justify-content: center;
  `,
  fallbackContentContainer: css`
    flex: 1;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  fallbackText: css`
    font-size: ${FONT_SIZE.PETITE};
    font-family: ${FONT_FAMILY.SEMIBOLD};
    color: ${COLOR.RED};
    margin-left: 16px;
  `,
  stars: css`
    flex-direction: row;
    margin-left: 0;
    padding: 4px;
    position: absolute;
    top: 4px;
    right: 4px;
    background-color: ${COLOR.WHITE};
    border-radius: 3px;
  `
};
