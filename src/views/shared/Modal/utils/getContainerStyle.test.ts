import { styles } from '../styles';
import getContainerStyle from './getContainerStyle';
import { ModalSize, ModalType, ModalSizeToHeightMap } from './constants';

describe('getContainerStyle', () => {
  let size: ModalSize;
  let type: ModalType;
  let height: number;
  let modalHeight: number;

  beforeEach(() => {
    size = ModalSize.DYNAMIC;
    type = ModalType.BOTTOM;
    height = 500;
    modalHeight = 500;
  });

  it('should return with values by default', () => {
    expect(getContainerStyle({ type, size, height, modalHeight })).toEqual([styles.containerBottom]);
  });

  it('should return with type bottom and size full screen', () => {
    size = ModalSize.FULL_SCREEN;
    expect(getContainerStyle({ type, size, height, modalHeight })).toEqual([styles.containerBottom, styles.containerBottomFullScreen]);
  });

  it('should return with type bottom, size different to dynamic and full screen', () => {
    size = ModalSize.EXTRA_LARGE;
    expect(getContainerStyle({ type, size, height, modalHeight })).toEqual([
      styles.containerBottom,
      { maxHeight: (ModalSizeToHeightMap[size] * height) / 100 }
    ]);
  });

  it('should return with type bottom and size equal to dynamic', () => {
    size = ModalSize.DYNAMIC;
    expect(getContainerStyle({ type, size, height, modalHeight })).toEqual([styles.containerBottom]);
  });

  it('should return with type center and size dynamic', () => {
    type = ModalType.CENTER;
    expect(getContainerStyle({ type, size, height, modalHeight })).toEqual([
      styles.containerCenter,
      styles.containerCenterDynamic,
      { bottom: (height - modalHeight) / 2 }
    ]);
  });

  it('should return with type center and size different to dynamic', () => {
    type = ModalType.CENTER;
    size = ModalSize.FULL_SCREEN;
    const center = (ModalSizeToHeightMap[size] * height) / 100;
    expect(getContainerStyle({ type, size, height, modalHeight })).toEqual([styles.containerCenter, { height: center, bottom: (height - center) / 2 }]);
  });
});
