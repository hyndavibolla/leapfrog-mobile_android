import { css } from '@emotion/native';

export enum COLOR {
  BLACK = '#262C2F',
  BLACK_DARK = '#000000',
  DARK_GRAY = '#909BA0',
  GRAY = '#E2E3E3',
  MEDIUM_GRAY = '#EBEDF2',
  LIGHT_GRAY = '#F5F7FA',
  WHITE = '#FFFFFF',
  LIGHT_WHITE = '#F5F5F5',
  PRIMARY_BLUE = '#0066CC',
  PRIMARY_LIGHT_BLUE = '#02AEEF',
  MEDIUM_LIGHT_BLUE = '#B3E6FA',
  SOFT_LIGHT_BLUE = '#E5F6FD',
  SOFT_PRIMARY_BLUE = '#DDE8F5',
  SOFT_PRIMARY_LIGHT_BLUE = '#005AC2',
  GRAY_SHADOW = '#0F1D66',
  PRIMARY_YELLOW = '#F7B500',
  SOFT_YELLOW = '#F9E5AF',
  ORANGE = '#FF5F00',
  GREEN = '#34C06B',
  SOFT_GREEN = '#D6F2E1',
  MEDIUM_GREEN = '#8DC63F',
  DARK_GREEN = '#169B4A',
  RED = '#E02020',
  SOFT_RED = '#FCE9E9',
  PURPLE = '#B361DF',
  SOFT_PURPLE = '#F3EBF7',
  PINK = '#FB5F93',
  SOFT_PINK = '#F2E3ED',
  TRANSPARENT = 'transparent',
  SKELETON_GRAY = '#DFE3EC',
  BLUE_NAVIGATION = '#3F8EDC'
}

export const colorWithOpacity = (color: COLOR, opacity: number) => `${color}${opacity}`;

export enum FONT_FAMILY {
  BOLD = 'SFProDisplay-Bold',
  MEDIUM = 'SFProDisplay-Medium',
  SEMIBOLD = 'SFProDisplay-SemiBold',
  THIN = 'SFProDisplay-Thin',
  HEAVY = 'SFProDisplay-Heavy'
}

export const MEASURE = {
  CARD_PADDING: '20',
  MODAL_PADDING: '20',
  MODAL_TITLE_TOP_PADDING: '50'
};

export enum FONT_SIZE {
  XL_2X = '120px',
  XL = '60px',
  XXL = '70px',
  BIGGER = '48px',
  REGULAR_2X = '40px',
  SMALLER_2X = '34px',
  HUGER = '30px',
  HUGE = '26px',
  BIG = '24px',
  MEDIUM = '22px',
  REGULAR = '20px',
  SMALL = '18px',
  SMALLER = '16px',
  PETITE = '14px',
  TINY = '12px',
  EXTRA_TINY = '10px'
}

export enum LINE_HEIGHT {
  HUGE = '36px',
  BIG = '30px',
  MEDIUM_2X = '28px',
  MEDIUM = '24px',
  PARAGRAPH = '22px',
  REGULAR = '20px',
  SMALL = '18px'
}

export const NAVIGATOR_TAB = {
  label: css`
    font-family: ${FONT_FAMILY.BOLD};
    font-size: ${FONT_SIZE.TINY};
  `,
  indicator: css`
    color: ${COLOR.PRIMARY_BLUE};
    background-color: ${COLOR.PRIMARY_BLUE};
    height: 5px;
  `
};

export const CONTAINER_STYLE = {
  shadow: css`
    shadow-color: ${COLOR.BLACK};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.1;
    elevation: 3;
    background-color: transparent;
  `,
  absoluteFill: css`
    position: absolute;
    right: 0px;
    left: 0px;
    bottom: 0px;
    top: 0px;
  `
};

export const CUSTOM_MAP_STYLES = [
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  }
];
