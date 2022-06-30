const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
  gestureIsClickThreshold: 5
};

const swipeDirections = {
  swipeUp: 'SWIPE_UP',
  swipeDown: 'SWIPE_DOWN'
};

export const handleShouldSetPanResponder = ({ nativeEvent: { touches } }, gestureState) => {
  return touches.length === 1 && !gestureIsClick(gestureState);
};

export const gestureIsClick = ({ dx, dy }) => {
  return Math.abs(dx) < swipeConfig.gestureIsClickThreshold && Math.abs(dy) < swipeConfig.gestureIsClickThreshold;
};

export const handlePanResponderEnd = (gestureState, onSwipeUp, onSwipeDown) => {
  const swipeDirection = getSwipeDirection(gestureState);
  triggerSwipeHandlers(swipeDirection, onSwipeUp, onSwipeDown);
};

export const triggerSwipeHandlers = (swipeDirection, onSwipeUp, onSwipeDown) => {
  const { swipeUp, swipeDown } = swipeDirections;
  switch (swipeDirection) {
    case swipeUp:
      onSwipeUp();
      break;
    case swipeDown:
      onSwipeDown();
      break;
  }
};

export const getSwipeDirection = gestureState => {
  const { swipeUp, swipeDown } = swipeDirections;
  if (isValidVerticalSwipe(gestureState)) {
    return gestureState.dy > 0 ? swipeDown : swipeUp;
  }
  return null;
};

export const isValidVerticalSwipe = ({ vy, dx }) => {
  const { velocityThreshold, directionalOffsetThreshold } = swipeConfig;
  return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
};

export const isValidSwipe = (velocity, velocityThreshold, directionalOffset, directionalOffsetThreshold) => {
  return Math.abs(velocity) > velocityThreshold && Math.abs(directionalOffset) < directionalOffsetThreshold;
};
