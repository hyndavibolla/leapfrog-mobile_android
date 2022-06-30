import { memorize } from '../../../../utils/memorize';
import { styles } from '../styles';
import { ModalSize, ModalType, ModalSizeToHeightMap } from './constants';

interface props {
  height: number;
  modalHeight: number;
  size: ModalSize;
  type: ModalType;
}

const getContainerStyle = ({ height, modalHeight, size, type }: props) => {
  switch (type) {
    case ModalType.BOTTOM:
      if (size === ModalSize.FULL_SCREEN) return [styles.containerBottom, styles.containerBottomFullScreen];
      else if (size !== ModalSize.DYNAMIC) return [styles.containerBottom, { maxHeight: (ModalSizeToHeightMap[size] * height) / 100 }];
      return [styles.containerBottom];
    case ModalType.CENTER:
      if (size === ModalSize.DYNAMIC) return [styles.containerCenter, styles.containerCenterDynamic, { bottom: (height - modalHeight) / 2 }];
      const center = (ModalSizeToHeightMap[size] * height) / 100;
      return [styles.containerCenter, { height: center, bottom: (height - center) / 2 }];
  }
};

export default memorize(getContainerStyle);
