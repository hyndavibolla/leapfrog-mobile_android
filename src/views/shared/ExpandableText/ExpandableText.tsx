import React, { memo, useCallback, useState, useRef, useEffect, useContext, useMemo } from 'react';
import { Text, NativeSyntheticEvent, TextLayoutEventData, LayoutChangeEvent, Animated } from 'react-native';
import { COLOR } from '_constants';

import { GlobalContext } from '../../../state-mgmt/GlobalState';
import { useTestingHelper } from '../../../utils/useTestingHelper';
import { styles } from './styles';

export interface Props {
  numberOfLines?: number;
  text?: string;
}

const minimumCollapsibleHeight = 120;
const expandedCollapsiblePadding = 72;

const ExpandableText = ({ numberOfLines, text }: Props) => {
  const translation = useRef(new Animated.Value(minimumCollapsibleHeight)).current;
  const [showLoadMoreDescription, setShowLoadMoreDescription] = useState(false);
  const [showMoreButtonPressed, setShowMoreButtonPressed] = useState(false);
  const [showMoreButtonLocation, setShowMoreButtonLocation] = useState({ top: 0, right: 0 });
  const [textContainerHeight, setTextContainerHeight] = useState(minimumCollapsibleHeight);
  const [toggleButton, setToggleButton] = useState(false);

  const {
    deps: {
      nativeHelperService: { platform, dimensions }
    }
  } = useContext(GlobalContext);

  const { getTestIdProps } = useTestingHelper('expandable-text');

  const isAndroid = useMemo(() => platform.OS === 'android', [platform]);
  const width = useMemo(() => dimensions.getWindowWidth(), [dimensions]);

  useEffect(() => {
    if (toggleButton) {
      Animated.timing(translation, {
        toValue: textContainerHeight,
        useNativeDriver: false,
        duration: 20
      }).start();
    } else {
      Animated.timing(translation, {
        toValue: minimumCollapsibleHeight,
        useNativeDriver: false,
        duration: 100
      }).start(() => {
        setShowMoreButtonPressed(false);
      });
    }
  }, [translation, toggleButton, textContainerHeight]);

  const onTextLayout = useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      const {
        nativeEvent: { lines }
      } = event;

      if (isAndroid && lines.length > numberOfLines) {
        setShowLoadMoreDescription(true);
        setShowMoreButtonLocation({
          top: numberOfLines * lines[0].height - 1,
          right: 20
        });
      } else if (!isAndroid && lines.length >= numberOfLines && lines[numberOfLines - 1].text.length > 60) {
        setShowLoadMoreDescription(true);
        setShowMoreButtonLocation({
          top: numberOfLines * lines[0].height - 1,
          right: width - lines[numberOfLines - 1].width - 20
        });
      }
    },
    [numberOfLines, isAndroid, width]
  );

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setTextContainerHeight(event?.nativeEvent?.layout?.height + expandedCollapsiblePadding);
  }, []);

  return (
    <Animated.View
      {...getTestIdProps('container')}
      style={[
        styles.detailSection,
        styles.descriptionContainer,
        styles.descriptionDirection,
        {
          overflow: 'hidden',
          height: translation
        }
      ]}
    >
      <Text
        numberOfLines={toggleButton ? 0 : numberOfLines}
        style={styles.description}
        onTextLayout={onTextLayout}
        onLayout={onLayout}
        {...getTestIdProps('text')}
      >
        {text.trim()}
      </Text>

      {showLoadMoreDescription && (
        <Text
          style={[
            styles.description,
            !showMoreButtonPressed
              ? {
                  position: 'absolute',
                  backgroundColor: COLOR.WHITE,
                  right: showMoreButtonLocation.right,
                  top: showMoreButtonLocation.top
                }
              : null
          ]}
        >
          {!showMoreButtonPressed ? '... ' : null}
          <Text
            onPress={() => {
              if (showMoreButtonPressed) {
                setToggleButton(false);
              } else {
                setShowMoreButtonPressed(true);
                setToggleButton(true);
              }
            }}
            style={styles.showMoreDescription}
            {...getTestIdProps('show-text-pressable')}
          >
            {!showMoreButtonPressed ? 'Show more' : 'Show less'}
          </Text>
        </Text>
      )}
    </Animated.View>
  );
};

export default memo(ExpandableText);
