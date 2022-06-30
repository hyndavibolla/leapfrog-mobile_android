export enum ModalType {
  CENTER = 'center',
  BOTTOM = 'bottom'
}

export enum ModalSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  EXTRA_LARGE = 'extralarge',
  DYNAMIC = 'dynamic',
  FULL_SCREEN = 'fullscreen'
}

export const ModalSizeToHeightMap = {
  [ModalSize.SMALL]: 40,
  [ModalSize.MEDIUM]: 50,
  [ModalSize.EXTRA_LARGE]: 80,
  [ModalSize.FULL_SCREEN]: 100
};
