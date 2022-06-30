import React, { PropsWithChildren, memo, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import { View, Modal as RNModal, TouchableHighlight, ViewStyle, LayoutChangeEvent, ModalProps, Platform, StyleProp } from 'react-native';
import { View as AnimatedView } from 'react-native-animatable';

import { useEventTracker } from '_state_mgmt/core/hooks';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { Icon } from '_commons/components/atoms/Icon';
import { useTestingHelper } from '_utils/useTestingHelper';
import { usePrevious } from '_utils/usePrevious';
import { ModalType, ModalSize } from './utils/constants';
import { COLOR, CONTAINER_STYLE, ICON, FONT_SIZE } from '_constants';

import { Button } from '../Button';
import ErrorBoundary from '../ErrorBoundary';
import { styles } from './styles';
import getContainerStyle from './utils/getContainerStyle';

export interface Props extends ModalProps {
  type?: ModalType;
  size?: ModalSize;
  showCloseButton?: boolean;
  routeName?: string;
  onClose?: () => void;
  onPressOutside?: () => void;
  backdropStyle?: ViewStyle;
  style?: StyleProp<ViewStyle>;
  closeButtonStyle?: StyleProp<ViewStyle>;
}

export const Modal = ({
  type = ModalType.BOTTOM,
  size = ModalSize.DYNAMIC,
  showCloseButton = false,
  visible,
  routeName,
  onClose,
  onPressOutside,
  backdropStyle,
  style,
  closeButtonStyle,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const [modalHeight, setModalHeight] = useState<number>(0);
  const {
    deps: {
      nativeHelperService: {
        dimensions: { getWindowHeight }
      }
    }
  } = useContext(GlobalContext);
  const { getTestIdProps } = useTestingHelper('modal');
  const { trackView } = useEventTracker();
  const previouslyVisible = usePrevious(visible);

  const height = getWindowHeight();
  /* istanbul ignore next */
  const onViewLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      setModalHeight(nativeEvent.layout.height);
      if (routeName) trackView(routeName);
    },
    [trackView, routeName]
  );

  useEffect(() => {
    if (previouslyVisible && !visible && onClose) onClose();
  }, [previouslyVisible, visible, onClose]);

  const containerStyle = useMemo(() => getContainerStyle({ type, size, height, modalHeight }), [height, modalHeight, size, type]);

  return (
    <RNModal
      {...getTestIdProps('container')}
      {...props}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={true}
      statusBarTranslucent
    >
      {!visible ? null : (
        <ErrorBoundary>
          <View style={[styles.container, ...containerStyle, style]} onLayout={onViewLayout}>
            {showCloseButton ? (
              <Button
                {...getTestIdProps('close-btn')}
                onPress={onClose}
                containerColor={COLOR.WHITE}
                style={[
                  styles.closeBtnWrapper,
                  Platform.OS === 'ios' && styles.closeBtnWrapperIOS,
                  type === ModalType.CENTER && styles.closeBtnWrapperCenter,
                  closeButtonStyle
                ]}
                innerContainerStyle={[styles.innerCloseBtn, CONTAINER_STYLE.shadow]}
              >
                <View style={styles.closeIconContainer}>
                  <Icon name={ICON.CLOSE} color={COLOR.BLACK} size={FONT_SIZE.MEDIUM} />
                </View>
              </Button>
            ) : null}
            {children}
          </View>
          <AnimatedView animation="fadeIn" delay={400} duration={400} style={[styles.backdrop, backdropStyle]} useNativeDriver={true}>
            <TouchableHighlight
              underlayColor="transparent"
              {...getTestIdProps('backdrop')}
              onPress={onPressOutside ? onPressOutside : onClose}
              activeOpacity={0}
            >
              <View style={styles.backdropContent} />
            </TouchableHighlight>
          </AnimatedView>
        </ErrorBoundary>
      )}
    </RNModal>
  );
};

export default memo(Modal);
